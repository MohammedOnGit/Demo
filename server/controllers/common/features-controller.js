const Feature = require("../../models/Feature");

const getFeatureImages = async (req, res) => {
  try {
    const images = await Feature.find();
    res.status(200).json({
      success: true,
      data: images,
    });
  } catch (err) {
    console.error("Get feature images error:", err);
    res.status(500).json({ 
      success: false,
      message: "Some error occured", 
    });
  }
};

const addFeatureImage = async (req, res) => {
  try {
    console.log("Add feature image request body:", req.body);
    console.log("User from auth:", req.user);
    
    let imageData = req.body.image;
    
    // Check if image is an object (from Cloudinary) or a string
    if (typeof imageData === 'object' && imageData !== null) {
      // Extract just the URL if it's an object
      imageData = imageData.url;
    }
    
    if (!imageData || typeof imageData !== 'string') {
      return res.status(400).json({
        success: false,
        message: "Valid image URL is required",
      });
    }
    
    const featuresImages = new Feature({ image: imageData });
    await featuresImages.save();
    
    res.status(201).json({
      success: true,
      data: featuresImages,
    });
  } catch (err) {
    console.error("Add feature image error:", err);
    res.status(500).json({
      success: false,
      message: err.message || "some error occured",
    });
  }
};

const deleteFeatureImage = async (req, res) => {
  try {
    console.log("Delete feature image params:", req.params);
    console.log("User from auth:", req.user);
    
    const { id } = req.params;
    
    // Find the image first to get the URL
    const image = await Feature.findById(id);
    
    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Feature image not found",
      });
    }
    
    // Optional: Delete from Cloudinary if needed
    // You can add this later if you want to clean up Cloudinary storage
    
    // Delete from database
    const deletedImage = await Feature.findByIdAndDelete(id);
    
    res.status(200).json({
      success: true,
      message: "Feature image deleted successfully",
      data: deletedImage,
    });
  } catch (err) {
    console.error("Delete feature image error:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Some error occurred while deleting the feature image",
    });
  }
};

module.exports = { addFeatureImage, getFeatureImages, deleteFeatureImage };