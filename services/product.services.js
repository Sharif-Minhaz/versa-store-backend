const Product = require("../models/Product.model");
const asyncHandler = require("express-async-handler");

const getAllProducts = asyncHandler(async (query) => {
	const products = await Product.find(query).populate("category");

	return products;
});

module.exports.ProductService = {
	getAllProducts,
};
