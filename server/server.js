
// -------------------- IMPORTS --------------------
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

dotenv.config();

// -------------------- ENV VALIDATION --------------------
const {
  PORT = 5000,
  MONGO_URI,
  CORS_ORIGIN = "http://localhost:5173",
  NODE_ENV = "development",
} = process.env;

if (!MONGO_URI) {
  console.error("❌ Missing MONGO_URI in environment variables");
  process.exit(1);
}

// -------------------- ROUTES --------------------
const authRouter = require("./routes/auth/auth-routes");
const adminProductRoutes = require("./routes/admin/product-routes");
const adminOrderRoutes = require("./routes/admin/order-routes");

const shopProductsRoutes = require("./routes/shop/products-routes");
const shopCartRoutes = require("./routes/shop/cart-routes");
const shopAddressRoutes = require("./routes/shop/address-routes");
const shopSearchRoutes = require("./routes/shop/search-routes");
const shopWishlistRoutes = require("./routes/shop/wishlist-routes");
const shopOrderRoutes = require("./routes/shop/order-routes");
const shopReviewRoutes = require("./routes/shop/review-routes");

const commonFeatureRoutes = require("./routes/common/feature-routes");

// -------------------- APP INIT --------------------
const app = express();

// -------------------- SECURITY --------------------
app.use(helmet());

// -------------------- CORS --------------------
app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposedHeaders: ["Set-Cookie"],
  })
);

// -------------------- BODY PARSERS --------------------
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// -------------------- RATE LIMITING --------------------
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => NODE_ENV === "development",
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});

app.use("/api", apiLimiter);

// -------------------- DATABASE --------------------
mongoose
  .connect(MONGO_URI, {
    autoIndex: NODE_ENV !== "production",
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  });

// -------------------- ROUTE REGISTRATION --------------------

// Auth
app.use("/api/auth", authRouter);

// Admin
app.use("/api/admin/products", adminProductRoutes);
app.use("/api/admin/orders", adminOrderRoutes);

// Shop
app.use("/api/shop/products", shopProductsRoutes);
app.use("/api/shop/cart", shopCartRoutes);
app.use("/api/shop/address", shopAddressRoutes);
app.use("/api/shop/search", shopSearchRoutes);
app.use("/api/shop/wishlist", shopWishlistRoutes);
app.use("/api/shop/orders", shopOrderRoutes);
app.use("/api/shop/reviews", shopReviewRoutes);

// Common
app.use("/api/common/feature", commonFeatureRoutes);

// -------------------- HEALTH CHECK --------------------
app.get("/", (_, res) => {
  res.status(200).json({
    success: true,
    message: "API running",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", (_, res) => {
  res.status(200).json({
    success: true,
    server: "ok",
    database:
      mongoose.connection.readyState === 1
        ? "connected"
        : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

// -------------------- 404 HANDLER --------------------
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// -------------------- GLOBAL ERROR HANDLER --------------------
app.use((err, req, res, _next) => {
  console.error("❌ Server Error:", err);

  res.status(err.status || 500).json({
    success: false,
    message:
      NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
  });
});

// -------------------- START SERVER --------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${NODE_ENV}`);
  console.log(`🔗 CORS Origin: ${CORS_ORIGIN}`);
});