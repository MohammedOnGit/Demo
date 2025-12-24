const express = require("express");
const {
  addAddress,
  fetchAllAddress,
  editAddress,
  deleteAddress,
} = require("../../controllers/shop/address-controller");

const { authMiddleware } = require("../../controllers/auth/auth-controller");

const router = express.Router();

// Protect all routes
router.use(authMiddleware);

router.post("/add", addAddress);
router.get("/get", fetchAllAddress); // userId comes from authMiddleware
router.put("/update/:addressId", editAddress);
router.delete("/delete/:addressId", deleteAddress);

module.exports = router;
