// server/controllers/shop/webhookController.js
const crypto = require('crypto');
const Order = require('../../models/Order');
const Cart = require('../../models/Cart');
const { confirmOrderAfterPayment } = require('./order-controller'); // shared function

const handlePaystackWebhook = async (req, res) => {
  const webhookId = crypto.randomBytes(8).toString('hex');
  console.log(`[WEBHOOK-${webhookId}] 🪝 Webhook received`);

  try {
    // 1. Get the raw body (Buffer) – must be the exact raw payload sent by Paystack
    const rawBody = req.body;
    if (!rawBody || !Buffer.isBuffer(rawBody)) {
      console.error(`[WEBHOOK-${webhookId}] ❌ Request body is not a Buffer`);
      return res.status(400).send('Invalid payload');
    }

    // 2. Verify HMAC signature
    const signature = req.headers['x-paystack-signature'];
    if (!signature) {
      console.error(`[WEBHOOK-${webhookId}] ❌ Missing x-paystack-signature header`);
      return res.status(401).send('Unauthorized');
    }

    const expectedSignature = crypto
      .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
      .update(rawBody)
      .digest('hex');

    if (signature !== expectedSignature) {
      console.error(`[WEBHOOK-${webhookId}] ❌ Invalid signature`);
      return res.status(401).send('Unauthorized');
    }

    // 3. Parse the JSON payload
    let event;
    try {
      event = JSON.parse(rawBody.toString());
    } catch (parseError) {
      console.error(`[WEBHOOK-${webhookId}] ❌ Failed to parse JSON payload:`, parseError);
      return res.status(400).send('Invalid JSON');
    }

    console.log(`[WEBHOOK-${webhookId}] Event: ${event.event}`);

    // 4. Handle event types
    if (event.event === 'charge.success') {
      const transactionData = event.data;

      // Find the order using the reference
      const order = await Order.findOne({ paymentId: transactionData.reference });
      if (!order) {
        console.error(`[WEBHOOK-${webhookId}] Order not found for reference: ${transactionData.reference}`);
        return res.sendStatus(404);
      }

      // Optional: verify amount consistency
      const amountPaid = transactionData.amount / 100;
      if (amountPaid !== order.totalAmount) {
        console.error(`[WEBHOOK-${webhookId}] Amount mismatch for order ${order._id}. Paid: ${amountPaid}, Expected: ${order.totalAmount}`);
        order.paymentStatus = 'failed';
        await order.save();
        return res.sendStatus(400);
      }

      // Skip if already completed
      if (order.paymentStatus === 'completed') {
        console.log(`[WEBHOOK-${webhookId}] ℹ️ Order ${order._id} already completed.`);
        return res.sendStatus(200);
      }

      // ---- USE SHARED CONFIRMATION LOGIC ----
      try {
        await confirmOrderAfterPayment(order._id, transactionData, 'webhook');
        console.log(`[WEBHOOK-${webhookId}] ✅ Order ${order._id} confirmed via webhook.`);

        // Clear the user's cart (optional, but keep it here)
        try {
          const cart = await Cart.findOne({ userId: order.userId });
          if (cart) {
            cart.items = [];
            cart.lastUpdated = new Date();
            await cart.save();
            console.log(`[WEBHOOK-${webhookId}] 🛒 Cart cleared for user: ${order.userId}`);
          }
        } catch (cartError) {
          console.error(`[WEBHOOK-${webhookId}] ❌ Error clearing cart:`, cartError);
        }

        res.sendStatus(200);
      } catch (confirmError) {
        console.error(`[WEBHOOK-${webhookId}] ❌ Failed to confirm order:`, confirmError);
        res.sendStatus(500);
      }
    } else if (event.event === 'charge.failed') {
      console.log(`[WEBHOOK-${webhookId}] ❌ Payment failed for reference: ${event.data.reference}`);

      const order = await Order.findOne({ paymentId: event.data.reference });
      if (order) {
        order.paymentStatus = 'failed';
        order.orderUpdateDate = new Date();
        await order.save();
        // Optionally release reserved stock here as well (via a shared function)
        console.log(`[WEBHOOK-${webhookId}] Updated order ${order._id} to failed status`);
      }

      res.sendStatus(200);
    } else {
      console.log(`[WEBHOOK-${webhookId}] ℹ️ Received unhandled event: ${event.event}`);
      res.sendStatus(200);
    }
  } catch (error) {
    console.error(`[WEBHOOK-${webhookId}] ❌ Webhook processing error:`, error);
    res.sendStatus(500);
  }
};

module.exports = { handlePaystackWebhook };