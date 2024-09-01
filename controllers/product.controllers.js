const Category = require("../models/Category.model");
const { ProductServices } = require("../services/product.services");
const { throwError } = require("../utils/throwError");

const getAllProducts = async (req, res) => {
	const products = await ProductServices.getAllProducts();

	res.status(200).json({
		success: true,
		products,
	});
};

const addProduct = async (req, res) => {
	const { categoryId, variant } = req.body;

	if (!categoryId) throwError("Category id required", 400);

	const category = await Category.findById(categoryId).lean();

	if (!category) throwError("Category not found", 404);

	// parse variant
	const parsedVariant = JSON.parse(variant);

	if (!req.files?.length) throwError("At least 1 product' image required");

	// TODO: images uploading here with mapping

	res.status(201).json({
		success: true,
		parsedVariant,
	});
};

module.exports.ProductControllers = {
	getAllProducts,
	addProduct,
};
