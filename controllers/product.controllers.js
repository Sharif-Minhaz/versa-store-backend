const Category = require("../models/Category.model");
const Product = require("../models/Product.model");
const Customer = require("../models/Customer.model");
const { ProductServices } = require("../services/product.services");
const { capitalize } = require("../utils/capitalizeString");
const { deleteImage } = require("../utils/deleteImage");
const { throwError } = require("../utils/throwError");
const { uploadImages } = require("../utils/uploadImage");

const getAllProducts = async (req, res) => {
	const { limit, page, category } = req.query;

	// default
	const query = {
		limit: 12,
		page: 1,
		category,
	};

	if (limit) query.limit = parseInt(limit);
	if (page) query.page = parseInt(page);

	const data = await ProductServices.getAllProducts(query);

	res.status(200).json({
		success: true,
		data,
	});
};

const singleProduct = async (req, res) => {
	const { productId } = req.params;

	if (!productId) throwError("Product id required", 400);

	// find product
	const product = await Product.findById(productId)
		.populate("addedBy")
		.populate({
			path: "category",
			select: "name image",
		})
		.lean();

	if (!product) throwError("Product not found", 404);

	res.status(200).json({ success: true, product });
};

const addProduct = async (req, res) => {
	const { category, variant } = req.body;
	const { _id, user_type } = req.user;

	if (!category) throwError("Category id required", 400);

	// find the category
	const categoryInfo = await Category.findById(category).lean();

	if (!categoryInfo) throwError("Category not found", 404);

	// parse variant info
	const parsedVariant = variant && JSON.parse(variant);

	if (!req.files?.length) throwError("At least 1 product' image required", 400);

	// images uploading
	const shopImages = await uploadImages(req.files);

	const newProduct = await Product.create({
		...req.body,
		addedBy: _id,
		addedByModel: capitalize(user_type),
		variant: parsedVariant,
		images: shopImages.map((image) => ({ url: image.secure_url, publicId: image.public_id })),
	});

	res.status(201).json({
		success: true,
		product: newProduct,
	});
};

// update product
const updateProduct = async (req, res) => {
	const userId = req.user?._id;
	const { variant } = req.body;
	const { productId } = req.params;
	const images = req.files;

	if (!productId) throwError("Product id required", 400);

	// find product
	let product;
	if (req.user?.user_type === "vendor") {
		product = await Product.findOne({ _id: productId, addedBy: userId }).lean();
	} else {
		product = await Product.findById(productId).lean();
	}

	if (!product) throwError("Product not found", 404);

	// parse the variant information
	const parsedVariant = variant && JSON.parse(variant);

	// check if new images can be uploaded or not
	const isNewImageCapAvailable = product.images?.length + images.length <= 5;

	let imageUploads;
	// checking if the images is exceeding the limit of images count (5)
	if (images?.length && isNewImageCapAvailable) {
		imageUploads = await uploadImages(images);
	} else if (!isNewImageCapAvailable) {
		throwError(
			`Only total 5 images is accepted for a single product. Previous: ${product.images?.length} image/s & new uploads: ${images.length} image/s`,
			409
		);
	}

	const newProductImages =
		imageUploads?.map((image) => ({
			url: image.secure_url,
			publicId: image.public_id,
		})) || [];

	const updateProductInfo = await Product.findByIdAndUpdate(
		productId,
		{
			...req.body,
			variant: parsedVariant,
			images: [...product.images, ...newProductImages],
		},
		{ new: true }
	);

	res.status(200).json({
		success: true,
		message: "Product updated successfully",
		product: updateProductInfo,
	});
};

// delete product
const deleteProduct = async (req, res) => {
	const { productId } = req.params;

	if (!productId) throwError("Product id not found", 404);

	// find the product
	let product;
	if (req.user?.user_type === "vendor") {
		product = await Product.findById({ _id: productId, addedBy: req.user?._id }).select(
			"images"
		);
	} else {
		product = await Product.findById(productId).select("images");
	}

	if (!product) throwError("Product not found", 404);

	product.images.forEach((image) => {
		// delete all product images too
		deleteImage(image.publicId);
	});

	await Product.findByIdAndDelete(productId);

	res.status(200).json({
		success: true,
		message: `Product: ${productId} deleted successfully`,
	});
};

// delete product image
const deleteProductImage = async (req, res) => {
	const { productId, imageId } = req.params;

	if (!productId || !imageId) throwError("Product id and image id both required");

	const deletedInfo = await ProductServices.deleteImageById(productId, imageId);

	res.status(200).json({ success: true, product: deletedInfo });
};

// bookmark a product
const toggleBookmark = async (req, res) => {
	const { productId } = req.params;
	if (!productId) throwError("Product id required", 400);

	const { _id, user_type } = req.user;

	if (user_type !== "customer") throwError("Bookmark feature is only for customers", 403);

	const isProductExist = await Product.exists({ _id: productId });
	if (!isProductExist) throwError("Product doesn't exist", 404);

	const customer = await Customer.findById(_id);

	// check if product is already bookmarked
	const isBookmarked = customer.bookmarks.includes(productId);

	// add to bookmarks if not already, remove if it is
	const update = isBookmarked
		? { $pull: { bookmarks: productId } } // remove from bookmark
		: { $addToSet: { bookmarks: productId } }; // add to bookmark

	await Customer.findByIdAndUpdate(_id, update);

	res.status(200).json({
		success: true,
		bookmarked: !isBookmarked,
		message: `Product has been ${isBookmarked ? "removed from" : "added to"} bookmarks`,
	});
};

const getPopularProducts = async (req, res) => {
	const products = await Product.find().sort({ sold: -1 }).populate("category addedBy");

	res.status(200).json({ success: true, products });
};

const getVendorProducts = async (req, res) => {
	const { userId } = req.params;

	if (!userId) throwError("Vendor id required", 400);

	const products = await Product.find({ addedBy: userId }).populate("category addedBy");

	res.status(200).json({
		success: true,
		products,
		id: userId,
	});
};

const getSearchResults = async (req, res) => {
	const { term } = req.body;

	const products = await Product.find({ $text: { $search: term } }).select(
		"name description images _id price"
	);

	res.status(200).json({ success: true, products });
};

module.exports.ProductControllers = {
	getAllProducts,
	singleProduct,
	addProduct,
	updateProduct,
	deleteProduct,
	deleteProductImage,
	toggleBookmark,
	getVendorProducts,
	getPopularProducts,
	getSearchResults,
};
