// // controllers/orderController.js
// const Order = require('../../models/Order');
// const paypalHelper = require('../../helpers/paypal');

// const createOrder = async (req, res) => {
//   try {
//     const {
//       userId,
//       cartItems,
//       addressInfo,
//       paymentMethod = 'paypal',
//       totalAmount
//     } = req.body;

//     // Validate required fields
//     if (!userId || !cartItems || !totalAmount || cartItems.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Missing required fields"
//       });
//     }

//     // Create order in database
//     const newOrder = new Order({
//       userId,
//       cartItems,
//       addressInfo: addressInfo || {},
//       orderStatus: 'pending',
//       paymentMethod,
//       paymentStatus: 'pending',
//       totalAmount,
//       orderDate: new Date()
//     });

//     const savedOrder = await newOrder.save();

//     // Generate PayPal return URLs
//     const { returnUrl, cancelUrl } = paypalHelper.generateReturnUrls(savedOrder._id);

//     // Create PayPal order
//     const paypalResult = await paypalHelper.createOrder({
//       orderId: savedOrder._id,
//       totalAmount: savedOrder.totalAmount,
//       cartItems: savedOrder.cartItems,
//       addressInfo: savedOrder.addressInfo,
//       returnUrl,
//       cancelUrl
//     });

//     if (!paypalResult.success) {
//       savedOrder.paymentStatus = 'failed';
//       savedOrder.orderUpdateDate = new Date();
//       await savedOrder.save();

//       return res.status(500).json({
//         success: false,
//         message: 'Failed to create PayPal order',
//         error: paypalResult.error
//       });
//     }

//     // Update order with PayPal ID
//     savedOrder.paymentId = paypalResult.paypalOrderId;
//     savedOrder.orderUpdateDate = new Date();
//     await savedOrder.save();

//     res.status(201).json({
//       success: true,
//       message: 'Order created successfully',
//       orderId: savedOrder._id,
//       paypalOrderId: paypalResult.paypalOrderId,
//       approvalUrl: paypalResult.approvalUrl
//     });

//   } catch (error) {
//     console.error('Create Order Error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error'
//     });
//   }
// };

// const capturePayment = async (req, res) => {
//   try {
//     const { orderId } = req.body;
    
//     if (!orderId) {
//       return res.status(400).json({
//         success: false,
//         message: 'Order ID is required'
//       });
//     }

//     const order = await Order.findById(orderId);
    
//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: 'Order not found'
//       });
//     }

//     if (order.paymentStatus === 'completed') {
//       return res.status(200).json({
//         success: true,
//         message: 'Payment already captured',
//         order: order
//       });
//     }

//     if (!order.paymentId) {
//       return res.status(400).json({
//         success: false,
//         message: 'No PayPal order associated'
//       });
//     }

//     // Capture payment
//     const captureResult = await paypalHelper.capturePayment(order.paymentId);

//     if (!captureResult.success) {
//       if (captureResult.statusCode === 422) {
//         order.paymentStatus = 'failed';
//         order.orderStatus = 'cancelled';
//         order.orderUpdateDate = new Date();
//         await order.save();

//         return res.status(422).json({
//           success: false,
//           message: 'Payment already captured or order expired'
//         });
//       }

//       return res.status(500).json({
//         success: false,
//         message: 'Payment capture failed',
//         error: captureResult.error
//       });
//     }

//     // Update order with successful payment
//     order.paymentStatus = 'completed';
//     order.orderStatus = 'confirmed';
//     order.payerId = captureResult.payer?.payer_id || captureResult.payer?.email_address;
//     order.orderUpdateDate = new Date();
//     order.transactionDetails = {
//       captureId: captureResult.captureId,
//       status: captureResult.status,
//       capturedAt: new Date()
//     };

//     await order.save();

//     res.status(200).json({
//       success: true,
//       message: 'Payment captured successfully',
//       order: {
//         id: order._id,
//         status: order.orderStatus,
//         paymentStatus: order.paymentStatus,
//         totalAmount: order.totalAmount
//       }
//     });

//   } catch (error) {
//     console.error('Capture Payment Error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to capture payment'
//     });
//   }
// };

// const getOrderDetails = async (req, res) => {
//   try {
//     const { orderId } = req.params;
    
//     const order = await Order.findById(orderId);
    
//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: 'Order not found'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       order: order
//     });
//   } catch (error) {
//     console.error('Get Order Error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to get order details'
//     });
//   }
// };

// module.exports = { 
//   createOrder, 
//   capturePayment,
//   getOrderDetails
// };


// controllers/orderController.js - UPDATED WITH DEBUG INFO
const Order = require('../../models/Order'); // FIXED PATH
const paypalHelper = require('../../helpers/paypal');

