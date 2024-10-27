const { fetch } = require("../utils/nodeFetch.cjs");
const Order = require("../models/Order.model");
const { ProductServices } = require("./product.services");

const payment = async (orderInfo, user) => {
	const {
		orderName,
		totalPrice,
		division,
		district,
		subDistrict,
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
		customer_add: `${division}, ${district}, ${subDistrict}, House No: ${houseNo}`,
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
	await ProductServices.updateProductStock(orderInfo.products, orderInfo.count, "INC");
	res.redirect(`${process.env.CLIENT_URL}/`);
};

// payment success
const successPayment = async (req, res) => {
	const { tran_id } = req.query;
	await Order.findOneAndUpdate({ tranxId: tran_id }, { status: "accepted" }, { new: true });

	res.redirect(`${process.env.CLIENT_URL}/`);
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
	await ProductServices.updateProductStock(orderInfo.products, orderInfo.count, "INC");

	res.redirect(`${process.env.CLIENT_URL}/`);
};

module.exports.PaymentServices = {
	payment,
	cancelPayment,
	successPayment,
	failPayment,
};
