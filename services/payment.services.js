const { fetch } = require("../utils/nodeFetch.cjs");
const Order = require("../models/Order.model");
const { ProductServices } = require("./product.services");

const payment = async (orderInfo, user) => {
	const {
		orderName,
		totalPrice,
		division,
		zilla,
		upazilla,
		phoneNumber,
		productName,
		houseNo,
		tranxId,
		productCategory,
		postCode,
	} = orderInfo;

	const paymentData = {
		price: totalPrice,
		productName,
		customer_name: orderName || user.fullName,
		customer_email: user.email,
		customer_add: `${division}, ${zilla}, ${upazilla}, House No: ${houseNo}`,
		customer_phone: phoneNumber,
		customer_postcode: postCode?.toString(),
		customer_country: "Bangladesh",
		product_category: productCategory,
		tran_id: tranxId,
	};

	const resultBuffer = await fetch(`${process.env.SERVER_URL}/payment/ssl-request`, {
		method: "POST",
		body: JSON.stringify(paymentData),
		headers: {
			"Content-Type": "application/json",
		},
	});

	const result = await resultBuffer.json();

	return result;
};

// cancel and order
const cancelPayment = async (req, res) => {
	const { tran_id } = req.query;
	const orderInfo = await Order.findOneAndUpdate(
		{ tranxId: tran_id },
		{ status: "cancelled" },
		{ new: true }
	);
	// update product stock
	await ProductServices.updateProductStock(orderInfo.productId, orderInfo.count, "INC");
	res.status(200).json({ success: true, message: "Payment cancelled successfully" });
};

// payment success
const successPayment = async (req, res) => {
	const { tran_id } = req.query;
	await Order.findOneAndUpdate({ tranxId: tran_id }, { status: "accepted" }, { new: true });

	res.status(200).json({ success: true, message: "Payment received successfully" });
};

// fail payment
const failPayment = async (req, res) => {
	const { tran_id } = req.query;
	const orderInfo = await Order.findOneAndUpdate(
		{ tranxId: tran_id },
		{ status: "failed" },
		{ new: true }
	);
	// update product stock
	await ProductServices.updateProductStock(orderInfo.productId, orderInfo.count, "INC");

	res.status(200).json({ success: true, message: "Payment failed" });
};

module.exports.PaymentServices = {
	payment,
	cancelPayment,
	successPayment,
	failPayment,
};
