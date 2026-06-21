// src/App.jsx
import { useEffect, lazy, Suspense, useState, useRef } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import "./App.css";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { XCircle, ShieldCheck, Loader2 } from "lucide-react";

// Import utilities for rate limiting
import { requestManager } from "@/utils/request-manager";
import "@/utils/axios-interceptor";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { checkAuthStatus, restoreAuthFromStorage, selectTokenAge } from "@/store/auth-slice";

// Constants
const CACHE_CLEANUP_INTERVAL = 1800000; // 30 minutes
const SESSION_RESTORE_MIN_DURATION = 1000; // Minimum time to show loading screen
const AUTH_CHECK_THRESHOLD = 10 * 60 * 1000; // 10 minutes – only check if token older

// Lazy load components for better performance
const AuthLayout = lazy(() => import("./components/auth/layout"));
const AuthLogin = lazy(() => import("./pages/auth/login"));
const AuthRegister = lazy(() => import("./pages/auth/register"));

const AdminLayout = lazy(() => import("./components/admin-view/layout"));
const AdminDashBoard = lazy(() => import("./pages/admin-view/dashboard"));
const AdminOrders = lazy(() => import("./pages/admin-view/orders"));
const AdminFeatures = lazy(() => import("./pages/admin-view/features"));
const AdminProducts = lazy(() => import("./pages/admin-view/products"));

const ShoppingLayout = lazy(() => import("./components/shoping-view/layout"));
const ShoppingHome = lazy(() => import("./pages/shopping-view/home"));
const ShopListing = lazy(() => import("./pages/shopping-view/listing"));
const ShoppingAccount = lazy(() => import("./pages/shopping-view/account"));
const ShoppingCheckout = lazy(() => import("./pages/shopping-view/checkout"));
const SearchPage = lazy(() => import("./pages/shopping-view/search-page"));
const Wishlist = lazy(() => import("./pages/shopping-view/Wishlist"));
const OrderConfirmation = lazy(() => import("./pages/shopping-view/order-confirmation"));
const PaystackReturn = lazy(() => import("./pages/shopping-view/paystack-return"));

const NotFound = lazy(() => import("./pages/not-found"));
const CheckAuth = lazy(() => import("./components/common/check-auth"));
const UnAuthPage = lazy(() => import("./pages/unauth-page"));

// ==================== LOADING FALLBACK COMPONENT ====================
const LoadingFallback = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-background">
    <div className="space-y-4">
      <Skeleton className="h-12 w-12 rounded-full mx-auto" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  </div>
);

// ==================== SESSION RESTORING COMPONENT ====================
const SessionRestoring = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-b from-blue-50 to-white p-4">
    <div className="max-w-md w-full text-center space-y-6">
      <div className="relative">
        <div className="h-24 w-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldCheck className="h-12 w-12 text-blue-600" />
        </div>
        <div className="absolute -bottom-2 -right-2">
          <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
        </div>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-gray-800">
          Restoring Your Session
        </h1>
        <p className="text-gray-600">
          Please wait while we restore your shopping session...
        </p>
      </div>

      <div className="space-y-2">
        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 animate-pulse w-3/4" />
        </div>
        <p className="text-xs text-gray-500">
          This usually takes just a moment
        </p>
      </div>

      <div className="pt-4 border-t">
        <p className="text-sm text-gray-500">
          Your cart items and preferences are being restored
        </p>
      </div>
    </div>
  </div>
);

// ==================== PAYPAL CANCEL COMPONENT ====================
const PayPalCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center p-8">
        <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Payment Cancelled</h1>
        <p className="text-gray-600 mb-6">
          Your payment was cancelled. No charges were made.
        </p>
        <div className="space-y-3">
          <Button onClick={() => navigate("/shop/checkout")}>
            Return to Checkout
          </Button>
          <Button variant="outline" onClick={() => navigate("/shop/home")}>
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
};

