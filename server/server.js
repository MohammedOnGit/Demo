// server/server.js
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const authRouter = require("./routes/auth/auth-routes"); 
const adminProductRoutes = require("./routes/admin/product-routes");
const shopProductsRoutes = require('./routes/shop/products-routes')

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(cookieParser());
app.use(express.json());

// DB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ DB error:", err));

// Routes
app.use("/api/auth", authRouter);
app.use("/api/admin/products", adminProductRoutes);
app.use("/api/shop/products", shopProductsRoutes)

app.get("/", (req, res) => res.json({ message: "API running..." }));

// Global Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ success: false, message: err.message });
});

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
