// controllers/shop/order-controller.js - COMPLETE FIXED VERSION
const Order = require('../../models/Order');
const Cart = require('../../models/Cart');
const paystack = require('../../helpers/paystack');

const createOrder = async (req, res) => {
  try {
    console.log('🛒 Creating order with data:', {
      userId: req.body.userId,
      cartItemsCount: req.body.cartItems?.length,
      totalAmount: req.body.totalAmount,
      customerEmail: req.body.customerEmail
    });
    
    const { userId, cartItems, addressInfo, totalAmount, customerEmail } = req.body;

    // Enhanced validation with specific error messages
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart items are required and must be an array"
      });
    }

    if (!totalAmount || totalAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid total amount is required"
      });
    }

    if (!customerEmail) {
      return res.status(400).json({
        success: false,
        message: "Customer email is required"
      });
    }

    // Validate each cart item
    for (let i = 0; i < cartItems.length; i++) {
      const item = cartItems[i];
      if (!item.productId || !item.title || !item.price || !item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Cart item ${i + 1} is missing required fields: productId, title, price, or quantity`
        });
      }
    }

    const newOrder = new Order({
      userId,
      cartItems: cartItems.map(item => ({
        productId: item.productId,
        title: item.title,
        image: item.image || '',
        price: Number(item.price),
        salePrice: item.salePrice ? Number(item.salePrice) : undefined,
        quantity: Number(item.quantity)
      })),
      addressInfo: addressInfo || {},
      orderStatus: 'pending',
      paymentMethod: 'paystack',
      paymentStatus: 'pending',
      totalAmount: Number(totalAmount),
      orderDate: new Date(),
      orderUpdateDate: new Date()
    });

    const savedOrder = await newOrder.save();
    console.log('✅ Order saved:', savedOrder._id);

    const amountInKobo = Math.round(savedOrder.totalAmount * 100);
    const transactionReference = `ORDER_${savedOrder._id}_${Date.now()}`;
    
    const backendBaseUrl = process.env.BACKEND_BASE_URL || 'http://localhost:5000';

    const paystackData = {
      email: customerEmail,
      amount: amountInKobo,
      reference: transactionReference,
      callback_url: `${backendBaseUrl}/api/shop/orders/verify-payment`,
      metadata: {
        orderId: savedOrder._id.toString(),
        userId: userId,
        cartCount: cartItems.length
      }
    };

    console.log('🔗 Initializing Paystack payment with data:', paystackData);

    const paystackResponse = await paystack.initializeTransaction(paystackData);

    if (!paystackResponse.status) {
      console.error('❌ Paystack initialization failed:', paystackResponse.message);
      
      savedOrder.paymentStatus = 'failed';
      savedOrder.orderUpdateDate = new Date();
      await savedOrder.save();

      return res.status(500).json({
        success: false,
        message: 'Failed to initialize payment gateway',
        error: paystackResponse.message
      });
    }

    savedOrder.paymentId = transactionReference;
    savedOrder.orderUpdateDate = new Date();
    await savedOrder.save();

    console.log('🔗 Paystack payment link generated for order:', savedOrder._id);

    res.status(201).json({
      success: true,
      message: 'Order created. Redirect to payment.',
      orderId: savedOrder._id,
      authorization_url: paystackResponse.data.authorization_url
    });

  } catch (error) {
    console.error('❌ Create Order Error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error creating order',
      error: error.message
    });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { reference } = req.query;
    
    console.log('🔍 Verifying payment for reference:', reference);
    
    if (!reference) {
      console.warn('No reference provided in callback');
      return res.redirect(`${process.env.FRONTEND_BASE_URL || 'http://localhost:5173'}/payment-failed?error=no_reference`);
    }

    const verification = await paystack.verifyTransaction(reference);
    
    if (!verification.status || verification.data.status !== 'success') {
      console.error('Paystack verification failed:', verification.message);
      return res.redirect(`${process.env.FRONTEND_BASE_URL || 'http://localhost:5173'}/payment-failed?error=verification_failed`);
    }

    const order = await Order.findOne({ paymentId: reference });
    if (!order) {
      console.error('Order not found for reference:', reference);
      return res.redirect(`${process.env.FRONTEND_BASE_URL || 'http://localhost:5173'}/payment-failed?error=order_not_found`);
    }

    const amountPaid = verification.data.amount / 100;
    if (amountPaid !== order.totalAmount) {
      console.error(`Amount mismatch for order ${order._id}. Paid: ${amountPaid}, Expected: ${order.totalAmount}`);
      order.paymentStatus = 'amount_mismatch';
      await order.save();
      return res.redirect(`${process.env.FRONTEND_BASE_URL || 'http://localhost:5173'}/payment-failed?error=amount_mismatch`);
    }

    if (order.paymentStatus === 'completed') {
      console.log(`ℹ️ Order ${order._id} already completed via webhook. Redirecting user.`);
      return res.redirect(`${process.env.FRONTEND_BASE_URL || 'http://localhost:5173'}/order-confirmation/${order._id}`);
    }

    order.paymentStatus = 'completed';
    order.orderStatus = 'confirmed';
    order.payerId = verification.data.customer.email;
    order.orderUpdateDate = new Date();
    order.transactionDetails = {
      gateway: 'paystack',
      chargeId: verification.data.id,
      channel: verification.data.channel,
      ipAddress: verification.data.ip_address,
      paidAt: verification.data.paid_at
    };
    
    await order.save();
    console.log(`✅ Order ${order._id} confirmed via callback verification.`);

    try {
      const cart = await Cart.findOne({ userId: order.userId });
      if (cart) {
        cart.items = [];
        cart.lastUpdated = new Date();
        await cart.save();
        console.log(`🛒 Cart cleared for user: ${order.userId}`);
      } else {
        console.log(`ℹ️ No cart found for user: ${order.userId}`);
      }
    } catch (cartError) {
      console.error(`❌ Error clearing cart for user ${order.userId}:`, cartError);
    }

    res.redirect(`${process.env.FRONTEND_BASE_URL || 'http://localhost:5173'}/order-confirmation/${order._id}`);

  } catch (error) {
    console.error('❌ Verify Payment Error:', error);
    res.redirect(`${process.env.FRONTEND_BASE_URL || 'http://localhost:5173'}/payment-failed?error=server_error`);
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;
    console.log('📋 Fetching order details:', orderId);
    
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      order: {
        id: order._id,
        userId: order.userId,
        cartItems: order.cartItems,
        addressInfo: order.addressInfo,
        orderStatus: order.orderStatus,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        totalAmount: order.totalAmount,
        orderDate: order.orderDate,
        paymentId: order.paymentId,
        transactionDetails: order.transactionDetails
      }
    });
  } catch (error) {
    console.error('❌ Get Order Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get order details'
    });
  }
};

module.exports = { 
  createOrder, 
  verifyPayment,
  getOrderDetails 
};