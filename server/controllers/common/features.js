// // const Feature = require('../../models/Feature');

// // const getFeatureImages = async (req, res) => {
// //   try {
// //     const images = await Feature.find();
// //     res.status(200).json({
// //       success: true,
// //       data: images,
// //     })
// //   } catch (err) {
// //     res.status(500).json({ message: err.message });
// //   }
// // }

// // const addFeatureImage = async (req, res) => {
// //   try {
// //     const { image } = req.body;
// //     const featuresImages = new Feature({ image });
// //     await featuresImages.save();
// //     res.status(201).json({
// //       success: true,
// //       data : featuresImages
// //     });
// //   } catch (err) {
// //     res.status(500).json({ message: err.message });
// //   }
// // }

// // module.exports = {addFeatureImage, getFeatureImages};


// const Feature = require('../../models/Feature');

// const getFeatureImages = async (req, res) => {
//   try {
//     const images = await Feature.find();
//     res.status(200).json({
//       success: true,
//       data: images,
//     });
//   } catch (err) {
//     res.status(500).json({ 
//       success: false,
//       message: err.message 
//     });
//   }
// };

// const addFeatureImage = async (req, res) => {
//   try {
//     const { image } = req.body;
    
//     // Simple validation (maintaining your pattern)
//     if (!image) {
//       return res.status(400).json({ 
//         success: false,
//         message: "Image URL is required" 
//       });
//     }
    
//     // Check for duplicates
//     const existing = await Feature.findOne({ image });
//     if (existing) {
//       return res.status(400).json({ 
//         success: false,
//         message: "Image already exists" 
//       });
//     }
    
//     const featuresImages = new Feature({ image });
//     await featuresImages.save();
    
//     res.status(201).json({
//       success: true,
//       data: featuresImages
//     });
//   } catch (err) {
//     res.status(500).json({ 
//       success: false,
//       message: err.message 
//     });
//   }
// };

// module.exports = { addFeatureImage, getFeatureImages };

const Feature = require('../../models/Feature');

const getFeatureImages = async (req, res) => {
  try {
    const images = await Feature.find();
    res.status(200).json({
      success: true,
      data: images,
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
};

const addFeatureImage = async (req, res) => {
  try {
    const { image } = req.body;
    
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        message: "Unauthorized: Please login to upload images" 
      });
    }
    
    // Simple validation
    if (!image || typeof image !== 'string' || !image.trim()) {
      return res.status(400).json({ 
        success: false,
        message: "Valid image URL is required" 
      });
    }
    
    const trimmedImage = image.trim();
    
    // Check for duplicate image URL
    const existingImage = await Feature.findOne({ image: trimmedImage });
    if (existingImage) {
      return res.status(400).json({ 
        success: false,
        message: "This image is already uploaded" 
      });
    }
    
    // Create and save feature image
    const featureImage = new Feature({ 
      image: trimmedImage,
      uploadedBy: req.user.id || 'admin'
    });
    
    await featureImage.save();
    
    res.status(201).json({
      success: true,
      data: featureImage
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
};

module.exports = { addFeatureImage, getFeatureImages };