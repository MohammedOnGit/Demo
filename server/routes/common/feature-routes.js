const express = require("express");
const {
  addFeatureImage,
  getFeatureImages,
} = require("../../controllers/common/features");

const { authMiddleware } = require("../../controllers/auth/auth-controller");

const router = express.Router();

// Protect all routes
router.use(authMiddleware);

router.post("/add", addFeatureImage);
router.get("/get", getFeatureImages);

module.exports = router;
