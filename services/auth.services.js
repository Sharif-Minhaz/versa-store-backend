const jwt = require("jsonwebtoken");
const Customer = require("../models/Customer.model");
const getNewTokens = require("../utils/getNewTokens");

const refreshToken = (refreshToken) => {
	const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY);

	if (!decoded) {
		throw new Error("Invalid refresh token");
	}

	if (decoded.type !== "refresh") {
		throw new Error("Invalid token type");
	}

	// check if customer exists
	const customer = Customer.findById(decoded._id);

	if (!customer) {
		throw new Error("Customer not found");
	}

	const token = getNewTokens(customer);

	return token;
};

module.exports.AuthServices = {
	refreshToken,
};
