const router = require("express").Router();
const { CategoryControllers } = require("../controllers/category.controllers");
const catchAsync = require("../utils/catchAsync");
const upload = require("../middlewares/upload");
const { checkAuth, checkAdminVendor } = require("../middlewares/auth");
const { validateCategory } = require("../validators/categoryValidator");
const { runValidation } = require("../validators");

router.get("/", catchAsync(CategoryControllers.getAllCategories));
router.post(
	"/",
	checkAuth,
	checkAdminVendor,
	upload.single("image"),
	validateCategory,
	catchAsync(runValidation),
	catchAsync(CategoryControllers.addCategory)
);

router.get("/find/:categoryId", catchAsync(CategoryControllers.findSingleCategory));

module.exports = router;
