const { body } = require("express-validator");

// registration validation
const validateUserReg = [
	body("fullName")
		.trim()
		.notEmpty()
		.withMessage("Full Name is required")
		.isLength({ min: 3, max: 31 })
		.withMessage("Full Name should be at least 3-31 chars"),
	body("email")
		.trim()
		.notEmpty()
		.withMessage("Email is required")
		.isEmail()
		.withMessage("Invalid email address"),
	body("password")
		.trim()
		.isLength({ min: 6 })
		.withMessage("Password should be at least 6 characters long")
		.notEmpty()
		.withMessage("Password is required")
		.matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?:=&-])[A-Za-z\d@$!%*#?:=&-]+$/)
		.withMessage(
			"Password should minimum 8 characters, at least 1 Uppercase, 1 Lowercase, 1 number and 1 special character"
		),
	body("registerFor").optional().isString().withMessage("Invalid value for registerFor"),
	body("shopName")
		.if(body("registerFor").equals("vendor"))
		.trim()
		.notEmpty()
		.withMessage("Shop name is required for vendors"),
	body("shopLicenseNo")
		.if(body("registerFor").equals("vendor"))
		.trim()
		.notEmpty()
		.withMessage("Shop license no. is required for vendors"),
	body("shopType")
		.if(body("registerFor").equals("vendor"))
		.trim()
		.notEmpty()
		.withMessage("Shop type is required for vendors"),
	body("shopAddress")
		.if(body("registerFor").equals("vendor"))
		.trim()
		.notEmpty()
		.withMessage("Shop address is required for vendors"),
];

// login validation
const validateUserLogin = [
	body("email")
		.trim()
		.notEmpty()
		.withMessage("Email is required")
		.isEmail()
		.withMessage("Invalid email address"),
	body("password").trim().notEmpty().withMessage("Password is required"),
	body("loginFor").trim().notEmpty().withMessage("loginFor is required"),
];

module.exports = { validateUserReg, validateUserLogin };
