const Order = require("../models/Order.model");
const Product = require("../models/Product.model");
const { ProductServices } = require("../services/product.services");
const { PaymentServices } = require("../services/payment.services");
const { throwError } = require("../utils/throwError");

// create an order
const createOrder = async (req, res) => {
	const { orderMethod, products, deliveryCharge } = req.body;

	if (products?.length === 0) throwError("No products found", 404);

	// retrieve all products promises
	const allProducts = products.map((item) => {
		return Product.findById(item.product).populate("category");
	});

	// resolve all promises
	const allProductsAvailable = await Promise.all(allProducts);

	// validate product' total price in the backend again
	const originalPrice = allProductsAvailable.reduce((prev, product) => {
		// find the associate count of the product
		const count = products.find((prod) => prod.product === product._id?.toString()).count;
		return Number(product.price) * count + prev;
	}, 0);

	const orderedBy = req.user._id;
	const tranxId = crypto.randomUUID();

	// create new order
	const newOrder = await Order.create({
		...req.body,
		products,
		totalPrice: originalPrice + deliveryCharge, // add delivery charge with the total price
		productPrice: originalPrice,
		orderedBy,
		tranxId,
		deliveryCharge,
	});

	if (newOrder) await ProductServices.updateProductStock(products, "DEC"); // decrement product from stock

	// fetch req to ssl-commerz to create session
	if (orderMethod === "online") {
		const paymentInfo = await PaymentServices.payment(
			{
				...req.body,
				productName: allProductsAvailable.map((product) => product).join(", "),
				totalPrice: originalPrice,
				tranxId,
				productCategory: "stuff",
			},
			req.user // pass logged in user too
		);

		// add the payment url
		await Order.findOneAndUpdate(newOrder._id, {
			paymentUrl: paymentInfo.url,
			status: "pending",
		});

		return res.redirect(paymentInfo.url);
	}
	res.status(201).json({ success: true, message: "Order created", order: newOrder });
};

// delete the order
const deleteOrder = async (req, res) => {
	const { orderId } = req.params;

	if (!orderId) throwError("Order id required", 400);

	// only unsuccess orders can be deleted
	const order = await Order.findOneAndDelete({ _id: orderId, status: { $ne: "success" } });

	if (!order) throwError("Order not found to delete", 404);

	// restore the stock count to the original product
	await ProductServices.updateProductStock(order.products, "INC");

	res.status(200).json({ success: true, message: "Order deleted successfully" });
};

// reject the order -> Admin only
const rejectOrder = async (req, res) => {
	const { orderId } = req.params;

	if (!orderId) throwError("Order id required", 400);

	// orders rejection
	const order = await Order.findByIdAndUpdate(
		orderId,
		{ status: "rejected", note: "Not enough payment" },
		{ new: true }
	);

	if (!order) throwError("Order not found to reject", 404);

	// restore the stock count to the original product
	await ProductServices.updateProductStock(order.products, "INC");

	res.status(200).json({ success: true, message: "Order rejected successfully" });
};

// accept the order -> Admin only
const acceptedOrder = async (req, res) => {
	const { orderId } = req.params;

	if (!orderId) throwError("Order id required", 400);

	// orders rejection
	const order = await Order.findByIdAndUpdate(orderId, { status: "accepted" }, { new: true });

	if (!order) throwError("Order not found to accept", 404);

	res.status(200).json({ success: true, message: "Order accepted successfully" });
};

// user specific orders
const findUserOrders = async (req, res) => {
	const orderedBy = req.user._id;

	if (!orderedBy) throwError("User id required", 400);

	// find orders
	const orders = await Order.find({ orderedBy: orderedBy })
		.populate({
			path: "products.product",
			select: "name description images price",
		})
		.populate("orderedBy")
		.lean();

	res.status(200).json({ success: true, orders });
};

const getAllOrders = async (req, res) => {
	const orders = await Order.find()
		.populate({
			path: "products.product",
			select: "name description images price",
		})
		.populate("orderedBy")
		.lean();

	res.status(200).json({ success: true, orders });
};

module.exports.OrderControllers = {
	createOrder,
	deleteOrder,
	acceptedOrder,
	rejectOrder,
	findUserOrders,
	getAllOrders,
};
