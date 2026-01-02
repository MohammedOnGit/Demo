// // // routes/shop/order-routes.js
// // const express = require('express');
// // const router = express.Router();
// // const { 
// //   createOrder, 
// //   capturePayment, 
// //   getOrderDetails 
// // } = require('../../../controllers/shop/order-controller');

// // // Create new order and initialize PayPal payment
// // router.post('/create', createOrder);

// // // Capture PayPal payment after user approves
// // router.post('/capture', capturePayment);

// // // Get order details
// // router.get('/:orderId', getOrderDetails);

// // module.exports = router;


// //PAYSTACK

// // routes/shop/order-routes.js - UPDATE THIS FILE
// const express = require('express');
// const router = express.Router();
// const { 
//   createOrder, 
//   verifyPayment, // CHANGE: from capturePayment to verifyPayment
//   getOrderDetails 
// } = require('../../../controllers/shop/order-controller');

// // Create new order and initialize Paystack payment
// router.post('/create', createOrder);

// // Verify Paystack payment after user returns from redirect
// router.get('/verify-payment', verifyPayment); // CHANGE: from POST /capture to GET /verify-payment

// const { handlePaystackWebhook } = require('../../../controllers/shop/webhookController'); // Import the new controller


// // Get order details
// router.get('/:orderId', getOrderDetails);
// // Paystack Webhook - MUST use express.raw for signature verification
// router.post('/webhook/paystack', express.raw({ type: 'application/json' }), handlePaystackWebhook);

// module.exports = router;


// routes/shop/order-routes.js - FIXED
const express = require('express');
const router = express.Router();
const { 
  createOrder, 
  verifyPayment,
  getOrderDetails 
} = require('../../../controllers/shop/order-controller'); // FIXED: Correct relative path

const { handlePaystackWebhook } = require('../../../controllers/shop/webhookController');

// Create new order and initialize Paystack payment
router.post('/create', createOrder);

// Verify Paystack payment after user returns from redirect
router.get('/verify-payment', verifyPayment);

// Get order details
router.get('/:orderId', getOrderDetails);

// Paystack Webhook - MUST use express.raw for signature verification
router.post('/webhook/paystack', express.raw({ type: 'application/json' }), handlePaystackWebhook);

module.exports = router;