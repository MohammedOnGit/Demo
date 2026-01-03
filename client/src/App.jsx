// App.jsx - COMPLETE VERSION
import React, { useEffect, lazy, Suspense } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import "./App.css";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

// Import utilities for rate limiting
import { requestManager } from "@/utils/request-manager";
import "@/utils/axios-interceptor";

// Auth components
const AuthLayout = lazy(() => import("./components/auth/layout"));
const AuthLogin = lazy(() => import("./pages/auth/login"));
const AuthRegister = lazy(() => import("./pages/auth/register"));

// Admin components
const AdminLayout = lazy(() => import("./components/admin-view/layout"));
const AdminDashBoard = lazy(() => import("./pages/admin-view/dashboard"));
const AdminOrders = lazy(() => import("./pages/admin-view/orders"));
const AdminFeatures = lazy(() => import("./pages/admin-view/features"));
const AdminProducts = lazy(() => import("./pages/admin-view/products"));

// Shopping components
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

// Redux
import { useSelector, useDispatch } from "react-redux";
import { checkAuth } from "./store/auth-slice";

// Loading fallback component
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

// PayPal Cancel Component
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
          <Button variant="outline" onClick={() => navigate("/shop")}>
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
};

function App() {
  const { user, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();

  useEffect(() => {
    const clearOldCache = () => {
      requestManager.clearCache();
    };

    const cacheInterval = setInterval(clearOldCache, 1800000);

    dispatch(checkAuth());

    return () => {
      clearInterval(cacheInterval);
      requestManager.clearCache();
    };
  }, [dispatch]);

  if (isLoading) {
    return <LoadingFallback />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* ===================== AUTH ROUTES ===================== */}
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

          {/* ===================== ADMIN ROUTES ===================== */}
          <Route
            path="/admin"
            element={
              <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                <AdminLayout />
              </CheckAuth>
            }
          >
            <Route index element={<Navigate to="dashboard" />} />
            <Route path="dashboard" element={<AdminDashBoard />} />
            <Route path="features" element={<AdminFeatures />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="products" element={<AdminProducts />} />
          </Route>

          {/* ===================== SHOPPING ROUTES ===================== */}
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
            {/* Add OrderConfirmation as nested route for consistency */}
            <Route path="order-confirmation" element={<OrderConfirmation />} />
            <Route path="order-confirmation/:orderId" element={<OrderConfirmation />} />
          </Route>

          {/* ===================== PAYMENT ROUTES ===================== */}
          <Route path="/shop/paystack-return" element={<PaystackReturn />} />
          <Route path="/shop/paypal-cancel" element={<PayPalCancel />} />
          
          {/* ===================== STANDALONE ORDER CONFIRMATION ROUTES ===================== */}
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />

          {/* ===================== REDIRECTS FOR OLD LOGIN PATHS ===================== */}
          <Route
            path="/shop/login"
            element={<Navigate to="/auth/login" replace />}
          />
          <Route
            path="/shop/register"
            element={<Navigate to="/auth/register" replace />}
          />

          {/* ===================== UNAUTHORIZED & 404 ===================== */}
          <Route path="/unauth-page" element={<UnAuthPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;