const router = require("express").Router();
const { ProductControllers } = require("../controllers/product.controllers");
const catchAsync = require("../utils/catchAsync");
const upload = require("../middlewares/upload");

router.get("/", catchAsync(ProductControllers.getAllProducts));
router.post("/", upload.array("images", 5), catchAsync(ProductControllers.addProduct));

module.exports = router;
