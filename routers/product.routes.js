const router = require("express").Router();
const { ProductControllers } = require("../controllers/product.controllers");
const catchAsync = require("../utils/catchAsync");

router.get("/", catchAsync(ProductControllers.getAllProducts));

module.exports = router;
