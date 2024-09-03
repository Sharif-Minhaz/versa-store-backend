const Order = require("../models/Order.model");

// create an order
const createOrder = async (req, res) => {
	console.log(req.body);
	res.status(201).json({ success: true, message: "Order created" });
};

// cancel and order
const cancelOrder = async (req, res) => {
	console.log(req.body);
	res.status(200).json({ success: true, message: "Order cancelled successfully" });
};

// order success
const successOrder = async (req, res) => {
	console.log(req.body);
	res.status(200).json({ success: true, message: "Order successfully" });
};

// fail order
const failOrder = async (req, res) => {
	console.log(req.body);
	res.status(200).json({ success: true, message: "Order failed" });
};

module.exports.OrderControllers = { createOrder, cancelOrder, successOrder, failOrder };
