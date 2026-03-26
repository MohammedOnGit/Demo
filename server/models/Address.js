// const mongoose = require("mongoose");

// const AddressSchema = new mongoose.Schema(
//   {
//     userId: {
//       type: String,
//       required: true,
//     },
//     address: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     city: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     digitalAddress: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     phone: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     notes: {
//       type: String,
//       default: "",
//       trim: true,
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Address", AddressSchema);



const mongoose = require("mongoose");

// Normalize digital address to uppercase
const normalizeDigitalAddress = (value) => {
  return value ? value.toUpperCase().trim() : value;
};

// Validation functions - case insensitive
const isValidDigitalAddress = (value) => {
  // Accept both upper and lower case, but validate format
  const regex = /^[A-Z0-9]{1,3}-[0-9]{4}-[0-9]{4}$/i;
  return regex.test(value);
};

const isValidGhanaPhone = (value) => {
  // Remove all whitespace
  const cleaned = value.replace(/\s/g, '');
  // Ghana phone formats: 0241234567 or +233241234567
  const regex = /^(0[2-5][0-9]{8})$|^(\+233[2-5][0-9]{8})$/;
  return regex.test(cleaned);
};

const AddressSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    digitalAddress: {
      type: String,
      required: true,
      trim: true,
      set: normalizeDigitalAddress, // Auto-uppercase on save
      validate: {
        validator: isValidDigitalAddress,
        message: props => `${props.value} is not a valid GhanaPostGPS digital address. Format: XX-XXXX-XXXX (e.g., NT-0126-1440)`
      }
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: isValidGhanaPhone,
        message: props => `${props.value} is not a valid Ghana phone number. Format: 0241234567 or +233241234567`
      }
    },
    notes: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Address", AddressSchema);