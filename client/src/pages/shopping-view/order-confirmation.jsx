
// src/pages/shopping-view/order-confirmation.jsx
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  ShoppingBag,
  Home,
  Package,
  Mail,
  Truck,
  Clock,
  AlertCircle,
  CreditCard,
} from "lucide-react";
import { clearCart } from "@/store/shop/cart-slice";
import { getOrderDetails } from "@/store/shop/order-slice";
import { toast } from "sonner";
import axios from "axios";

// ==================== CONSTANTS ====================

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const PROCESSING_STATES = {
  IDLE: "idle",
  PROCESSING: "processing",
  COMPLETED: "completed",
  ERROR: "error",
};
const CART_STORAGE_KEYS = ["cart_backup", "cartItems", "cartLastUpdated"];
const LAST_ORDER_KEY = "lastOrder";
const ORDER_CACHE_DURATION = 3600000; // 1 hour
const PAYMENT_CONFIRMATION_KEY = "payment_confirmation_processed";

// ==================== ORDER CONFIRMATION COMPONENT ====================

function OrderConfirmation() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { isloading } = useSelector((state) => state.shopOrder);

  const isMountedRef = useRef(true);
  const processingStateRef = useRef(PROCESSING_STATES.IDLE);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processingState, setProcessingState] = useState(PROCESSING_STATES.IDLE);

  // ==================== EFFECT ====================

  useEffect(() => {
    isMountedRef.current = true;

    const handlePaymentConfirmation = async () => {
      try {
        // Idempotency check
        const alreadyProcessed = sessionStorage.getItem(PAYMENT_CONFIRMATION_KEY);
        if (alreadyProcessed === orderId && orderId) {
          console.log("✅ Payment already processed for this order, skipping");
          setProcessingState(PROCESSING_STATES.COMPLETED);
          setLoading(false);
          return;
        }

        setProcessingState(PROCESSING_STATES.PROCESSING);
        processingStateRef.current = PROCESSING_STATES.PROCESSING;

        // ==================== STEP 1: Extract Payment Token ====================

        const tokenFromUrl = searchParams.get("token");
        const paymentSuccess = searchParams.get("payment_success") === "true";

        console.log("📋 Order confirmation - Payment parameters:", {
          orderId,
          hasToken: !!tokenFromUrl,
          paymentSuccess,
          timestamp: new Date().toISOString(),
        });

        // ✅ Use token directly for the order fetch – do NOT store in localStorage
        // and do NOT update Redux auth state.

        // Clean URL (remove token)
        if (tokenFromUrl) {
          try {
            // Remove token from URL to prevent exposure
            if (window.history.replaceState) {
              window.history.replaceState({}, document.title, window.location.pathname);
            }
          } catch (_) {}
        }

        if (!isMountedRef.current) return;

        // ==================== STEP 2: Fetch Order Details ====================

        let fetchedOrder = null;

        if (orderId) {
          try {
            console.log("📥 Fetching order details...");
            // Use axios directly with the token from URL (if present)
            const headers = tokenFromUrl ? { Authorization: `Bearer ${tokenFromUrl}` } : {};
            const response = await axios.get(
              `${API_BASE_URL}/shop/orders/details/${orderId}`,
              { headers }
            );
            if (response.data?.order) {
              fetchedOrder = response.data.order;
              console.log("✅ Order fetched successfully:", orderId);
            } else {
              // Fallback: try Redux thunk (uses interceptor)
              const result = await dispatch(getOrderDetails(orderId));
              if (result.meta.requestStatus === "fulfilled" && result.payload?.order) {
                fetchedOrder = result.payload.order;
              }
            }
          } catch (fetchError) {
            console.error("Order fetch error:", fetchError.message);
            // Fallback to cached order if fetch fails
            const saved = localStorage.getItem(LAST_ORDER_KEY);
            if (saved) {
              try {
                const parsed = JSON.parse(saved);
                if (Date.now() - parsed.timestamp < ORDER_CACHE_DURATION) {
                  fetchedOrder = parsed.order;
                  console.log("✅ Order loaded from cache");
                }
              } catch (_) {}
            }
          }
        }

        if (!isMountedRef.current) return;

        // ==================== STEP 3: Store Order ====================

        if (fetchedOrder) {
          setOrder(fetchedOrder);
          localStorage.setItem(
            LAST_ORDER_KEY,
            JSON.stringify({
              order: fetchedOrder,
              timestamp: Date.now(),
              restored: true,
            })
          );
          sessionStorage.setItem(PAYMENT_CONFIRMATION_KEY, orderId);
          setProcessingState(PROCESSING_STATES.COMPLETED);
          processingStateRef.current = PROCESSING_STATES.COMPLETED;
        } else {
          // If still no order, show error state
          setProcessingState(PROCESSING_STATES.ERROR);
          processingStateRef.current = PROCESSING_STATES.ERROR;
        }

        if (!isMountedRef.current) return;

        // ==================== STEP 4: Clear Cart on Success ====================

        if (paymentSuccess || location.state?.fromPayment) {
          try {
            dispatch(clearCart());
            CART_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
            console.log("🛒 Cart cleared after payment");
          } catch (clearError) {
            console.warn("Warning: Could not clear cart:", clearError.message);
          }
        }
      } catch (error) {
        console.error("Unexpected error during payment confirmation:", error);
        setProcessingState(PROCESSING_STATES.ERROR);
        processingStateRef.current = PROCESSING_STATES.ERROR;
        toast.error("There was an issue processing your order.");
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    };

    if (orderId || searchParams.has("token")) {
      handlePaymentConfirmation();
    } else {
      setLoading(false);
    }

    return () => {
      isMountedRef.current = false;
    };
  }, [orderId, dispatch, location.state, searchParams]);

  // ==================== EVENT HANDLERS ====================

  const handleContinueShopping = () => navigate("/shop/home");
  const handleViewOrders = () => navigate("/shop/account");

  // ==================== LOADING ====================

  if (loading || isloading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto" />
            <div className="absolute inset-0 flex items-center justify-center">
              <CreditCard className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          <div>
            <p className="text-gray-600 font-medium">
              {processingState === PROCESSING_STATES.PROCESSING
                ? "Processing your order..."
                : "Loading your order"}
            </p>
            <p className="text-sm text-gray-500 mt-1">Please wait...</p>
          </div>
        </div>
      </div>
    );
  }

  // ==================== ERROR ====================

  if (processingState === PROCESSING_STATES.ERROR && !order) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2 text-gray-800">
              Payment Processing Error
            </h3>
            <p className="text-gray-600 mb-6">
              There was an error processing your order. Please check your email
              for confirmation, or contact support if you have concerns.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={handleContinueShopping} className="gap-2">
                <Home className="h-4 w-4" />
                Return to Shop
              </Button>
              {isAuthenticated && (
                <Button
                  variant="outline"
                  onClick={handleViewOrders}
                  className="gap-2"
                >
                  <ShoppingBag className="h-4 w-4" />
                  View My Orders
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==================== SUCCESS ====================

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8 bg-white p-8 rounded-xl shadow-sm border border-green-100">
          <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-3 text-gray-800">
            Order Confirmed!
          </h1>
          <p className="text-gray-600 mb-4 max-w-md mx-auto">
            Thank you for your purchase. Your order has been received and is
            being processed.
          </p>

          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg mb-4">
            <Mail className="h-4 w-4" />
            <span className="text-sm">
              {order?.customerEmail || user?.email
                ? `Receipt sent to ${order?.customerEmail || user?.email}`
                : "Check your email for receipt"}
            </span>
          </div>

          {order?._id && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg inline-block max-w-full">
              <p className="text-sm text-gray-500 mb-1">Order Reference</p>
              <p className="font-mono font-bold text-lg text-gray-800 break-all">
                {order._id}
              </p>
            </div>
          )}
        </div>

        {/* Order Details */}
        {order ? (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
              <Package className="h-5 w-5" />
              Order Summary
            </h2>

            <div className="space-y-6">
              {/* Status Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Order Status</p>
                  <p className="font-medium capitalize text-green-700 flex items-center gap-2">
                    {order.orderStatus === "confirmed" && (
                      <CheckCircle className="h-4 w-4" />
                    )}
                    {order.orderStatus === "pending" && (
                      <Clock className="h-4 w-4" />
                    )}
                    {order.orderStatus || "processing"}
                  </p>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Payment Status</p>
                  <p className="font-medium capitalize text-blue-700 flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    {order.paymentStatus || "completed"}
                  </p>
                </div>
              </div>

              {/* Amounts */}
              <div className="border-t pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Items Total</span>
                    <span className="font-medium">
                      GHC {(order.subtotal || order.totalAmount || 0).toFixed(2)}
                    </span>
                  </div>
                  {(order.shippingFee || 0) > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">
                        GHC {order.shippingFee.toFixed(2)}
                      </span>
                    </div>
                  )}
                  {(order.tax || 0) > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-medium">
                        GHC {order.tax.toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-3 border-t font-bold text-lg">
                    <span>Total Amount</span>
                    <span>GHC {(order.totalAmount || 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              {order.addressInfo && (
                <div className="pt-4 border-t">
                  <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                    <Truck className="h-4 w-4" />
                    Shipping Details
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium text-gray-800">
                      {order.addressInfo.address || "Address not specified"}
                    </p>
                    <p className="text-gray-600">
                      {order.addressInfo.city || "City not specified"}
                    </p>
                    {order.addressInfo.phone && (
                      <p className="text-gray-600 mt-1">
                        Phone: {order.addressInfo.phone}
                      </p>
                    )}
                    {order.addressInfo.notes && (
                      <p className="text-sm text-gray-500 mt-2 italic">
                        Note: {order.addressInfo.notes}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Order Items */}
              {order.cartItems?.length > 0 && (
                <div className="pt-4 border-t">
                  <h3 className="text-sm font-medium text-gray-500 mb-3">
                    Order Items ({order.cartItems.length})
                  </h3>
                  <div className="space-y-3">
                    {order.cartItems.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                      >
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="h-12 w-12 object-cover rounded"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-800 truncate">
                            {item.title}
                          </p>
                          <p className="text-sm text-gray-600">
                            GHC {item.price?.toFixed(2) || "0.00"} × {item.quantity || 1}
                          </p>
                        </div>
                        <div className="font-medium text-gray-800 flex-shrink-0">
                          GHC {((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2 text-gray-800">
              Order Not Found
            </h3>
            <p className="text-gray-600 mb-6">
              We couldn't find your order details. Please check your email for
              confirmation.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={handleContinueShopping} className="gap-2">
                <Home className="h-4 w-4" />
                Continue Shopping
              </Button>
              {isAuthenticated && (
                <Button
                  variant="outline"
                  onClick={handleViewOrders}
                  className="gap-2"
                >
                  <ShoppingBag className="h-4 w-4" />
                  View My Orders
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {order && (
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={handleContinueShopping}
              className="flex-1 gap-2 py-6 text-lg bg-blue-600 hover:bg-blue-700 transition-colors"
              size="lg"
            >
              <Home className="h-5 w-5" />
              Continue Shopping
            </Button>
            {isAuthenticated && (
              <Button
                variant="outline"
                onClick={handleViewOrders}
                className="flex-1 gap-2 py-6 text-lg border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors"
                size="lg"
              >
                <ShoppingBag className="h-5 w-5" />
                View My Orders
              </Button>
            )}
          </div>
        )}

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Need help? Contact our support team</p>
          <p className="mt-1">Order confirmation #{orderId || "N/A"}</p>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmation;