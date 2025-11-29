const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
      // trim: true,
      // lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      // match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: true,
      // minlength: 6,
      // select: false,
    },
    role: {
      type: String,
      default: "admin", // Change default to "admin" for testing purposes
      // enum: ["user", "admin"],
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;
