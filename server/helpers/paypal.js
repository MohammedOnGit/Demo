// // helpers/paypal.js - COMPLETE FILE
// const paypal = require('@paypal/checkout-server-sdk');
// require('dotenv').config();

// console.log('PayPal Environment Check:'); // DEBUG
// console.log('PAYPAL_CLIENT_ID:', process.env.PAYPAL_CLIENT_ID ? '✓ Found' : '✗ Missing');
// console.log('PAYPAL_CLIENT_SECRET:', process.env.PAYPAL_CLIENT_SECRET ? '✓ Found (hidden)' : '✗ Missing');
// console.log('NODE_ENV:', process.env.NODE_ENV || 'development');

// class PayPalHelper {
//   constructor() {
//     try {
//       this.environment = this.configureEnvironment();
//       this.client = new paypal.core.PayPalHttpClient(this.environment);
//       console.log('✅ PayPal helper initialized successfully');
//     } catch (error) {
//       console.error('❌ PayPal helper initialization failed:', error.message);
//       throw error;
//     }
//   }

//   configureEnvironment() {
//     const clientId = process.env.PAYPAL_CLIENT_ID;
//     const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
    
//     console.log('Configuring PayPal environment...'); // DEBUG
//     console.log('Client ID length:', clientId ? clientId.length : 0);
//     console.log('Client Secret length:', clientSecret ? clientSecret.length : 0);
    
//     if (!clientId || !clientSecret) {
//       console.error('Missing PayPal credentials:');
//       console.error('- PAYPAL_CLIENT_ID:', clientId || 'NOT SET');
//       console.error('- PAYPAL_CLIENT_SECRET:', clientSecret ? 'SET (hidden)' : 'NOT SET');
//       throw new Error('PayPal credentials not found in environment variables');
//     }

//     // Use sandbox for development, production for live
//     const environment = process.env.NODE_ENV === 'production' ? 'production' : 'sandbox';
//     console.log('Using PayPal', environment, 'environment');
    
//     if (process.env.NODE_ENV === 'production') {
//       return new paypal.core.LiveEnvironment(clientId, clientSecret);
//     }
//     return new paypal.core.SandboxEnvironment(clientId, clientSecret);
//   }

//   /**
//    * Create a PayPal order
//    * @param {Object} orderData - Order information
//    * @returns {Promise<Object>} PayPal order response
//    */
//   async createOrder(orderData) {
//     try {
//       const {
//         orderId,      // Your database order ID
//         totalAmount,
//         cartItems,
//         addressInfo,
//         returnUrl,
//         cancelUrl
//       } = orderData;

//       console.log('Creating PayPal order for:', orderId);
//       console.log('Total amount:', totalAmount);

//       const request = new paypal.orders.OrdersCreateRequest();
//       request.prefer("return=representation");
      
//       request.requestBody({
//         intent: 'CAPTURE',
//         purchase_units: [{
//           reference_id: orderId.toString(),
//           description: `Order #${orderId}`,
//           custom_id: orderId.toString(),
//           amount: {
//             currency_code: 'USD',
//             value: totalAmount.toFixed(2),
//             breakdown: {
//               item_total: {
//                 currency_code: 'USD',
//                 value: totalAmount.toFixed(2)
//               }
//             }
//           },
//           items: cartItems.map(item => ({
//             name: item.title?.substring(0, 127) || 'Product',
//             sku: item.productId?.substring(0, 127) || 'SKU001',
//             unit_amount: {
//               currency_code: 'USD',
//               value: (item.salePrice || item.price || 0).toFixed(2)
//             },
//             quantity: item.quantity.toString(),
//             category: 'PHYSICAL_GOODS'
//           }))
//         }],
//         application_context: {
//           brand_name: process.env.STORE_NAME || 'Your Store',
//           landing_page: 'BILLING',
//           user_action: 'PAY_NOW',
//           return_url: returnUrl,
//           cancel_url: cancelUrl
//         }
//       });

//       console.log('Sending request to PayPal...');
//       const response = await this.client.execute(request);
//       console.log('PayPal order created:', response.result.id);
      
//       return {
//         success: true,
//         paypalOrderId: response.result.id,
//         approvalUrl: response.result.links.find(link => link.rel === 'approve').href,
//         details: response.result
//       };
      
//     } catch (error) {
//       console.error('PayPal Create Order Error:', error);
//       return {
//         success: false,
//         error: error.message,
//         details: error
//       };
//     }
//   }

//   /**
//    * Capture a PayPal payment
//    * @param {String} paypalOrderId - PayPal order ID
//    * @returns {Promise<Object>} Capture response
//    */
//   async capturePayment(paypalOrderId) {
//     try {
//       console.log('Capturing PayPal payment:', paypalOrderId);
      
//       const request = new paypal.orders.OrdersCaptureRequest(paypalOrderId);
//       request.requestBody({});

//       const response = await this.client.execute(request);
//       console.log('Payment captured:', response.result.status);
      
//       return {
//         success: true,
//         captureId: response.result.purchase_units[0].payments.captures[0].id,
//         status: response.result.status,
//         payer: response.result.payer,
//         details: response.result
//       };
      
//     } catch (error) {
//       console.error('PayPal Capture Error:', error);
//       return {
//         success: false,
//         error: error.message,
//         statusCode: error.statusCode
//       };
//     }
//   }

//   /**
//    * Get PayPal order details
//    * @param {String} paypalOrderId - PayPal order ID
//    * @returns {Promise<Object>} Order details
//    */
//   async getOrderDetails(paypalOrderId) {
//     try {
//       const request = new paypal.orders.OrdersGetRequest(paypalOrderId);
//       const response = await this.client.execute(request);
//       return {
//         success: true,
//         order: response.result
//       };
//     } catch (error) {
//       return {
//         success: false,
//         error: error.message
//       };
//     }
//   }

