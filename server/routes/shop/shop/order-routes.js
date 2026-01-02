// routes/shop/order-routes.js
const express = require('express');
const router = express.Router();
const { 
  createOrder, 
  capturePayment, 
  getOrderDetails 
} = require('../../../controllers/shop/order-controller');

// Create new order and initialize PayPal payment
router.post('/create', createOrder);

// Capture PayPal payment after user approves
router.post('/capture', capturePayment);

// Get order details
router.get('/:orderId', getOrderDetails);

module.exports = router;