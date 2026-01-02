// models/Order.js - COMPLETE FIXED FILE
const mongoose = require("mongoose");

// Define a schema
const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  cartItems: [
    {
      productId: {
        type: String,
        required: true
      },
      title: {
        type: String,
        required: true
      },
      image: String,
      price: {
        type: Number,
        required: true
      },
      salePrice: {
        type: Number
      },
      quantity: {
        type: Number,
        required: true,
        min: 1
      },
    },
  ],
  addressInfo: {
    addressId: String,
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    digitalAddress: String,
    phone: String,
    notes: String,
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['paypal', 'paystack', 'cod', 'card'], // FIXED: Added 'paystack'
    default: 'paypal' // Optional: Change to 'paystack' if you prefer
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  orderDate: {
    type: Date,
    default: Date.now
  },
  orderUpdateDate: {
    type: Date,
    default: Date.now
  },
  paymentId: String, // PayPal order ID or Paystack reference
  payerId: String, // PayPal payer ID or Paystack customer email
  // ADD THESE FIELDS FOR BETTER TRACKING
  transactionDetails: {
    captureId: String,
    status: String,
    capturedAt: Date,
    payer: Object
  },
  shippingStatus: {
    type: String,
    enum: ['pending', 'packed', 'shipped', 'out_for_delivery', 'delivered'],
    default: 'pending'
  },
  trackingNumber: String,
  estimatedDelivery: Date
});

// Create model
const Order = mongoose.model("Order", orderSchema);

// Export model
module.exports = Order;