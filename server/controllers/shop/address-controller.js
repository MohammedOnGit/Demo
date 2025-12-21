const Address = require("../../models/Address");

/**
 * ADD ADDRESS
 */
const addAddress = async (req, res) => {
  try {
    const { userId, address, city, pincode, notes, phone } = req.body;

    if (!userId || !address || !city || !pincode || !phone) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields. Please provide all address details.",
      });
    }

    const newlyCreatedAddress = new Address({
      userId,
      address,
      city,
      pincode,
      notes,
      phone,
    });

    await newlyCreatedAddress.save();

    return res.status(201).json({
      success: true,
      message: "Address has been added successfully.",
      data: newlyCreatedAddress,
    });
  } catch (error) {
    console.error("Error adding address:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to add address. Please try again later.",
    });
  }
};

/**
 * FETCH ALL ADDRESSES FOR A USER
 */ 
const fetchAllAddress = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required to fetch addresses.",
      });
    }

    const addressList = await Address.find({ userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Addresses retrieved successfully.",
      data: addressList,
    });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch addresses. Please try again later.",
    });
  }
};

/**
 * EDIT ADDRESS
 */
const editAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;
    const updatedData = req.body;

    if (!userId || !addressId) {
      return res.status(400).json({
        success: false,
        message: "User ID and Address ID are required.",
      });
    }

    const updatedAddress = await Address.findOneAndUpdate(
      { _id: addressId, userId },
      { $set: updatedData },
      { new: true, runValidators: true }
    );

    if (!updatedAddress) {
      return res.status(404).json({
        success: false,
        message: "Address not found or you do not have permission to edit it.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Address updated successfully.",
      data: updatedAddress,
    });
  } catch (error) {
    console.error("Error editing address:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to update address. Please try again later.",
    });
  }
};

/**
 * DELETE ADDRESS
 */
const deleteAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;

    if (!userId || !addressId) {
      return res.status(400).json({
        success: false,
        message: "User ID and Address ID are required.",
      });
    }

    const deletedAddress = await Address.findOneAndDelete({
      _id: addressId,
      userId,
    });

    if (!deletedAddress) {
      return res.status(404).json({
        success: false,
        message: "Address not found or you do not have permission to delete it.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Address deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting address:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to delete address. Please try again later.",
    });
  }
};

module.exports = {
  addAddress,
  fetchAllAddress,
  editAddress,
  deleteAddress,
};
