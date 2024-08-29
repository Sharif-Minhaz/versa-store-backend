const { ProductServices } = require("../services/product.services");

const getAllProducts = async (req, res) => {
	const products = await ProductServices.getAllProducts();

	res.status(200).json({
		success: true,
		products,
	});
};

module.exports.ProductControllers = {
	getAllProducts,
};
