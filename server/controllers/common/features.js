const Feature = require('../../models/Feature');

const getFeatureImages = async (req, res) => {
  try {
    const features = await Feature.find();
    res.json(features);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

const addFeatureImage = async (req, res) => {
  try {
    const { image } = req.body;
    const featuresImages = new Feature({ image });
    await featuresImages.save();
    res.status(201).json({
      success: true,
      data : featuresImages
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = {addFeatureImage, getFeatureImages};