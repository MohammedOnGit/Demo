const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 5000;

//Database connection
mongoose.connect(process.env.MONGO_URI,).then(() => {
  console.log('MongoDB connected successfully');
}).catch(err => {
  console.error('MongoDB connection error:', err);
}); 


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
})

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*', // Allow all origins by default
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // Allow credentials if needed
    allowedHeaders: [
      'Content-Type', 
      'Authorization', 
      'Cache-Control',
      'Expires',
      'Pragma'
    ], // Specify allowed headers
  })
)

app.use(cookieParser());
app.use(express.json());