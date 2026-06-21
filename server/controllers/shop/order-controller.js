// server/controllers/shop/order-controller.js
const Order = require('../../models/Order');
const Cart = require('../../models/Cart');
const Product = require('../../models/Product');
const paystack = require('../../helpers/paystack');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

// ------------------------------------------------------------
// SHARED FUNCTION: confirm order after payment (used by both webhook and redirect callback)
// ------------------------------------------------------------
const confirmOrderAfterPayment = async (orderId, transactionData, source = 'callback') => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new Error('Order not found');
  }

  if (order.paymentStatus === 'completed') {
    console.log(`Order ${orderId} already confirmed (source: ${source})`);
    return order;
  }

  // Deduct stock for each item (only for non-backorder items)
  const deductionResults = [];
  const deductionErrors = [];

  for (const item of order.cartItems) {
    const itemStockInfo = item.stockInfo || {};
    // Only deduct if not a backorder (or if backorder, still deduct from reserved)
    if (!itemStockInfo.allowBackorders || itemStockInfo.availableAtCheckout >= item.quantity) {
      try {
        const deductedProduct = await Product.deductStock(item.productId, item.quantity);
        deductionResults.push({
          productId: item.productId,
          title: item.title,
          deducted: item.quantity,
          newTotalStock: deductedProduct.totalStock,
          newAvailableStock: deductedProduct.availableStock,
        });
      } catch (deductError) {
        deductionErrors.push({
          productId: item.productId,
          title: item.title,
          error: deductError.message,
        });
      }
    } else {
      console.log(`[${source}] ⚠️ Skipping stock deduction for backorder item: ${item.title}`);
    }
  }

  if (deductionErrors.length > 0) {
    console.error(`[${source}] ❌ Stock deduction errors:`, deductionErrors);
    // Continue anyway but mark partial deduction
  }

  // Update order status
  order.paymentStatus = 'completed';
  order.orderStatus = 'confirmed';
  order.payerId = transactionData.customer?.email || transactionData.customer_email || 'unknown';
  order.orderUpdateDate = new Date();
  order.stockStatus = deductionErrors.length > 0 ? 'partial_stock_deducted' : 'stock_deducted';
  order.stockDeductedAt = new Date();
  order.deductionResults = deductionResults;
  order.transactionDetails = {
    gateway: 'paystack',
    chargeId: transactionData.id,
    channel: transactionData.channel,
    ipAddress: transactionData.ip_address,
    paidAt: transactionData.paid_at,
    via: source,
  };

  await order.save();
  console.log(`[${source}] ✅ Order ${order._id} confirmed.`);

  // Clear the user's cart (optional but recommended)
  try {
    const cart = await Cart.findOne({ userId: order.userId });
    if (cart) {
      // Only clear items that were part of this order
      const orderProductIds = order.cartItems.map((item) => item.productId.toString());
      cart.items = cart.items.filter(
        (cartItem) => !orderProductIds.includes(cartItem.productId.toString())
      );
      cart.lastUpdated = new Date();
      await cart.save();
      console.log(`[${source}] 🛒 Cart cleared for user: ${order.userId}`);
    }
  } catch (cartError) {
    console.error(`[${source}] ❌ Error clearing cart:`, cartError);
    // Non‑fatal, so we don't throw
  }

  return order;
};

