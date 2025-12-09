const express = require("express");
const router = express.Router();

const {
  getFilteredProducts,
  getProductDetails,
} = require("../../controllers/shop/product-controller");


// ✅ GET ALL PRODUCTS
// router.get("/all", getFilteredProducts);

router.get("/get", getFilteredProducts);

router.get("/get/:productId", getProductDetails);


module.exports = router;
