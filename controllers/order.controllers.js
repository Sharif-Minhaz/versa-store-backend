const Order = require("../models/Order.model");
const Product = require("../models/Product.model");
const { ProductServices } = require("../services/product.services");
const { PaymentServices } = require("../services/payment.services");
const { throwError } = require("../utils/throwError");

// create an order
const createOrder = async (req, res) => {
	const { productId } = req.params;
	const { orderMethod, count } = req.body;

	if (!productId) throwError("Product id not found", 400);

	// find the product
	const product = await Product.findById(productId).populate("category").lean();

	// check if the product is still available or not
	if (!product)
		throwError("The product you want to buy, is not available or doesn't exist.", 404);

	// validate product' total price in the backend again
	const originalPrice = product.price * Number(count) + product.deliveryCharge;

	const orderedBy = req.user._id;
	const tranxId = crypto.randomUUID();

	// create new order
	const newOrder = await Order.create({
		...req.body,
		productId,
		totalPrice: originalPrice,
		productPrice: product.price,
		orderedBy,
		tranxId,
		deliveryCharge: product.deliveryCharge,
	});

	if (newOrder) await ProductServices.updateProductStock(productId, count, "DEC"); // decrement product from stock

	// fetch req to ssl-commerz to create session
	if (orderMethod === "online") {
		const paymentInfo = await PaymentServices.payment(
			{
				...req.body,
				productName: product.name,
				totalPrice: originalPrice,
				tranxId,
				productCategory: product?.category?.name || "stuff",
			},
			req.user // pass logged in user too
		);

		// add the payment url
		await Order.findOneAndUpdate(newOrder._id, { paymentUrl: paymentInfo.url });
		return res.status(200).json({ url: paymentInfo.url }); // TODO: redirect to ssl-commerz payment page
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
	await ProductServices.updateProductStock(order.productId, order.count, "INC");

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
	await ProductServices.updateProductStock(order.productId, order.count, "INC");

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

module.exports.OrderControllers = { createOrder, deleteOrder, acceptedOrder, rejectOrder };
