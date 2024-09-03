const jwt = require("jsonwebtoken");
const Customer = require("../models/Customer.model");
const Admin = require("../models/Admin.model");
const Vendor = require("../models/Vendor.model");
const getNewTokens = require("../utils/getNewTokens");
const { throwError } = require("../utils/throwError");
const { bcryptHashing } = require("../utils/bcryptHashing");
const { uploadImageHandler } = require("../utils/uploadImage");
const { deleteImage } = require("../utils/deleteImage");
const { BANNED_MESSAGE } = require("../consts");

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

const checkIfUserExists = async (email) => {
	const [customer, vendor, admin] = await Promise.all([
		Customer.exists({ email }),
		Vendor.exists({ email }),
		Admin.exists({ email }),
	]);

	return { customer, vendor, admin };
};

const customerRegistration = async (body) => {
	const { password, email, fullName } = body;
	const { customer, vendor, admin } = await checkIfUserExists(email);

	if (customer || vendor || admin) {
		throwError("Customer already exists", 409);
	}

	// hash the plain password
	const hashedPassword = bcryptHashing(password);

	const newCustomerData = {
		email,
		fullName,
		password: hashedPassword,
		loginMethod: "form",
	};

	const newUser = await Customer.create(newCustomerData);
	return newUser;
};

const vendorRegistration = async (body, file) => {
	const { email, fullName, password, shopName, shopLicenseNo, shopType, shopAddress } = body;

	const { customer, vendor, admin } = await checkIfUserExists(email);

	if (customer || vendor || admin) {
		throwError("Email already connected with another user.", 409);
	}

	// hash the password
	const hashedPassword = bcryptHashing(password);

	if (!hashedPassword) {
		throwError("Error hashing password");
	}

	let photoUpload = null;
	// upload the photo into cloudinary, if there any
	if (file) {
		photoUpload = await uploadImageHandler(file);
	}

	const newVendorData = {
		email,
		fullName,
		password: hashedPassword,
		shopName,
		shopLicenseNo,
		shopType,
		shopAddress,
		shopPhoto: photoUpload ? photoUpload.secure_url : undefined, // omit the filed if there is not photo
		shopPhotoKey: photoUpload ? photoUpload.public_id : "",
	};

	const user = await Vendor.create(newVendorData);

	return user;
};

// update user
const customerUpdate = async (req) => {
	const userId = req.user?._id;
	if (!userId) throwError("User id required", 400);

	const customer = await Customer.findById(userId);

	if (!customer) throwError("Customer not found", 404);
	if (customer.isBan) throwError(BANNED_MESSAGE, 401);

	let photoUpload = null;
	// upload the photo into cloudinary, if there any
	if (req.files?.image) {
		photoUpload = await uploadImageHandler(req.files.image[0]);

		// delete prev image
		if (customer.imageKey) await deleteImage(customer.imageKey);
	}

	// update the customer user
	const user = await Customer.findByIdAndUpdate(
		userId,
		{
			...req.body,
			image: photoUpload ? photoUpload.secure_url : customer.image,
			imageKey: photoUpload ? photoUpload.public_id : customer.imageKey,
		},
		{ new: true }
	).lean();

	return user;
};

// vendor update
const vendorUpdate = async (req) => {
	const userId = req.user?._id;
	if (!userId) throwError("User id required", 400);

	const vendor = await Vendor.findById(userId);

	if (!vendor) throwError("Vendor not found", 404);
	if (vendor.isBan) throwError(BANNED_MESSAGE, 401);

	let photoUpload = null,
		shopPhotoUpload = null;
	// upload the photo into cloudinary, if there any
	if (req.files?.image) {
		photoUpload = await uploadImageHandler(req.files.image[0]);

		// delete prev image
		if (vendor.imageKey) await deleteImage(vendor.imageKey);
	}

	if (req.files?.shopPhoto) {
		shopPhotoUpload = await uploadImageHandler(req.files.shopPhoto[0]);

		// delete prev image
		if (vendor.shopPhotoKey) await deleteImage(vendor.shopPhotoKey);
	}

	// update the vendor user
	const user = await Vendor.findByIdAndUpdate(
		userId,
		{
			...req.body,
			image: photoUpload ? photoUpload.secure_url : vendor.image,
			imageKey: photoUpload ? photoUpload.public_id : vendor.imageKey,
			shopPhoto: shopPhotoUpload ? shopPhotoUpload.secure_url : vendor.shopPhoto,
			shopPhotoKey: shopPhotoUpload ? shopPhotoUpload.public_id : vendor.shopPhotoKey,
		},
		{ new: true }
	);

	return user;
};

// admin update
const adminUpdate = async (req) => {
	const userId = req.user?._id;
	if (!userId) throwError("User id required", 400);

	const admin = await Admin.findById(userId);

	if (!admin) throwError("Admin is not found", 404);
	if (admin.isBan) throwError(BANNED_MESSAGE, 401);

	let photoUpload = null;
	// upload the photo into cloudinary, if there any
	if (req.files?.image) {
		photoUpload = await uploadImageHandler(req.files.image[0]);

		// delete prev image
		if (admin.imageKey) await deleteImage(admin.imageKey);
	}

	// update the admin user
	const user = await Admin.findByIdAndUpdate(
		userId,
		{
			...req.body,
			image: photoUpload ? photoUpload.secure_url : admin.image,
			imageKey: photoUpload ? photoUpload.public_id : admin.imageKey,
		},
		{ new: true }
	).lean();

	return user;
};

module.exports.AuthServices = {
	refreshToken,
	customerRegistration,
	vendorRegistration,
	customerUpdate,
	vendorUpdate,
	adminUpdate,
};
