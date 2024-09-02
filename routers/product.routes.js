const router = require("express").Router();
const { ProductControllers } = require("../controllers/product.controllers");
const catchAsync = require("../utils/catchAsync");
const upload = require("../middlewares/upload");

router.get("/", catchAsync(ProductControllers.getAllProducts));
router.get("/single/:productId", catchAsync(ProductControllers.singleProduct));
router.post("/", upload.array("images", 5), catchAsync(ProductControllers.addProduct));

router.patch(
	"/:productId",
	upload.array("images", 5),
	catchAsync(ProductControllers.updateProduct)
);
router.delete("/:productId", catchAsync(ProductControllers.deleteProduct));
router.delete("/:productId/images/:imageId", catchAsync(ProductControllers.deleteProductImage));

module.exports = router;
