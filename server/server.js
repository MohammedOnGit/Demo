// const express = require("express");
// const mongoose = require("mongoose");
// require("dotenv").config();
// const cors = require("cors");
// const cookieParser = require("cookie-parser");
// const helmet = require("helmet");
// const rateLimit = require("express-rate-limit");

// // Routes
// const authRouter = require("./routes/auth/auth-routes");
// const adminProductRoutes = require("./routes/admin/product-routes");
// const shopProductsRoutes = require("./routes/shop/products-routes");
// const shopCartRoutes = require("./routes/shop/cart-routes");
// const shopAddressRoutes = require("./routes/shop/address-routes");
// const shopSearchRoutes = require("./routes/shop/search-routes");
// const shopWishlistRoutes = require("./routes/shop/wishlist-routes");
// const shopOrderRoutes = require("./routes/shop/shop/order-routes"); // ADD THIS LINE


// const app = express();
// const PORT = process.env.PORT || 5000;

// /* -------------------- MIDDLEWARE -------------------- */
// app.use(helmet());

// app.use(
//   cors({
//     origin: process.env.CORS_ORIGIN || "http://localhost:5173",
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true,
//   })
// );

// // Rate limit ONLY API routes
// app.use(
//   "/api",
//   rateLimit({
//     windowMs: 15 * 60 * 1000,
//     max: 100,
//   })
// );

// app.use(cookieParser());

// // ✅ REQUIRED: JSON + URL-ENCODED BODY PARSERS
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// /* -------------------- DATABASE -------------------- */
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("✅ MongoDB connected"))
//   .catch((err) => console.error("❌ MongoDB error:", err));

// /* -------------------- ROUTES -------------------- */
// app.use("/api/auth", authRouter);
// app.use("/api/admin/products", adminProductRoutes);
// app.use("/api/shop/products", shopProductsRoutes);
// app.use("/api/shop/cart", shopCartRoutes);
// app.use("/api/shop/address", shopAddressRoutes);
// app.use("/api/shop/search", shopSearchRoutes);
// app.use("/api/shop/wishlist", shopWishlistRoutes); // ADD THIS LINE
// app.use("/api/shop/orders", shopOrderRoutes); // ADD THIS LINE


// /* -------------------- HEALTH CHECK -------------------- */
// app.get("/", (req, res) => {
//   res.status(200).json({ message: "API running..." });
// });

// /* -------------------- GLOBAL ERROR HANDLER -------------------- */
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res
//     .status(err.status || 500)
//     .json({ success: false, message: err.message || "Server Error" });
// });

// /* -------------------- START SERVER -------------------- */
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });


// server.js - UPDATE THIS FILE
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// Routes
const authRouter = require("./routes/auth/auth-routes");
const adminProductRoutes = require("./routes/admin/product-routes");
const shopProductsRoutes = require("./routes/shop/products-routes");
const shopCartRoutes = require("./routes/shop/cart-routes");
const shopAddressRoutes = require("./routes/shop/address-routes");
const shopSearchRoutes = require("./routes/shop/search-routes");
const shopWishlistRoutes = require("./routes/shop/wishlist-routes");
const shopOrderRoutes = require("./routes/shop/shop/order-routes"); // FIXED PATH

const app = express();
const PORT = process.env.PORT || 5000;

/* -------------------- MIDDLEWARE -------------------- */
app.use(helmet());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Rate limit ONLY API routes
app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* -------------------- DATABASE -------------------- */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

/* -------------------- ROUTES -------------------- */
app.use("/api/auth", authRouter);
app.use("/api/admin/products", adminProductRoutes);
app.use("/api/shop/products", shopProductsRoutes);
app.use("/api/shop/cart", shopCartRoutes);
app.use("/api/shop/address", shopAddressRoutes);
app.use("/api/shop/search", shopSearchRoutes);
app.use("/api/shop/wishlist", shopWishlistRoutes);
app.use("/api/shop/orders", shopOrderRoutes); // ADD THIS LINE

/* -------------------- HEALTH CHECK -------------------- */
app.get("/", (req, res) => {
  res.status(200).json({ message: "API running..." });
});

/* -------------------- GLOBAL ERROR HANDLER -------------------- */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(err.status || 500)
    .json({ success: false, message: err.message || "Server Error" });
});

/* -------------------- START SERVER -------------------- */
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});