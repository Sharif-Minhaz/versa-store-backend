const router = require("express").Router();
const { AuthControllers } = require("../controllers/auth.controllers");
const catchAsync = require("../utils/catchAsync");
const upload = require("../middlewares/upload");

// authentication user
router.post("/login", catchAsync(AuthControllers.login));
router.post("/google", catchAsync(AuthControllers.continueWithGoogle));
router.post("/register", upload.single("shopPhoto"), catchAsync(AuthControllers.register));

router.patch(
	"/update/:userId",
	upload.fields([
		{ name: "shopPhoto", maxCount: 1 },
		{ name: "image", maxCount: 1 },
	]),
	catchAsync(AuthControllers.updateUser)
);

router.post("/refresh-token", catchAsync(AuthControllers.refreshToken));

module.exports = router;
