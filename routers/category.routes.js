const router = require("express").Router();
const { CategoryControllers } = require("../controllers/category.controllers");
const catchAsync = require("../utils/catchAsync");
const upload = require("../middlewares/upload");

router.get("/", catchAsync(CategoryControllers.getAllCategories));
router.post("/", upload.single("image"), catchAsync(CategoryControllers.addCategory));

router.get("/find/:categoryId", catchAsync(CategoryControllers.findSingleCategory));

module.exports = router;
