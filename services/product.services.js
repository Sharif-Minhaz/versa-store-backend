const Product = require("../models/Product.model");

const getAllProducts = async (query) => {
	const products = await Product.find(query).populate("category").lean();

	return products;
};

module.exports.ProductServices = {
	getAllProducts,
};
