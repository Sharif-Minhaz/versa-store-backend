const Category = require("../models/Category.model");
const Product = require("../models/Product.model");
const { ProductServices } = require("../services/product.services");
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
	const { variant } = req.body;
	const { productId } = req.params;
	const images = req.files;

	if (!productId) throwError("Product id required", 400);

	// find product
	const product = await Product.findById(productId).lean();

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

	const updateProduct = await Product.findByIdAndUpdate(
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
		product: updateProduct,
	});
};

// delete product
const deleteProduct = async (req, res) => {
	const { productId } = req.params;

	if (!productId) throwError("Product id not found", 404);

	// find the product
	const product = await Product.findById(productId).select("images");

	if (!product) throwError("Product not found", 404);

	product.images.forEach((image) => {
		// delete all product images too
		deleteImage(image.publicId);
	});

	await Product.findByIdAndDelete(productId);

	res.status(200).json({
		success: true,
		message: "Product deleted successfully",
	});
};

// delete product image
const deleteProductImage = async (req, res) => {
	const { productId, imageId } = req.params;

	if (!productId || !imageId) throwError("Product id and image id both required");

	const deletedInfo = await ProductServices.deleteImageById(productId, imageId);

	res.status(200).json({ success: true, product: deletedInfo });
};

module.exports.ProductControllers = {
	getAllProducts,
	singleProduct,
	addProduct,
	updateProduct,
	deleteProduct,
	deleteProductImage,
};
