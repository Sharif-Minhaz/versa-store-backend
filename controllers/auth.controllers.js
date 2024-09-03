const getNewTokens = require("../utils/getNewTokens");
const { AuthServices } = require("../services/auth.services");
const Customer = require("../models/Customer.model");
const Vendor = require("../models/Vendor.model");
const Admin = require("../models/Admin.model");
const { bcryptCompare } = require("../utils/bcryptHashing");
const { BANNED_MESSAGE } = require("../consts");
const { throwError } = require("../utils/throwError");

// **************** customer's login system ****************
const login = async (req, res) => {
	const { email, password, loginFor = "customer" } = req.body;

	let user = null;
	// get the user info based on the role
	if (loginFor === "customer") {
		user = await Customer.findOne({ email }).select("+password").lean();
	} else if (loginFor === "vendor") {
		user = await Vendor.findOne({ email }).select("+password").lean();
	} else {
		// admin use-case
		user = await Admin.findOne({ email }).select("+password").lean();
	}

	if (!user) throwError("User not found", 404);
	if (user.isBan) throwError(BANNED_MESSAGE, 401);

	// check for matching password
	const isPasswordCorrect = bcryptCompare(password, user.password);

	if (!isPasswordCorrect) throwError("Invalid password", 400);

	// generate tokens
	const tokens = getNewTokens(user);

	// removing the password field from user
	const userInfo = Object.assign({}, user);
	delete userInfo.password;

	res.status(200).json({
		message: "Login successful",
		success: true,
		user: userInfo,
		tokens,
	});
};

// **************** google login ****************
const continueWithGoogle = async (req, res) => {
	res.status(201).json({
		success: true,
		message: "Google login success",
	});
};

// **************** registration process ****************
const register = async (req, res) => {
	const { registerFor = "customer" } = req.body;

	let user = null;
	// registration based on role
	if (registerFor === "customer") {
		// create the customer user
		user = await AuthServices.customerRegistration(req.body);
	} else {
		// for vendor type user
		// create the vendor user
		user = await AuthServices.vendorRegistration(req.body, req.file);
	}

	if (!user) throwError("Error registering user");
	if (user.isBan) throwError(BANNED_MESSAGE, 401);

	// generate tokens
	const tokens = getNewTokens(user);

	// delete the user password
	const userInfo = Object.assign({}, user);
	delete userInfo.password;

	res.status(200).json({
		success: true,
		user: userInfo._doc,
		tokens,
	});
};

// **************** refresh token generators ********************
const refreshToken = async (req, res) => {
	const { refreshToken } = req.body || {};

	if (!refreshToken) throwError("Please provide refresh Token", 400);

	const result = await AuthServices.refreshToken(refreshToken);

	res.status(200).json(result);
};

// **************** update user ****************
const updateUser = async (req, res) => {
	const updateFor = req.user?.user_type || "customer";

	let user = null;
	// registration based on role
	if (updateFor === "customer") {
		// update the customer user
		user = await AuthServices.customerUpdate(req);
	} else if (updateFor === "vendor") {
		// for vendor type user
		// update the vendor user
		user = await AuthServices.vendorUpdate(req);
	} else {
		// update admin
		user = await AuthServices.adminUpdate(req);
	}

	if (!user) throwError("Error registering user");
	if (user.isBan) throwError(BANNED_MESSAGE, 401);

	res.status(200).json({
		success: true,
		user,
	});
};

module.exports.AuthControllers = { refreshToken, login, register, continueWithGoogle, updateUser };
