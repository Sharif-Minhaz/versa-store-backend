const router = require("express").Router();
const { PaymentControllers } = require("../controllers/payment.controllers");
const { PaymentServices } = require("../services/payment.services");
const catchAsync = require("../utils/catchAsync");

// TODO: need to protect those route,
// problem -> req is coming from direct server, so the authorization header is not passing,
// so cannot use the checkAuth middleware here

// TODO: generate a invoice and send it to the user' email

router.post("/ssl-request", catchAsync(PaymentControllers.initSSL_Commerz));
router.post("/success", catchAsync(PaymentServices.successPayment));
router.post("/fail", catchAsync(PaymentServices.failPayment));
router.post("/cancel", catchAsync(PaymentServices.cancelPayment));

module.exports = router;
