const router = require("express").Router();
const { ProductControllers } = require("../controllers/product.controllers");
const catchAsync = require("../utils/catchAsync");
const upload = require("../middlewares/upload");
const { checkAuth, checkAdminVendor } = require("../middlewares/auth");

router.get("/", catchAsync(ProductControllers.getAllProducts));
router.get("/single/:productId", catchAsync(ProductControllers.singleProduct));
router.post(
	"/",
	checkAuth,
	checkAdminVendor,
	upload.array("images", 5),
	catchAsync(ProductControllers.addProduct)
);

router.patch(
	"/:productId",
	checkAuth,
	checkAdminVendor,
	upload.array("images", 5),
	catchAsync(ProductControllers.updateProduct)
);
router.delete(
	"/:productId",
	checkAuth,
	checkAdminVendor,
	catchAsync(ProductControllers.deleteProduct)
);
router.delete(
	"/:productId/images/:imageId",
	checkAuth,
	checkAdminVendor,
	catchAsync(ProductControllers.deleteProductImage)
);

module.exports = router;
