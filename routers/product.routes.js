const router = require("express").Router();
const { getAllProductsController } = require("../controllers/product.controllers");

router.get("/", getAllProductsController);

module.exports = router;
