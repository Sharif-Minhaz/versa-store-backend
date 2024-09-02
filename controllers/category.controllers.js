const Category = require("../models/Category.model");
const { throwError } = require("../utils/throwError");
const { uploadImageHandler } = require("../utils/uploadImage");

const getAllCategories = async (req, res) => {
	const categories = await Category.find().lean();

	res.status(200).json({
		success: true,
		categories,
	});
};

const addCategory = async (req, res) => {
	const { name } = req.body;
	const imageFile = req.file;

	if (!name) throwError("Category name is required", 400);

	// check if the category already exist
	const isCategoryExist = await Category.exists({
		name: { $regex: new RegExp("^" + name + "$", "i") },
	});

	if (isCategoryExist) throwError("Category already exist", 409);

	if (!imageFile) throwError("Category image is required", 400);

	// upload category image
	const uploadImg = await uploadImageHandler(imageFile);

	if (!uploadImg) throwError("Error uploading image");

	// create the category
	const category = await Category.create({
		name: req.body.name,
		image: uploadImg.secure_url,
		imageKey: uploadImg.public_id,
	});

	res.status(201).json({
		success: true,
		category,
	});
};

const findSingleCategory = async (req, res) => {
	const { categoryId } = req.params;

	if (!categoryId) throwError("Category id is required", 400);

	// get the category
	const category = await Category.findById(categoryId).lean();

	if (!category) throwError("This category doesn't exist", 404);

	res.status(200).json({
		success: true,
		category,
	});
};

module.exports.CategoryControllers = {
	getAllCategories,
	addCategory,
	findSingleCategory,
};
