const router = require("express").Router();
const { AuthControllers } = require("../controllers/auth.controllers");
const catchAsync = require("../utils/catchAsync");
const upload = require("../middlewares/upload");
const { checkGuest, checkAuth } = require("../middlewares/auth");
const { validateUserLogin, validateUserReg } = require("../validators/authValidators");
const { runValidation } = require("../validators");

// authentication user
router.post(
	"/login",
	checkGuest,
	validateUserLogin,
	runValidation,
	catchAsync(AuthControllers.login)
);
router.post("/google", checkGuest, catchAsync(AuthControllers.continueWithGoogle));
router.post(
	"/register",
	checkGuest,
	upload.single("shopPhoto"),
	validateUserReg,
	catchAsync(runValidation),
	catchAsync(AuthControllers.register)
);

router.patch(
	"/update",
	checkAuth,
	upload.fields([
		{ name: "shopPhoto", maxCount: 1 },
		{ name: "image", maxCount: 1 },
	]),
	catchAsync(AuthControllers.updateUser)
);

router.post("/refresh-token", checkAuth, catchAsync(AuthControllers.refreshToken));

module.exports = router;
