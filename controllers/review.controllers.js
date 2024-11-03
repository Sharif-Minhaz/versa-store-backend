const Review = require("../models/Review.model");
const Product = require("../models/Product.model");
const { throwError } = require("../utils/throwError");

const addReview = async (req, res) => {
	const { productId } = req.params;
	const { rating, review } = req.body;
	const { _id: userId, user_type } = req.user;

	// check if the product exists
	const productExists = await Product.exists({ _id: productId });
	if (!productExists) throwError("Product not found", 404);

	// check if user has already reviewed this product
	const existingReview = await Review.findOne({ productId, userId });
	if (existingReview) throwError("You have already reviewed this product", 409);

	// create a new review
	const newReview = await Review.create({
		productId,
		rating,
		review,
		userId,
		userIdModel: user_type.replace(user_type.charAt(0), user_type.charAt(0).toUpperCase()),
	});

	res.status(201).json({
		success: true,
		message: "Review added successfully",
		review: newReview,
	});
};

// find all reviews for a specific product
const findReviews = async (req, res) => {
	const { productId } = req.params;

	if (!productId) throwError("Product id required", 400);

	// fetch all reviews for the product
	const reviews = await Review.find({ productId })
		.populate({
			path: "userId",
			select: "fullName image",
		})
		.lean();

	res.status(200).json({
		success: true,
		message: "Reviews fetched successfully",
		reviews,
	});
};

// delete a review
const deleteReview = async (req, res) => {
	const { reviewId } = req.params;
	const { _id: userId, user_type } = req.user;

	// find the review by ID
	const review = await Review.findById(reviewId);
	if (!review) throwError("Review not found", 404);

	// check if the user is authorized to delete (either review owner or an admin)
	if (review.userId.toString() !== userId && user_type !== "admin") {
		throwError("Not authorized to delete this review", 403);
	}

	// delete the review
	await review.deleteOne();

	res.status(200).json({
		success: true,
		message: "Review deleted successfully",
	});
};

module.exports.ReviewControllers = {
	addReview,
	findReviews,
	deleteReview,
};