// ==================== ADMIN REDIRECT COMPONENT ====================
const AdminRedirect = ({ user }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === "admin") {
      navigate("/admin/dashboard", { replace: true });
    } else {
      navigate("/unauth-page", { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Redirecting to admin dashboard...</p>
      </div>
    </div>
  );
};

// ==================== MAIN APP COMPONENT ====================
function App() {
  const { user, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();

  const isMountedRef = useRef(true);
  const [isSessionRestored, setIsSessionRestored] = useState(false);
  const [showSessionRestoring, setShowSessionRestoring] = useState(true);

  useEffect(() => {
    isMountedRef.current = true;

    const restoreSession = async () => {
      try {
        // 1. Synchronously restore from localStorage
        dispatch(restoreAuthFromStorage());
        if (!isMountedRef.current) return;
        setIsSessionRestored(true);

        // 2. Check token age and decide whether to verify with backend
        const tokenAge = localStorage.getItem("app_auth_timestamp")
          ? Date.now() - parseInt(localStorage.getItem("app_auth_timestamp"), 10)
          : null;

        // Only call checkAuthStatus if token is older than threshold
        if (tokenAge !== null && tokenAge > AUTH_CHECK_THRESHOLD) {
          console.log(`🔄 Token age ${Math.round(tokenAge/60000)}min – verifying with backend`);
          try {
            await dispatch(checkAuthStatus({ forceRefresh: false })).unwrap();
          } catch (_) {
            // Ignore – we keep cached session
          }
        } else {
          console.log("✅ Token is fresh – skipping backend verification");
        }
      } catch (error) {
        console.error("Unexpected error during session restore:", error);
        // Still allow app to load
      } finally {
        // Hide loading screen after minimum duration
        setTimeout(() => {
          if (isMountedRef.current) {
            setShowSessionRestoring(false);
          }
        }, SESSION_RESTORE_MIN_DURATION);
      }
    };

    restoreSession();

    // Cache cleanup interval
    const cacheInterval = setInterval(() => {
      requestManager.clearCache();
    }, CACHE_CLEANUP_INTERVAL);

    return () => {
      isMountedRef.current = false;
      clearInterval(cacheInterval);
      requestManager.clearCache();
    };
  }, [dispatch]);

  if (showSessionRestoring) {
    return <SessionRestoring />;
  }

  if (isLoading && !isSessionRestored) {
    return <LoadingFallback />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Navigate to="/shop/home" replace />} />

          <Route
            path="/auth"
            element={
              <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                <AuthLayout />
              </CheckAuth>
            }
          >
            <Route index element={<Navigate to="login" />} />
            <Route path="login" element={<AuthLogin />} />
            <Route path="register" element={<AuthRegister />} />
          </Route>

          <Route
            path="/admin"
            element={
              <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                <AdminLayout />
              </CheckAuth>
            }
          >
            <Route
              index
              element={
                user?.role === "admin"
                  ? <Navigate to="dashboard" replace />
                  : <Navigate to="/unauth-page" replace />
              }
            />
            <Route path="dashboard" element={<AdminDashBoard />} />
            <Route path="features" element={<AdminFeatures />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="products" element={<AdminProducts />} />
          </Route>

          <Route
            path="/shop"
            element={
              <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                <ShoppingLayout />
              </CheckAuth>
            }
          >
            <Route index element={<Navigate to="home" />} />
            <Route path="home" element={<ShoppingHome />} />
            <Route path="listing" element={<ShopListing />} />
            <Route path="checkout" element={<ShoppingCheckout />} />
            <Route path="account" element={<ShoppingAccount />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="order-confirmation" element={<OrderConfirmation />} />
            <Route
              path="order-confirmation/:orderId"
              element={<OrderConfirmation />}
            />
          </Route>

          <Route path="/shop/paystack-return" element={<PaystackReturn />} />
          <Route path="/shop/paypal-cancel" element={<PayPalCancel />} />

          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route
            path="/order-confirmation/:orderId"
            element={<OrderConfirmation />}
          />

          <Route
            path="/shop/login"
            element={<Navigate to="/auth/login" replace />}
          />
          <Route
            path="/shop/register"
            element={<Navigate to="/auth/register" replace />}
          />

          <Route
            path="/admin/dashboard"
            element={
              isAuthenticated && user?.role === "admin" ? (
                <Navigate to="/admin/dashboard" replace />
              ) : (
                <Navigate to="/auth/login" replace />
              )
            }
          />

          <Route path="/unauth-page" element={<UnAuthPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;