// server/routes/admin/product-routes.js
const express = require('express');
const router = express.Router();

const { upload } = require('../../helpers/cloudinary');
const { uploadProductImage } = require('../../controllers/admin/product-controller');

// wrap multer so we can catch fileFilter errors and respond nicely
router.post('/upload-image', (req, res, next) => {
  upload.single('image')(req, res, function (err) {
    if (err) {
      // Multer or fileFilter error
      console.error('[route] upload error:', err.message || err);
      return res.status(400).json({ success: false, error: err.message || 'Upload error' });
    }
    return uploadProductImage(req, res, next);
  });
});

module.exports = router;

