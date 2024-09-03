const router = require("express").Router();
const catchAsync = require("../utils/catchAsync");
const { OrderControllers } = require("../controllers/order.controllers");
const { checkAuth } = require("../middlewares/auth");

router.post("/:productId", checkAuth, catchAsync(OrderControllers.createOrder));

router.post("/success", checkAuth, catchAsync(OrderControllers.successOrder));
router.post("/fail", checkAuth, catchAsync(OrderControllers.failOrder));
router.post("/cancel", checkAuth, catchAsync(OrderControllers.cancelOrder));

module.exports = router;
