const express = require("express");
const router = express.Router();

const {
  getFilteredProducts,
} = require("../../controllers/shop/product-controller");


// ✅ GET ALL PRODUCTS
// router.get("/all", getFilteredProducts);

router.get("/get", getFilteredProducts);

module.exports = router;
