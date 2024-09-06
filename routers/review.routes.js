const router = require("express").Router();
const { ReviewControllers } = require("../controllers/review.controllers");
const { checkAuth } = require("../middlewares/auth");
const catchAsync = require("../utils/catchAsync");

router.get("/:productId", catchAsync(ReviewControllers.findReviews));
router.post("/:productId", checkAuth, catchAsync(ReviewControllers.addReview));
router.delete("/:reviewId", checkAuth, catchAsync(ReviewControllers.deleteReview));

module.exports = router;
