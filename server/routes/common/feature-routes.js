const express = require("express");
const router = express.Router();
const {
  addFeatureImage,
  getFeatureImages,
  deleteFeatureImage,
} = require("../../controllers/common/features-controller");
const { authMiddleware } = require("../../controllers/auth/auth-controller");

// Public routes - anyone can view feature images
router.get("/get", getFeatureImages);

// Protected routes - only authenticated users (admin) can modify
router.post("/add", authMiddleware, addFeatureImage);
router.delete("/delete/:id", authMiddleware, deleteFeatureImage);

module.exports = router;