// ------------------------------------------------------------
// CREATE ORDER
// ------------------------------------------------------------
const createOrder = async (req, res) => {
  console.log("🛒 CREATE ORDER REQUEST RECEIVED");

  const startTime = Date.now();
  const requestId = crypto.randomBytes(8).toString('hex');

  console.log(`[${requestId}] 🛒 Starting order creation`, {
    userId: req.body.userId,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });

  try {
    const {
      userId,
      cartItems,
      addressInfo,
      totalAmount,
      customerEmail,
      subtotal = 0,
      shippingFee = 0,
      tax = 0,
      notes = '',
    } = req.body;

    console.log(`[${requestId}] Received data:`, {
      userId,
      cartItemsCount: cartItems?.length,
      totalAmount,
      customerEmail,
      hasAddress: !!addressInfo,
    });

    // Basic validation
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required',
      });
    }

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart items are required and must be an array',
      });
    }

    if (!totalAmount || totalAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid total amount is required',
      });
    }

    if (!customerEmail) {
      return res.status(400).json({
        success: false,
        message: 'Customer email is required',
      });
    }

    // STEP 1: VALIDATE STOCK FOR ALL ITEMS
    console.log(`[${requestId}] 🔍 Validating stock for ${cartItems.length} items...`);

    const stockValidationResults = [];
    const validatedCartItems = [];
    let hasStockIssues = false;
    let hasBackorders = false;

    for (const item of cartItems) {
      if (!item.productId || !item.title || !item.price || !item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Cart item is missing required fields: productId, title, price, or quantity`,
        });
      }

      // Check stock availability
      try {
        const stockCheck = await Product.checkStockAvailability(item.productId, item.quantity);

        stockValidationResults.push({
          productId: item.productId,
          title: item.title,
          requested: item.quantity,
          ...stockCheck,
        });

        if (!stockCheck.available && !stockCheck.allowBackorders) {
          hasStockIssues = true;
        }

        if (stockCheck.allowBackorders && stockCheck.availableStock < item.quantity) {
          hasBackorders = true;
          console.log(
            `[${requestId}] ⚠️ Backorder detected: ${item.title}, Available: ${stockCheck.availableStock}, Requested: ${item.quantity}`
          );
        }

        // Create validated item with stock info
        validatedCartItems.push({
          ...item,
          price: parseFloat(Number(item.price).toFixed(2)),
          quantity: parseInt(item.quantity) || 1,
          productTotal: parseFloat((item.price * item.quantity).toFixed(2)),
          stockInfo: {
            availableAtCheckout: stockCheck.availableStock,
            allowBackorders: stockCheck.allowBackorders,
            isBackorder: stockCheck.allowBackorders && stockCheck.availableStock < item.quantity,
            isLowStock: stockCheck.isLowStock,
          },
        });
      } catch (stockError) {
        console.error(`[${requestId}] ❌ Stock check failed for ${item.productId}:`, stockError);
        return res.status(400).json({
          success: false,
          message: `Failed to check stock for ${item.title}`,
          error: stockError.message,
        });
      }
    }

    // If any items are out of stock (and don't allow backorders), reject the order
    if (hasStockIssues) {
      const outOfStockItems = stockValidationResults
        .filter((item) => !item.available && !item.allowBackorders)
        .map((item) => ({
          productId: item.productId,
          title: item.title,
          requested: item.requested,
          available: item.availableStock,
        }));

      return res.status(400).json({
        success: false,
        message: 'Some items are out of stock',
        outOfStockItems,
        requestId,
      });
    }

    console.log(`[${requestId}] ✅ Stock validation passed. Backorders: ${hasBackorders}`);

    // STEP 2: RESERVE STOCK FOR ALL ITEMS (non-backorder items only)
    console.log(`[${requestId}] 🔒 Reserving stock for non-backorder items...`);

    const reservationResults = [];
    const reservationErrors = [];

    for (const item of validatedCartItems) {
      if (!item.stockInfo.allowBackorders || item.stockInfo.availableAtCheckout >= item.quantity) {
        try {
          const reservedProduct = await Product.reserveStock(item.productId, item.quantity);
          reservationResults.push({
            productId: item.productId,
            title: item.title,
            reserved: item.quantity,
            newReservedStock: reservedProduct.reservedStock,
            newAvailableStock: reservedProduct.availableStock,
          });
        } catch (reserveError) {
          reservationErrors.push({
            productId: item.productId,
            title: item.title,
            error: reserveError.message,
          });
        }
      }
    }

    // If any reservations failed, release all reserved stock and fail
    if (reservationErrors.length > 0) {
      console.error(`[${requestId}] ❌ Stock reservation failed:`, reservationErrors);

      // Release any successfully reserved stock
      for (const result of reservationResults) {
        try {
          await Product.releaseStock(result.productId, result.reserved);
        } catch (releaseError) {
          console.error(`[${requestId}] Failed to release stock for ${result.productId}:`, releaseError);
        }
      }

      return res.status(400).json({
        success: false,
        message: 'Failed to reserve stock for some items',
        reservationErrors,
        requestId,
      });
    }

    console.log(`[${requestId}] ✅ Stock reserved for ${reservationResults.length} items`);

    // STEP 3: CALCULATE TOTALS (BACKEND ONLY)
    let calculatedSubtotal = 0;
    const processedCartItems = validatedCartItems.map((item) => {
      const price = parseFloat(Number(item.price).toFixed(2));
      const quantity = parseInt(item.quantity) || 1;
      const itemTotal = parseFloat((price * quantity).toFixed(2));
      calculatedSubtotal = parseFloat((calculatedSubtotal + itemTotal).toFixed(2));

      return {
        productId: item.productId,
        title: item.title,
        image: item.image || '',
        price: price,
        quantity: quantity,
        productTotal: itemTotal,
        stockInfo: item.stockInfo,
      };
    });

    calculatedSubtotal = parseFloat(calculatedSubtotal.toFixed(2));
    const calculatedShippingFee = parseFloat(Number(shippingFee).toFixed(2));
    const calculatedTax = parseFloat(Number(tax).toFixed(2));
    const calculatedTotal = parseFloat(
      (calculatedSubtotal + calculatedShippingFee + calculatedTax).toFixed(2)
    );

    const frontendTotal = parseFloat(Number(totalAmount).toFixed(2));

    console.log(`[${requestId}] 💰 Total Calculation:`, {
      backend: {
        subtotal: calculatedSubtotal,
        shipping: calculatedShippingFee,
        tax: calculatedTax,
        total: calculatedTotal,
      },
      frontend: {
        total: frontendTotal,
      },
    });

    // FIXED: Use tolerance ONLY to validate, but always charge the calculated total.
    const amountTolerance = Math.max(1.0, calculatedTotal * 0.05);
    if (Math.abs(calculatedTotal - frontendTotal) > amountTolerance) {
      console.warn(`[${requestId}] Amount mismatch`, {
        calculated: calculatedTotal,
        provided: frontendTotal,
        difference: Math.abs(calculatedTotal - frontendTotal),
        tolerance: amountTolerance,
      });

      // Release reserved stock before returning error
      for (const result of reservationResults) {
        try {
          await Product.releaseStock(result.productId, result.reserved);
        } catch (releaseError) {
          console.error(`[${requestId}] Failed to release stock on amount mismatch:`, releaseError);
        }
      }

      return res.status(400).json({
        success: false,
        message: 'Order total does not match calculated amount',
        calculatedTotal: calculatedTotal,
        providedTotal: frontendTotal,
        difference: Math.abs(calculatedTotal - frontendTotal),
        tolerance: amountTolerance,
        requestId,
      });
    }

    // CRITICAL FIX: Always charge the BACKEND-CALCULATED total.
    const finalTotal = calculatedTotal;
    const finalSubtotal = calculatedSubtotal;

    console.log(`[${requestId}] ✅ Totals accepted. Charging:`, {
      total: finalTotal,
      subtotal: finalSubtotal,
      shipping: calculatedShippingFee,
      tax: calculatedTax,
    });

    // STEP 4: CREATE ORDER
    console.log(`[${requestId}] 📝 Creating order record...`);

    const newOrder = new Order({
      userId,
      cartItems: processedCartItems,
      addressInfo: addressInfo || {},
      orderStatus: 'pending',
      paymentMethod: 'paystack',
      paymentStatus: 'pending',
      subtotal: finalSubtotal,
      shippingFee: calculatedShippingFee,
      tax: calculatedTax,
      totalAmount: finalTotal, // now backend‑calculated
      customerEmail,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      stockStatus: hasBackorders ? 'has_backorders' : 'stock_reserved',
      stockReservedAt: new Date(),
      reservationResults: reservationResults.map((r) => ({
        productId: r.productId,
        reserved: r.reserved,
      })),
    });

    const savedOrder = await newOrder.save();
    console.log(`[${requestId}] ✅ Order saved:`, savedOrder._id);

    // STEP 5: INITIALIZE PAYMENT
    const transactionReference = `ORDER_${savedOrder._id}_${Date.now()}`;

    const paystackData = {
      email: customerEmail,
      amount: Math.round(savedOrder.totalAmount * 100), // Convert to kobo
      reference: transactionReference,
      metadata: {
        orderId: savedOrder._id.toString(),
        userId: userId,
        itemsCount: cartItems.length,
        customerEmail: customerEmail,
        hasBackorders: hasBackorders,
        reservedItems: reservationResults.length,
      },
      callback_url: `${process.env.BACKEND_BASE_URL || 'http://localhost:5000'}/api/shop/orders/verify-payment`,
    };

    console.log(`[${requestId}] 🔗 Initializing Paystack payment`, {
      email: customerEmail,
      amount: savedOrder.totalAmount,
      reference: transactionReference,
      callback_url: paystackData.callback_url,
    });

    const paystackResponse = await paystack.initializeTransaction(paystackData);

    if (!paystackResponse.status) {
      console.error(`[${requestId}] ❌ Paystack initialization failed:`, paystackResponse.message);

      // Update order with failure and release reserved stock
      savedOrder.paymentStatus = 'failed';
      savedOrder.orderStatus = 'cancelled';
      savedOrder.orderUpdateDate = new Date();
      savedOrder.cancellationReason = 'Payment initialization failed';
      await savedOrder.save();

      // Release all reserved stock
      for (const result of reservationResults) {
        try {
          await Product.releaseStock(result.productId, result.reserved);
        } catch (releaseError) {
          console.error(`[${requestId}] Failed to release stock on payment fail:`, releaseError);
        }
      }

      return res.status(500).json({
        success: false,
        message: 'Failed to initialize payment gateway',
        error: paystackResponse.message,
        requestId,
      });
    }

    // Update order with payment reference
    savedOrder.paymentId = transactionReference;
    savedOrder.orderUpdateDate = new Date();
    await savedOrder.save();

    const responseTime = Date.now() - startTime;
    console.log(`[${requestId}] ✅ Payment initialized in ${responseTime}ms`);

    // Return success response
    res.status(201).json({
      success: true,
      message: hasBackorders ? 'Order created (some items on backorder)' : 'Order created successfully',
      orderId: savedOrder._id,
      authorization_url: paystackResponse.data.authorization_url,
      data: {
        orderId: savedOrder._id,
        orderNumber: transactionReference,
        totalAmount: savedOrder.totalAmount,
        stockStatus: hasBackorders ? 'has_backorders' : 'stock_reserved',
        backorderCount: hasBackorders
          ? validatedCartItems.filter((item) => item.stockInfo.isBackorder).length
          : 0,
        payment: {
          authorization_url: paystackResponse.data.authorization_url,
          reference: transactionReference,
        },
      },
      requestId,
    });
  } catch (error) {
    const responseTime = Date.now() - startTime;
    console.error(`[${requestId}] ❌ Create Order Error (${responseTime}ms):`, {
      message: error.message,
      stack: error.stack,
      body: req.body,
    });

    res.status(500).json({
      success: false,
      message: 'Internal server error while creating order',
      error: process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred',
      requestId,
      responseTime: `${responseTime}ms`,
    });
  }
};

// ------------------------------------------------------------
// VERIFY PAYMENT (redirect callback)
// ------------------------------------------------------------
const verifyPayment = async (req, res) => {
  console.log('🔍 Verifying payment for reference:', req.query.reference);

  const startTime = Date.now();
  const requestId = crypto.randomBytes(8).toString('hex');

  try {
    const reference = req.query.reference || req.query.trxref;

    if (!reference) {
      console.warn(`[${requestId}] No reference provided in callback`);
      return res.redirect(
        `${process.env.FRONTEND_BASE_URL || 'http://localhost:5173'}/payment-failed?error=no_reference`
      );
    }

    // Verify transaction with Paystack
    const verification = await paystack.verifyTransaction(reference);

    if (!verification.status || verification.data.status !== 'success') {
      console.error(`[${requestId}] Paystack verification failed:`, verification.message);

      // Find order and release reserved stock
      const order = await Order.findOne({ paymentId: reference });
      if (order && order.stockStatus === 'stock_reserved') {
        // Release reserved stock (if any) – we can call Product.releaseStock for each item
        for (const item of order.cartItems) {
          try {
            await Product.releaseStock(item.productId, item.quantity);
          } catch (releaseError) {
            console.error(`[${requestId}] Failed to release stock on payment fail:`, releaseError);
          }
        }
        order.stockStatus = 'stock_released';
        order.orderUpdateDate = new Date();
        await order.save();
      }

      return res.redirect(
        `${process.env.FRONTEND_BASE_URL || 'http://localhost:5173'}/payment-failed?error=verification_failed`
      );
    }

    const order = await Order.findOne({ paymentId: reference });
    if (!order) {
      console.error(`[${requestId}] Order not found for reference:`, reference);
      return res.redirect(
        `${process.env.FRONTEND_BASE_URL || 'http://localhost:5173'}/payment-failed?error=order_not_found`
      );
    }

    const amountPaid = verification.data.amount / 100;
    if (amountPaid !== order.totalAmount) {
      console.error(`[${requestId}] Amount mismatch for order ${order._id}. Paid: ${amountPaid}, Expected: ${order.totalAmount}`);
      order.paymentStatus = 'failed';
      order.orderUpdateDate = new Date();
      await order.save();
      return res.redirect(
        `${process.env.FRONTEND_BASE_URL || 'http://localhost:5173'}/payment-failed?error=amount_mismatch`
      );
    }

    // If already completed, just redirect to confirmation
    if (order.paymentStatus === 'completed') {
      console.log(`[${requestId}] ℹ️ Order ${order._id} already completed.`);
      return res.redirect(
        `${process.env.FRONTEND_BASE_URL || 'http://localhost:5173'}/order-confirmation/${order._id}`
      );
    }

    // ---- USE SHARED CONFIRMATION LOGIC ----
    let confirmedOrder;
    try {
      confirmedOrder = await confirmOrderAfterPayment(order._id, verification.data, 'callback');
    } catch (confirmError) {
      console.error(`[${requestId}] ❌ Failed to confirm order:`, confirmError);
      return res.redirect(
        `${process.env.FRONTEND_BASE_URL || 'http://localhost:5173'}/payment-failed?error=confirmation_failed`
      );
    }

    // Regenerate authentication tokens and set cookies
    try {
      const accessToken = jwt.sign(
        { id: order.userId, role: 'user' },
        process.env.JWT_SECRET,
        { expiresIn: '60m' }
      );

      const refreshToken = jwt.sign(
        { id: order.userId, role: 'user' },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      const isProduction = process.env.NODE_ENV === 'production';

      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        maxAge: 60 * 60 * 1000,
        domain: isProduction ? process.env.COOKIE_DOMAIN : undefined,
      });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        domain: isProduction ? process.env.COOKIE_DOMAIN : undefined,
      });

      console.log(`[${requestId}] 🔑 Authentication cookies set for user: ${order.userId}`);
    } catch (tokenError) {
      console.error(`[${requestId}] ❌ Token generation error:`, tokenError);
    }

    const responseTime = Date.now() - startTime;
    console.log(`[${requestId}] ✅ Verification completed in ${responseTime}ms`);

    // ✅ FIX: Generate a long-lived token (7 days) for the frontend to store permanently
    const urlToken = jwt.sign(
      { id: order.userId, role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }  // Changed from '5m' to '7d'
    );

    const redirectUrl =
      `${process.env.FRONTEND_BASE_URL || 'http://localhost:5173'}/order-confirmation/${order._id}?token=${urlToken}&payment_success=true`;

    console.log(`[${requestId}] 🔀 Redirecting to: ${redirectUrl}`);
    res.redirect(redirectUrl);
  } catch (error) {
    const responseTime = Date.now() - startTime;
    console.error(`[${requestId}] ❌ Verify Payment Error (${responseTime}ms):`, error);

    res.redirect(
      `${process.env.FRONTEND_BASE_URL || 'http://localhost:5173'}/payment-failed?error=server_error`
    );
  }
};

// ------------------------------------------------------------
// GET ORDER DETAILS
// ------------------------------------------------------------
const getOrderDetails = async (req, res) => {
  console.log('📋 Fetching order details:', req.params.orderId);

  const startTime = Date.now();
  const requestId = crypto.randomBytes(8).toString('hex');

  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    const responseTime = Date.now() - startTime;

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
        transactionDetails: order.transactionDetails,
        stockStatus: order.stockStatus,
        stockDeductedAt: order.stockDeductedAt,
        hasBackorders: order.cartItems?.some(
          (item) =>
            item.stockInfo?.isBackorder ||
            (item.stockInfo?.allowBackorders && item.stockInfo?.availableAtCheckout < item.quantity)
        ),
      },
    });
  } catch (error) {
    const responseTime = Date.now() - startTime;
    console.error(`[${requestId}] ❌ Get Order Error (${responseTime}ms):`, error);

    res.status(500).json({
      success: false,
      message: 'Failed to get order details',
    });
  }
};

// ------------------------------------------------------------
// GET ALL ORDERS BY USER ID
// ------------------------------------------------------------
const getAllOrdersByUserId = async (req, res) => {
  console.log('📋 Fetching all orders for user:', req.params.userId);

  const startTime = Date.now();
  const requestId = crypto.randomBytes(8).toString('hex');

  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required',
      });
    }

    const userIdStr = userId.toString();
    console.log(`[${requestId}] Searching orders for user ID string: ${userIdStr}`);

    const orders = await Order.find({ userId: userIdStr }).sort({ orderDate: -1 }).select('-__v');

    console.log(`[${requestId}] Found ${orders.length} orders for user: ${userIdStr}`);

    const responseTime = Date.now() - startTime;

    res.status(200).json({
      success: true,
      count: orders.length,
      orders: orders.map((order) => ({
        _id: order._id,
        userId: order.userId,
        orderNumber: order.paymentId || `ORD-${order._id.toString().slice(-6).toUpperCase()}`,
        cartItems: order.cartItems,
        addressInfo: order.addressInfo,
        orderStatus: order.orderStatus,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        subtotal: order.subtotal,
        shippingFee: order.shippingFee,
        tax: order.tax,
        totalAmount: order.totalAmount,
        orderDate: order.orderDate,
        orderUpdateDate: order.orderUpdateDate,
        paymentId: order.paymentId,
        transactionDetails: order.transactionDetails,
        customerEmail: order.customerEmail,
        stockStatus: order.stockStatus,
        hasBackorders: order.cartItems?.some(
          (item) =>
            item.stockInfo?.isBackorder ||
            (item.stockInfo?.allowBackorders && item.stockInfo?.availableAtCheckout < item.quantity)
        ),
      })),
    });
  } catch (error) {
    const responseTime = Date.now() - startTime;
    console.error(`[${requestId}] ❌ Get All Orders Error (${responseTime}ms):`, error);

    res.status(500).json({
      success: false,
      message: 'Failed to get orders',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Export all functions including the shared one
module.exports = {
  createOrder,
  verifyPayment,
  getOrderDetails,
  getAllOrdersByUserId,
  confirmOrderAfterPayment,
};