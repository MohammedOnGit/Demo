const { imageUploadUtils } = require('../../helpers/cloudinary');
const Product = require('../../models/Product');

const uploadProductImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: "No file uploaded" });
    }

    const imageUrl = await imageUploadUtils(req.file.buffer);

    res.json({
      success: true,
      message: "Image uploaded successfully",
      imageUrl,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const addProduct = async (req, res) => {
  try {
    const {
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
    } = req.body;

    if (!image || !title || !price) {
      return res.status(400).json({
        success: false,
        error: "Image, title, and price are required",
      });
    }

    const newProduct = await Product.create({
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
    });

    res.json({
      success: true,
      message: "Product added successfully",
      data: newProduct,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const fetchAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  uploadProductImage,
  addProduct,
  fetchAllProducts,
};
