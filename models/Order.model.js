const { model, models, Schema } = require("mongoose");

const orderSchema = new Schema(
	{
		productId: {
			type: Schema.Types.ObjectId,
			ref: "Product",
			required: true,
		},
		orderedBy: {
			type: Schema.Types.ObjectId,
			ref: "Customer",
			required: true,
		},
		orderName: {
			type: String,
			required: true,
		},
		orderMethod: { type: String, enum: ["cash", "online"], required: true },
		count: { type: Number, min: 1, required: true },
		deliveryCharge: { type: Number, default: 50 },
		productPrice: { type: Number, required: true },
		totalPrice: { type: Number, required: true },
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
			enum: ["pending", "declined", "cart", "accepted", "cancelled", "failed"],
			default: "pending",
		},
		tranxId: {
			type: String,
			required: true,
		},
		paymentUrl: String,
		note: String,
	},
	{ timestamps: true }
);

const Order = models.Order || model("Order", orderSchema);

module.exports = Order;