//   /**
//    * Generate return URLs for PayPal
//    * @param {String} orderId - Your database order ID
//    * @returns {Object} returnUrl and cancelUrl
//    */
//   generateReturnUrls(orderId) {
//     const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
//     const urls = {
//       returnUrl: `${baseUrl}/shop/paypal-return?orderId=${orderId}`,
//       cancelUrl: `${baseUrl}/shop/paypal-cancel?orderId=${orderId}`
//     };
    
//     console.log('Generated PayPal URLs:', urls);
//     return urls;
//   }
// }

// // Create and export a singleton instance
// const paypalHelper = new PayPalHelper();
// module.exports = paypalHelper;

// helpers/paypal.js
const paypal = require('@paypal/checkout-server-sdk');
require('dotenv').config();

console.log('PayPal Environment Check:');
console.log('PAYPAL_CLIENT_ID:', process.env.PAYPAL_CLIENT_ID ? '✓ Found' : '✗ Missing');
console.log('PAYPAL_CLIENT_SECRET:', process.env.PAYPAL_CLIENT_SECRET ? '✓ Found (hidden)' : '✗ Missing');
console.log('NODE_ENV:', process.env.NODE_ENV || 'development');

class PayPalHelper {
  constructor() {
    try {
      this.environment = this.configureEnvironment();
      this.client = new paypal.core.PayPalHttpClient(this.environment);
      console.log('✅ PayPal helper initialized successfully');
    } catch (error) {
      console.error('❌ PayPal helper initialization failed:', error.message);
      throw error;
    }
  }

  configureEnvironment() {
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
    
    console.log('Configuring PayPal environment...');
    console.log('Client ID length:', clientId ? clientId.length : 0);
    console.log('Client Secret length:', clientSecret ? clientSecret.length : 0);
    
    if (!clientId || !clientSecret) {
      console.error('Missing PayPal credentials:');
      console.error('- PAYPAL_CLIENT_ID:', clientId || 'NOT SET');
      console.error('- PAYPAL_CLIENT_SECRET:', clientSecret ? 'SET (hidden)' : 'NOT SET');
      throw new Error('PayPal credentials not found in environment variables');
    }

    const environment = process.env.NODE_ENV === 'production' ? 'production' : 'sandbox';
    console.log('Using PayPal', environment, 'environment');
    
    if (process.env.NODE_ENV === 'production') {
      return new paypal.core.LiveEnvironment(clientId, clientSecret);
    }
    return new paypal.core.SandboxEnvironment(clientId, clientSecret);
  }

  async createOrder(orderData) {
    try {
      const {
        orderId,
        totalAmount,
        cartItems,
        addressInfo,
        returnUrl,
        cancelUrl
      } = orderData;

      console.log('Creating PayPal order for:', orderId);
      console.log('Total amount:', totalAmount);

      const request = new paypal.orders.OrdersCreateRequest();
      request.prefer("return=representation");
      
      request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [{
          reference_id: orderId.toString(),
          description: `Order #${orderId}`,
          custom_id: orderId.toString(),
          amount: {
            currency_code: 'USD',
            value: totalAmount.toFixed(2),
            breakdown: {
              item_total: {
                currency_code: 'USD',
                value: totalAmount.toFixed(2)
              }
            }
          },
          items: cartItems.map(item => ({
            name: item.title?.substring(0, 127) || 'Product',
            sku: item.productId?.substring(0, 127) || 'SKU001',
            unit_amount: {
              currency_code: 'USD',
              value: (item.salePrice || item.price || 0).toFixed(2)
            },
            quantity: item.quantity.toString(),
            category: 'PHYSICAL_GOODS'
          }))
        }],
        application_context: {
          brand_name: process.env.STORE_NAME || 'Your Store',
          landing_page: 'BILLING',
          user_action: 'PAY_NOW',
          return_url: returnUrl,
          cancel_url: cancelUrl
        }
      });

      console.log('Sending request to PayPal...');
      const response = await this.client.execute(request);
      console.log('PayPal order created:', response.result.id);
      
      return {
        success: true,
        paypalOrderId: response.result.id,
        approvalUrl: response.result.links.find(link => link.rel === 'approve').href,
        details: response.result
      };
      
    } catch (error) {
      console.error('PayPal Create Order Error:', error);
      return {
        success: false,
        error: error.message,
        details: error
      };
    }
  }

  async capturePayment(paypalOrderId) {
    try {
      console.log('Capturing PayPal payment:', paypalOrderId);
      
      const request = new paypal.orders.OrdersCaptureRequest(paypalOrderId);
      request.requestBody({});

      const response = await this.client.execute(request);
      console.log('Payment captured:', response.result.status);
      
      return {
        success: true,
        captureId: response.result.purchase_units[0].payments.captures[0].id,
        status: response.result.status,
        payer: response.result.payer,
        details: response.result
      };
      
    } catch (error) {
      console.error('PayPal Capture Error:', error);
      return {
        success: false,
        error: error.message,
        statusCode: error.statusCode
      };
    }
  }

  generateReturnUrls(orderId) {
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const urls = {
      returnUrl: `${baseUrl}/shop/paypal-return?orderId=${orderId}`,
      cancelUrl: `${baseUrl}/shop/paypal-cancel?orderId=${orderId}`
    };
    
    console.log('Generated PayPal URLs:', urls);
    return urls;
  }
}

const paypalHelper = new PayPalHelper();
module.exports = paypalHelper;