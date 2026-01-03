const crypto = require('crypto');
const Order = require('../../models/Order');
const Cart = require('../../models/Cart');

const handlePaystackWebhook = async (req, res) => {
  // 1. Verify the webhook signature (CRITICAL FOR SECURITY)
  const hash = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
                     .update(JSON.stringify(req.body))
                     .digest('hex');
  
  if (hash !== req.headers['x-paystack-signature']) {
    console.error('❌ Webhook signature verification failed');
    return res.sendStatus(400);
  }

  const event = req.body;
  console.log(`🪝 Webhook Received: ${event.event}`);

  // 2. Process the 'charge.success' event
  if (event.event === 'charge.success') {
    const transactionData = event.data;
    
    try {
      // 3. Find the order by the transaction reference
      const order = await Order.findOne({ paymentId: transactionData.reference });
      
      if (!order) {
        console.error(`Order not found for reference: ${transactionData.reference}`);
        return res.sendStatus(404);
      }

      // 4. CRITICAL: Verify the amount paid matches your order total
      const amountPaid = transactionData.amount / 100; // Convert from kobo
      if (amountPaid !== order.totalAmount) {
        console.error(`Amount mismatch for order ${order._id}. Paid: ${amountPaid}, Expected: ${order.totalAmount}`);
        order.paymentStatus = 'amount_mismatch';
        await order.save();
        return res.sendStatus(400);
      }

      // 5. Update order only if still pending (idempotency check)
      if (order.paymentStatus !== 'completed') {
        order.paymentStatus = 'completed';
        order.orderStatus = 'confirmed';
        order.payerId = transactionData.customer.email;
        order.orderUpdateDate = new Date();
        order.transactionDetails = {
          gateway: 'paystack',
          chargeId: transactionData.id,
          channel: transactionData.channel,
          ipAddress: transactionData.ip_address,
          paidAt: transactionData.paid_at,
          via: 'webhook'
        };
        
        await order.save();
        console.log(`✅ Order ${order._id} confirmed via webhook.`);

        // 6. CRITICAL: Clear the user's cart after successful payment
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

        // 7. TRIGGER POST-PAYMENT ACTIONS HERE
        console.log(`📧 [PRODUCTION] Would send email for order ${order._id}`);
        console.log(`📦 [PRODUCTION] Would update inventory for order ${order._id}`);
        
      } else {
        console.log(`ℹ️ Order ${order._id} already confirmed. Webhook duplicate.`);
      }

      res.sendStatus(200);
      
    } catch (error) {
      console.error('❌ Webhook processing error:', error);
      res.sendStatus(500);
    }
  } else if (event.event === 'charge.failed') {
    console.log(`❌ Payment failed for reference: ${event.data.reference}`);
    
    const order = await Order.findOne({ paymentId: event.data.reference });
    if (order) {
      order.paymentStatus = 'failed';
      order.orderUpdateDate = new Date();
      await order.save();
      console.log(`Updated order ${order._id} to failed status`);
    }
    
    res.sendStatus(200);
  } else {
    console.log(`ℹ️ Received unhandled webhook event: ${event.event}`);
    res.sendStatus(200);
  }
};

module.exports = { handlePaystackWebhook };