const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/auth/auth-routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Database connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*', // Allow all origins by default
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Cache-Control',
      'Expires',
      'Pragma',
    ],
  })
);

app.use(cookieParser());
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);

// Start server (put this at the bottom)
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
