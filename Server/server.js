// const express = require('express');
// const mongoose = require('mongoose');
// require('dotenv').config();
// const cors = require('cors');
// const cookieParser = require('cookie-parser');

// const app = express();
// const PORT = process.env.PORT || 5000;

// //Database connection
// mongoose.connect(process.env.MONGO_URI,).then(() => {
//   console.log('MongoDB connected successfully');
// }).catch(err => {
//   console.error('MongoDB connection error:', err);
// }); 


// app.listen(PORT, () => {
//   console.log(`Example app listening on port ${PORT}`);
// })

// app.use(
//   cors({
//     origin: process.env.CORS_ORIGIN || '*', // Allow all origins by default
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     credentials: true, // Allow credentials if needed
//     allowedHeaders: [
//       'Content-Type', 
//       'Authorization', 
//       'Cache-Control',
//       'Expires',
//       'Pragma'
//     ], // Specify allowed headers
//   })
// )

// app.use(cookieParser());
// app.use(express.json());

//======FIXED VERSION OF CHATGPT======
// const express = require("express");
// const mongoose = require("mongoose");
// require("dotenv").config();
// const cors = require("cors");
// const cookieParser = require("cookie-parser");

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Database connection
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log("MongoDB connected successfully");
//   })
//   .catch((err) => {
//     console.error("MongoDB connection error:", err);
//   });

// // ✅ Apply middleware BEFORE listen
// app.use(
//   cors({
//     origin: process.env.CORS_ORIGIN, // no extra space, no slash
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true,
//     allowedHeaders: [
//       "Content-Type",
//       "Authorization",
//       "Cache-Control",
//       "Expires",
//       "Pragma",
//     ],
//   })
// );

// app.use(cookieParser());
// app.use(express.json());

// // Example test route
// app.get("/", (req, res) => {
//   res.json({ message: "CORS fixed!" });
// });

// // ✅ Start server after middleware
// app.listen(PORT, () => {
//   console.log(`Example app listening on port ${PORT}`);
// });


//INDUSTRY BEST PRACTICES

const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(cookieParser());
app.use(express.json());

// DB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ DB error:", err));

// Routes
app.get("/", (req, res) => res.json({ message: "API running..." }));

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ success: false, message: err.message });
});

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
