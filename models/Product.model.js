const { model, Schema, models } = require("mongoose");

const productSchema = new Schema(
	{
		categoryId: {
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
		images: [{ type: String, required: true }],
		brand: String,
		stock: {
			type: Number,
			min: 1,
			required: true,
		},
		variant: [{ type: String, price: Number, description: String }],
	},
	{
		timestamps: true,
	}
);

const Product = models.Product || model("Product", productSchema);

module.exports = Product;