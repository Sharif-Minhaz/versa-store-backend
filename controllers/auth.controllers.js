const bcrypt = require("bcryptjs");
const getNewTokens = require("../utils/getNewTokens");
const Customer = require("../models/Customer.model");
const { AuthServices } = require("../services/auth.services");

// customer's login system
const customerLogin = async (req, res) => {
	const { email, password } = req.body;

	const customer = await Customer.findOne({ email }).lean();

	if (!customer) {
		throw new Error("Customer not found");
	}

	const isPasswordCorrect = bcrypt.compareSync(password, customer.password);

	if (!isPasswordCorrect) {
		throw new Error("Invalid password");
	}

	const tokens = getNewTokens(customer);

	res.status(200).json({
		customer,
		tokens,
	});
};

const customerRegister = async (req, res) => {
	const { email, password, firstName, lastName } = req.body;

	const customer = await Customer.exists({ email });

	if (customer) {
		throw new Error("Customer already exists");
	}

	const hashedPassword = bcrypt.hashSync(password, 8);

	const newCustomerData = {
		email,
		firstName,
		lastName,
		password: hashedPassword,
	};

	// add customer to db
	const newCustomer = await Customer.create(newCustomerData);

	const tokens = getNewTokens(newCustomer);

	res.status(200).json({
		customer,
		tokens,
	});
};

const refreshToken = async (req, res) => {
	const { refreshToken } = req.body || {};

	if (!refreshToken) {
		return res.status(400).json({ message: "Please provide refresh Token" });
	}

	const result = await AuthServices.refreshToken(refreshToken);

	res.status(200).json(result);
};

module.exports.AuthControllers = { refreshToken, customerLogin, customerRegister };
