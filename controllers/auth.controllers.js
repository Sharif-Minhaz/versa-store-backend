const getNewTokens = require("../utils/getNewTokens");
const { AuthServices } = require("../services/auth.services");
const Customer = require("../models/Customer.model");
const Vendor = require("../models/Vendor.model");
const Admin = require("../models/Admin.model");
const { bcryptCompare, bcryptHashing } = require("../utils/bcryptHashing");
const { uploadImageHandler } = require("../utils/uploadImage");
const { throwError } = require("../utils/throwError");

// customer's login system
const login = async (req, res) => {
	const { email, password, loginFor = "customer" } = req.body;

	let user = null;
	if (loginFor === "customer") {
		user = await Customer.findOne({ email }).select("+password").lean();
	} else if (loginFor === "vendor") {
		user = await Vendor.findOne({ email }).select("+password").lean();
	} else {
		user = await Admin.findOne({ email }).select("+password").lean();
	}

	if (!user) {
		throwError("User not found", 404);
	}

	const isPasswordCorrect = bcryptCompare(password, user.password);

	if (!isPasswordCorrect) {
		throwError("Invalid password", 400);
	}

	const tokens = getNewTokens(user);

	const userInfo = Object.assign({}, user);
	delete userInfo.password;

	res.status(200).json({
		message: "Login successful",
		success: true,
		user: userInfo,
		tokens,
	});
};

const continueWithGoogle = async (req, res) => {
	res.status(201).json({
		success: true,
		message: "Google login success",
	});
};

const register = async (req, res) => {
	const { registerFor = "customer", email, password, fullName } = req.body;

	let user = null;
	if (registerFor === "customer") {
		const [customer, vendor, admin] = await Promise.all([
			Customer.exists({ email }),
			Vendor.exists({ email }),
			Admin.exists({ email }),
		]);

		if (customer || vendor || admin) {
			throwError("Customer already exists", 409);
		}

		const hashedPassword = bcryptHashing(password);

		const newCustomerData = {
			email,
			fullName,
			password: hashedPassword,
			loginMethod: "form",
		};

		user = await Customer.create(newCustomerData);
	} else {
		// for vendor type user
		const { shopName, shopLicenseNo, shopType, shopAddress } = req.body;

		const [customer, vendor, admin] = await Promise.all([
			Customer.exists({ email }),
			Vendor.exists({ email }),
			Admin.exists({ email }),
		]);

		if (customer || vendor || admin) {
			throwError("Email already connected with another user.", 409);
		}

		const hashedPassword = bcryptHashing(password);

		if (!hashedPassword) {
			throwError("Error hashing password");
		}

		let photoUpload = null;

		if (req.file) {
			photoUpload = await uploadImageHandler(req.file);
		}

		const newVendorData = {
			email,
			fullName,
			password: hashedPassword,
			shopName,
			shopLicenseNo,
			shopType,
			shopAddress,
			shopPhoto: photoUpload ? photoUpload.secure_url : undefined,
			shopPhotoKey: photoUpload ? photoUpload.public_id : "",
		};

		user = await Vendor.create(newVendorData);
	}

	if (!user) throwError("Error registering user");

	const tokens = getNewTokens(user);

	const userInfo = Object.assign({}, user);
	delete userInfo.password;

	res.status(200).json({
		success: true,
		user: userInfo._doc,
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

module.exports.AuthControllers = { refreshToken, login, register, continueWithGoogle };
