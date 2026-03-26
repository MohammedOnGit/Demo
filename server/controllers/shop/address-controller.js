// const Address = require("../../models/Address");

// /**
//  * ADD ADDRESS
//  */
// const addAddress = async (req, res) => {
//   try {
//     const userId = req.user?.id; // ✅ always from auth middleware
//     const { address, city, digitalAddress, phone, notes } = req.body;

//     if (!userId || !address || !city || !digitalAddress || !phone) {
//       return res.status(400).json({
//         success: false,
//         message: "Missing required fields. Please provide all address details.",
//       });
//     }

//     const newlyCreatedAddress = new Address({
//       userId,
//       address,
//       city,
//       digitalAddress,
//       phone,
//       notes: notes || "",
//     });

//     await newlyCreatedAddress.save();

//     return res.status(201).json({
//       success: true,
//       data: newlyCreatedAddress,
//     });
//   } catch (error) {
//     console.error("Error adding address:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Unable to add address. Please try again later.",
//     });
//   }
// };

// /**
//  * FETCH ALL ADDRESSES
//  */
// const fetchAllAddress = async (req, res) => {
//   try {
//     const userId = req.user.id;

//     const addressList = await Address.find({ userId }).sort({ createdAt: -1 });

//     return res.status(200).json({
//       success: true,
//       data: addressList,
//     });
//   } catch (error) {
//     console.error("Error fetching addresses:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Unable to fetch addresses.",
//     });
//   }
// };

// /**
//  * EDIT ADDRESS
//  */
// const editAddress = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { addressId } = req.params;
//     const { userId: bodyUserId, ...updatedData } = req.body; // prevent override

//     const updatedAddress = await Address.findOneAndUpdate(
//       { _id: addressId, userId },
//       { $set: updatedData },
//       { new: true, runValidators: true }
//     );

//     if (!updatedAddress) {
//       return res.status(404).json({
//         success: false,
//         message: "Address not found.",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       data: updatedAddress,
//     });
//   } catch (error) {
//     console.error("Error editing address:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Unable to update address.",
//     });
//   }
// };

// /**
//  * DELETE ADDRESS
//  */
// const deleteAddress = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { addressId } = req.params;

//     const deletedAddress = await Address.findOneAndDelete({
//       _id: addressId,
//       userId,
//     });

//     if (!deletedAddress) {
//       return res.status(404).json({
//         success: false,
//         message: "Address not found.",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Address deleted successfully.",
//     });
//   } catch (error) {
//     console.error("Error deleting address:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Unable to delete address.",
//     });
//   }
// };

// module.exports = {
//   addAddress,
//   fetchAllAddress,
//   editAddress,
//   deleteAddress,
// };



const Address = require("../../models/Address");

// Normalize digital address to uppercase
const normalizeDigitalAddress = (value) => {
  return value ? value.toUpperCase().trim() : value;
};

// Validation functions (case insensitive)
const isValidDigitalAddress = (value) => {
  const regex = /^[A-Z0-9]{1,3}-[0-9]{4}-[0-9]{4}$/i;
  return regex.test(value);
};

const isValidGhanaPhone = (value) => {
  const cleaned = value.replace(/\s/g, '');
  const regex = /^(0[2-5][0-9]{8})$|^(\+233[2-5][0-9]{8})$/;
  return regex.test(cleaned);
};

/**
 * ADD ADDRESS
 */
const addAddress = async (req, res) => {
  try {
    const userId = req.user?.id;
    let { address, city, digitalAddress, phone, notes } = req.body;

    // Check required fields
    if (!userId || !address || !city || !digitalAddress || !phone) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields. Please provide all address details.",
      });
    }

    // Normalize digital address to uppercase
    digitalAddress = normalizeDigitalAddress(digitalAddress);

    // Validate digital address format
    if (!isValidDigitalAddress(digitalAddress)) {
      return res.status(400).json({
        success: false,
        message: "Invalid digital address format. Use GhanaPostGPS format: XX-XXXX-XXXX (e.g., NT-0126-1440)",
      });
    }

    // Validate phone format
    if (!isValidGhanaPhone(phone)) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number. Use Ghana format: 0241234567 or +233241234567",
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
    const { userId: bodyUserId, digitalAddress, phone, ...updatedData } = req.body;

    // Build update object
    const updateObject = { ...updatedData };
    
    // Handle digital address normalization and validation
    if (digitalAddress !== undefined) {
      const normalizedDigitalAddress = normalizeDigitalAddress(digitalAddress);
      if (!isValidDigitalAddress(normalizedDigitalAddress)) {
        return res.status(400).json({
          success: false,
          message: "Invalid digital address format. Use GhanaPostGPS format: XX-XXXX-XXXX (e.g., NT-0126-1440)",
        });
      }
      updateObject.digitalAddress = normalizedDigitalAddress;
    }

    // Validate phone if provided
    if (phone !== undefined && !isValidGhanaPhone(phone)) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number. Use Ghana format: 0241234567 or +233241234567",
      });
    }
    if (phone !== undefined) {
      updateObject.phone = phone;
    }

    const updatedAddress = await Address.findOneAndUpdate(
      { _id: addressId, userId },
      { $set: updateObject },
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