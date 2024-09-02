const { model, models, Schema } = require("mongoose");

const reviewSchema = new Schema(
	{
		productId: {
			type: Schema.Types.ObjectId,
			ref: "Product",
			required: true,
		},
		rating: {
			type: Number,
			min: 1,
			max: 5,
			required: true,
		},
		review: String,
		userId: {
			type: Schema.Types.ObjectId,
			ref: "Customer",
			required: true,
		},
	},
	{ timestamps: true }
);

const Review = models.Review || model("Review", reviewSchema);

module.exports = Review;
