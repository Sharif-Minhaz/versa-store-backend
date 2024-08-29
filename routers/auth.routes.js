const router = require("express").Router();
const { AuthControllers } = require("../controllers/auth.controllers");
const catchAsync = require("../utils/catchAsync");

// authentication user
router.post("/login", catchAsync(AuthControllers.customerLogin));
router.post("/register", catchAsync(AuthControllers.customerRegister));
router.post("/refresh-token", catchAsync(AuthControllers.refreshToken));

// authentication admin

module.exports = router;
