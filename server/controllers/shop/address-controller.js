const Address = require("../../models/Address");

/**
 * ADD ADDRESS
 */
const addAddress = async (req, res) => {
  try {
    const userId = req.user?.id; // ✅ always from auth middleware
    const { address, city, digitalAddress, phone, notes } = req.body;

    if (!userId || !address || !city || !digitalAddress || !phone) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields. Please provide all address details.",
      });
    }

    const newlyCreatedAddress = new Address({
      userId,
      address,
      city,
      digitalAddress,
      phone,
      notes: notes || "",
    });

    await newlyCreatedAddress.save();

    return res.status(201).json({
      success: true,
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
 * FETCH ALL ADDRESSES
 */
const fetchAllAddress = async (req, res) => {
  try {
    const userId = req.user.id;

    const addressList = await Address.find({ userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: addressList,
    });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch addresses.",
    });
  }
};

/**
 * EDIT ADDRESS
 */
const editAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { addressId } = req.params;
    const { userId: bodyUserId, ...updatedData } = req.body; // prevent override

    const updatedAddress = await Address.findOneAndUpdate(
      { _id: addressId, userId },
      { $set: updatedData },
      { new: true, runValidators: true }
    );

    if (!updatedAddress) {
      return res.status(404).json({
        success: false,
        message: "Address not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: updatedAddress,
    });
  } catch (error) {
    console.error("Error editing address:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to update address.",
    });
  }
};

/**
 * DELETE ADDRESS
 */
const deleteAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { addressId } = req.params;

    const deletedAddress = await Address.findOneAndDelete({
      _id: addressId,
      userId,
    });

    if (!deletedAddress) {
      return res.status(404).json({
        success: false,
        message: "Address not found.",
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
      message: "Unable to delete address.",
    });
  }
};

module.exports = {
  addAddress,
  fetchAllAddress,
  editAddress,
  deleteAddress,
};
