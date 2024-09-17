const { body } = require("express-validator");

const validateProduct = [
	body("name")
		.trim()
		.notEmpty()
		.withMessage("Product name is required.")
		.isLength({ min: 3 })
		.withMessage("Product name should be at least 3 characters long."),
	body("description")
		.trim()
		.notEmpty()
		.withMessage("Product description is required.")
		.isLength({ min: 10 })
		.withMessage("Product description should be at least 10 characters long."),
	body("price")
		.notEmpty()
		.withMessage("Product price is required.")
		.isFloat({ min: 0 })
		.withMessage("Product price must be a number greater than or equal to 0.")
		.toFloat(), // Parse to float
	body("discount")
		.optional() // Make discount optional
		.isFloat({ min: 0, max: 100 })
		.withMessage("Discount must be a number between 0 and 100.")
		.toFloat(), // Parse to float
	body("brand")
		.trim()
		.notEmpty()
		.withMessage("Product brand name is required.")
		.isLength({ min: 1 })
		.withMessage("Product brand name should be at least 1 character long."),
	body("stock")
		.notEmpty()
		.withMessage("Product stock is required.")
		.isInt({ min: 0 })
		.withMessage("Product stock must be a non-negative integer.")
		.toInt(), // Parse to integer
	body("variant")
		.optional() // Make variant optional
		.trim(),
	body("category").trim().notEmpty().withMessage("Product category is required."),
	body("defaultType")
		.optional() // Make defaultType optional
		.trim(),
];

module.exports = { validateProduct };
