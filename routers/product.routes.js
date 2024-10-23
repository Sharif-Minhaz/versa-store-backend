const router = require("express").Router();
const { ProductControllers } = require("../controllers/product.controllers");
const catchAsync = require("../utils/catchAsync");
const upload = require("../middlewares/upload");
const { checkAuth, checkAdminVendor } = require("../middlewares/auth");
const { validateProduct } = require("../validators/productValidators");
const { runValidation } = require("../validators");

router.get("/", catchAsync(ProductControllers.getAllProducts));
router.get("/search", catchAsync(ProductControllers.getSearchResults));
router.get("/single/:productId", catchAsync(ProductControllers.singleProduct));
router.post(
	"/",
	checkAuth,
	checkAdminVendor,
	upload.array("images", 5),
	validateProduct,
	catchAsync(runValidation),
	catchAsync(ProductControllers.addProduct)
);

router.patch(
	"/:productId",
	checkAuth,
	checkAdminVendor,
	upload.array("images", 5),
	// validateProduct,
	// catchAsync(runValidation), TODO: in testing it will cause a problem with postman records, cause the validation will required all the field's value, either the updated or not, but postman only providing only the field's value which  we want to update. so this line should be uncomment if publish to production.
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

// popular product
router.get("/popular", catchAsync(ProductControllers.getPopularProducts));

router.get("/vendor/:userId", catchAsync(ProductControllers.getVendorProducts));

// product bookmark
router.patch("/bookmark/:productId", checkAuth, catchAsync(ProductControllers.toggleBookmark));

module.exports = router;