const createOrder = async (req, res) => {
  console.log('=== CREATE ORDER REQUEST RECEIVED ===');
  
  try {
    const {
      userId,
      cartItems,
      addressInfo,
      paymentMethod = 'paypal',
      totalAmount
    } = req.body;

    console.log('Request data:', {
      userId,
      cartItemsCount: cartItems?.length,
      totalAmount,
      addressInfo: addressInfo ? 'present' : 'missing'
    });

    // Validate required fields
    if (!userId || !cartItems || !totalAmount || cartItems.length === 0) {
      console.error('Validation failed: Missing required fields');
      return res.status(400).json({
        success: false,
        message: "Missing required fields: userId, cartItems, or totalAmount"
      });
    }

    // Log cart item structure
    console.log('First cart item:', cartItems[0]);
    console.log('Price type in cart:', typeof cartItems[0].price);
    console.log('Sale price type:', typeof cartItems[0].salePrice);

    // FIX: Convert price fields to numbers
    const processedCartItems = cartItems.map(item => ({
      productId: item.productId,
      title: item.title,
      image: item.image || '',
      price: Number(item.price || 0), // Convert to number
      salePrice: item.salePrice ? Number(item.salePrice) : undefined,
      quantity: Number(item.quantity || 1)
    }));

    console.log('Processed cart items:', processedCartItems[0]);

    // Create order in database
    const newOrder = new Order({
      userId,
      cartItems: processedCartItems, // Use processed items
      addressInfo: addressInfo || {},
      orderStatus: 'pending',
      paymentMethod,
      paymentStatus: 'pending',
      totalAmount: Number(totalAmount), // Convert to number
      orderDate: new Date(),
      orderUpdateDate: new Date()
    });

    console.log('Attempting to save order...');
    const savedOrder = await newOrder.save();
    console.log('✅ Order saved successfully. ID:', savedOrder._id);

    // Check if PayPal is configured
    if (!paypalHelper || !paypalHelper.isConfigured) {
      console.error('PayPal helper not configured');
      savedOrder.paymentStatus = 'failed';
      savedOrder.orderUpdateDate = new Date();
      await savedOrder.save();

      return res.status(500).json({
        success: false,
        message: 'Payment system not configured',
        orderId: savedOrder._id
      });
    }

    // Generate PayPal return URLs
    const { returnUrl, cancelUrl } = paypalHelper.generateReturnUrls(savedOrder._id);
    console.log('Generated URLs:', { returnUrl, cancelUrl });

    // Create PayPal order
    console.log('Creating PayPal order...');
    const paypalResult = await paypalHelper.createOrder({
      orderId: savedOrder._id,
      totalAmount: savedOrder.totalAmount,
      cartItems: savedOrder.cartItems,
      addressInfo: savedOrder.addressInfo,
      returnUrl,
      cancelUrl
    });

    console.log('PayPal result:', paypalResult);

    if (!paypalResult.success) {
      console.error('PayPal order creation failed:', paypalResult.error);
      
      savedOrder.paymentStatus = 'failed';
      savedOrder.orderUpdateDate = new Date();
      await savedOrder.save();

      return res.status(500).json({
        success: false,
        message: 'Failed to create PayPal order',
        error: paypalResult.error,
        orderId: savedOrder._id
      });
    }

    // Update order with PayPal ID
    savedOrder.paymentId = paypalResult.paypalOrderId;
    savedOrder.orderUpdateDate = new Date();
    await savedOrder.save();

    console.log('✅ PayPal order created:', paypalResult.paypalOrderId);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      orderId: savedOrder._id,
      paypalOrderId: paypalResult.paypalOrderId,
      approvalUrl: paypalResult.approvalUrl
    });

  } catch (error) {
    console.error('❌ CREATE ORDER ERROR:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    // Handle specific Mongoose errors
    if (error.name === 'ValidationError') {
      console.error('Validation errors:', error.errors);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.keys(error.errors).map(key => ({
          field: key,
          message: error.errors[key].message
        }))
      });
    }

    if (error.name === 'CastError') {
      console.error('Cast error:', error);
      return res.status(400).json({
        success: false,
        message: 'Invalid data format',
        field: error.path,
        value: error.value
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error creating order',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const capturePayment = async (req, res) => {
  console.log('=== CAPTURE PAYMENT REQUEST ===');
  
  try {
    const { orderId } = req.body;
    
    console.log('Capture request for order:', orderId);
    
    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required'
      });
    }

    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    console.log('Found order:', order._id, 'Payment status:', order.paymentStatus);

    if (order.paymentStatus === 'completed') {
      return res.status(200).json({
        success: true,
        message: 'Payment already captured',
        order: order
      });
    }

    if (!order.paymentId) {
      return res.status(400).json({
        success: false,
        message: 'No PayPal order associated'
      });
    }

    // Check PayPal helper
    if (!paypalHelper || !paypalHelper.isConfigured) {
      console.error('PayPal helper not configured for capture');
      return res.status(500).json({
        success: false,
        message: 'Payment system not configured'
      });
    }

    console.log('Capturing PayPal payment:', order.paymentId);
    const captureResult = await paypalHelper.capturePayment(order.paymentId);
    console.log('Capture result:', captureResult);

    if (!captureResult.success) {
      if (captureResult.statusCode === 422) {
        order.paymentStatus = 'failed';
        order.orderStatus = 'cancelled';
        order.orderUpdateDate = new Date();
        await order.save();

        return res.status(422).json({
          success: false,
          message: 'Payment already captured or order expired'
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Payment capture failed',
        error: captureResult.error
      });
    }

    // Update order with successful payment
    order.paymentStatus = 'completed';
    order.orderStatus = 'confirmed';
    order.payerId = captureResult.payer?.payer_id || captureResult.payer?.email_address;
    order.orderUpdateDate = new Date();
    order.transactionDetails = {
      captureId: captureResult.captureId,
      status: captureResult.status,
      capturedAt: new Date(),
      payer: captureResult.payer
    };

    await order.save();
    console.log('✅ Payment captured successfully for order:', order._id);

    res.status(200).json({
      success: true,
      message: 'Payment captured successfully',
      order: {
        id: order._id,
        status: order.orderStatus,
        paymentStatus: order.paymentStatus,
        totalAmount: order.totalAmount
      },
      transactionId: captureResult.captureId
    });

  } catch (error) {
    console.error('❌ CAPTURE PAYMENT ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to capture payment',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      order: order
    });
  } catch (error) {
    console.error('Get Order Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get order details'
    });
  }
};

module.exports = { 
  createOrder, 
  capturePayment,
  getOrderDetails
};