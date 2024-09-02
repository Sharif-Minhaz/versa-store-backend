const { model, Schema, models } = require("mongoose");

const productSchema = new Schema(
	{
		addedBy: {
			type: Schema.Types.ObjectId,
			required: true,
			refPath: "addedByModel",
		},
		addedByModel: {
			type: String,
			required: true,
			enum: ["Vendor", "Admin"],
		},
		category: {
			type: Schema.Types.ObjectId,
			ref: "Category",
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			min: 1,
			required: true,
		},
		discount: {
			type: Number,
			default: 0,
		},
		images: [{ url: String, publicId: String }],
		brand: String,
		stock: {
			type: Number,
			min: 1,
			required: true,
		},
		defaultType: String, // default variant
		variant: [
			{
				type: { type: String, required: true },
				price: { type: Number, min: 1, required: true },
				description: { type: String, required: true },
			},
		],
	},
	{
		timestamps: true,
	}
);

const Product = models.Product || model("Product", productSchema);

module.exports = Product;
