const express = require("express");
const router = express.Router();

const { upload } = require("../../helpers/cloudinary");

const {
  deleteProduct,
  uploadProductImage,
  addProduct,
  fetchAllProducts,
  updateProduct, // ✅ ADD THIS
} = require("../../controllers/admin/product-controller");

// ✅ IMAGE UPLOAD
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

// ✅ ADD PRODUCT
router.post("/add", addProduct);

// ✅ GET ALL PRODUCTS
router.get("/all", fetchAllProducts);

// ✅✅✅ UPDATE PRODUCT (THIS WAS MISSING)
router.put("/:id", updateProduct);

// ✅ DELETE ROUTE
router.delete("/delete/:id", deleteProduct);

module.exports = router;
