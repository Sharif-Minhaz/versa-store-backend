const { model, models, Schema } = require("mongoose");

const orderSchema = new Schema(
	{
		productId: {
			type: Schema.Types.ObjectId,
			ref: "Product",
			required: true,
		},
		userId: {
			type: Schema.Types.ObjectId,
			ref: "Customer",
			required: true,
		},
		orderName: {
			type: String,
			required: true,
		},
		orderMethod: { type: String, enum: ["cash", "online"], required: true },
		division: {
			type: String,
			required: true,
		},
		zilla: {
			type: String,
			required: true,
		},
		upazilla: {
			type: String,
			required: true,
		},
		postCode: {
			type: String,
			required: true,
		},
		phoneNumber: {
			type: String,
			required: true,
		},
		houseNo: String,
		status: {
			type: String,
			enum: ["pending", "declined", "cart"],
			default: "pending",
		},
		tranxId: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

const Review = models.Review || model("Review", orderSchema);

module.exports = Review;
