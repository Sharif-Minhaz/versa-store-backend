const Product = require("../models/Product.model");
const { deleteImage } = require("../utils/deleteImage");
const { throwError } = require("../utils/throwError");

const getAllProducts = async (query) => {
	const { limit, page, category } = query;

	const start = (page - 1) * limit;

	const products = await Product.find(category ? { category } : {})
		.skip(start)
		.limit(limit)
		.populate({
			path: "category",
			select: "name image",
		})
		.lean();

	// Get the total count of products
	const totalProducts = await Product.countDocuments();

	return { total: totalProducts.length, page, limit, products };
};

const deleteImageById = async (productId, imageId) => {
	const targetedImageObj = await Product.findById(productId).select("images");

	if (!targetedImageObj) throwError("Product not found", 404);

	if (targetedImageObj.images?.length <= 1)
		throwError("Can't delete the only image, upload more to delete this image", 409);

	// filter out that specific image
	const imageInfo = targetedImageObj.images.filter((image) => String(image._id) === imageId)[0];

	if (!imageInfo) throwError("Image not found", 404);

	const [product] = await Promise.all([
		Product.findOneAndUpdate(
			{ _id: productId },
			{ $pull: { images: { _id: imageId } } }, // Pull (remove) the image with the specified _id
			{ new: true }
		),
		deleteImage(imageInfo?.publicId), // delete the image from cloudinary
	]);

	if (!product) throwError("Error deleting image");

	return product;
};

// update product stock
const updateProductStock = async (productId, count, type) => {
	let product;
	if (type === "INC") {
		// Increase product stock by count
		product = await Product.findByIdAndUpdate(
			productId,
			{ $inc: { stock: count } },
			{ new: true }
		);
	} else {
		// Decrease product stock by count
		product = await Product.findByIdAndUpdate(
			productId,
			{ $inc: { stock: -count } },
			{ new: true }
		);
	}

	return product;
};

module.exports.ProductServices = {
	getAllProducts,
	deleteImageById,
	updateProductStock,
};
