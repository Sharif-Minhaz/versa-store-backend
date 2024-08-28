const asyncHandler = require("express-async-handler");
const { ProductService } = require("../services/product.services");

exports.getAllProductsController = asyncHandler(async (req, res) => {
	const products = await ProductService.getAllProducts();

	res.status(200).json({
		success: true,
		products,
	});
});
