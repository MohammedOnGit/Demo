// server/controllers/admin/product-controller.js
const { imageUploadUtils } = require('../../helpers/cloudinary');

const uploadProductImage = async (req, res) => {
  try {
    console.log('[controller] req.file =', !!req.file, req.file && { name: req.file.originalname, size: req.file.size, mimetype: req.file.mimetype });

    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    const imageUrl = await imageUploadUtils(req.file.buffer);

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      imageUrl,
    });
  } catch (error) {
    console.error('[controller] uploadProductImage error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { uploadProductImage };
