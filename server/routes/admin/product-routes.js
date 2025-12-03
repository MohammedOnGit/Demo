const express = require("express");
const router = express.Router();

const { upload } = require("../../helpers/cloudinary");
const {
  uploadProductImage,
  addProduct,
  fetchAllProducts,
} = require("../../controllers/admin/product-controller");

router.post("/upload-image", (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        error: err.message || "Upload error",
      });
    }
    uploadProductImage(req, res, next);
  });
});

router.post("/add", addProduct);
router.get("/all", fetchAllProducts);

module.exports = router;
