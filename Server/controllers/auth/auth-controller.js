// controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require('../../models/User');


// ✅ Register User
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d", // token valid for 1 day
      }
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (e) {
    console.error(e.message);
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};

// ✅ Login User
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email }).select("+password"); // password was set to select:false in schema
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (e) {
    console.error(e.message);
    res.status(500).json({ success: false, message: "Something went wrong!" });
  }
};

// ✅ Logout (handled client-side, but we can invalidate tokens if using a DB/Redis)
const logout = (req, res) => {
  res.json({
    success: true,
    message: "Logout successful. Please clear token on client.",
  });
};

// ✅ Auth Middleware (protect routes)
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to request
    next();
  } catch (e) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

module.exports = { registerUser, login, logout, authMiddleware };
