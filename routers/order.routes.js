const router = require("express").Router();
const catchAsync = require("../utils/catchAsync");
const { OrderControllers } = require("../controllers/order.controllers");
const { checkAuth, checkAdmin } = require("../middlewares/auth");

router.post("/", checkAuth, catchAsync(OrderControllers.createOrder));

router.delete("/:orderId", checkAuth, catchAsync(OrderControllers.deleteOrder));

router.patch("/reject/:orderId", checkAuth, checkAdmin, catchAsync(OrderControllers.rejectOrder));
router.patch("/accept/:orderId", checkAuth, checkAdmin, catchAsync(OrderControllers.acceptedOrder));

router.get("/orders", checkAuth, catchAsync(OrderControllers.findUserOrders));

router.get("/all-orders", checkAuth, checkAdmin, catchAsync(OrderControllers.getAllOrders));

module.exports = router;
