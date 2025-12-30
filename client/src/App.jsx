import React, { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from "react-router-dom"; // Removed BrowserRouter import
import "./App.css";
import { Skeleton } from "@/components/ui/skeleton";

// Import utilities for rate limiting
import { requestManager } from "@/utils/request-manager";
import "@/utils/axios-interceptor";

// Auth components - keep as lazy loaded for performance
const AuthLayout = lazy(() => import("./components/auth/layout"));
const AuthLogin = lazy(() => import("./pages/auth/login"));
const AuthRegister = lazy(() => import("./pages/auth/register"));

// Admin components - keep as lazy loaded
const AdminLayout = lazy(() => import("./components/admin-view/layout"));
const AdminDashBoard = lazy(() => import("./pages/admin-view/dashboard"));
const AdminOrders = lazy(() => import("./pages/admin-view/orders"));
const AdminFeatures = lazy(() => import("./pages/admin-view/features"));
const AdminProducts = lazy(() => import("./pages/admin-view/products"));

// Shopping components - keep as lazy loaded
const ShoppingLayout = lazy(() => import("./components/shoping-view/layout"));
const ShoppingHome = lazy(() => import("./pages/shopping-view/home"));
const ShopListing = lazy(() => import("./pages/shopping-view/listing"));
const ShoppingAccount = lazy(() => import("./pages/shopping-view/account"));
const ShoppingCheckout = lazy(() => import("./pages/shopping-view/checkout"));
const SearchPage = lazy(() => import("./pages/shopping-view/search-page"));
const Wishlist = lazy(() => import("./pages/shopping-view/Wishlist"));

// Error pages
const NotFound = lazy(() => import("./pages/not-found"));
const CheckAuth = lazy(() => import("./components/common/check-auth"));
const UnAuthPage = lazy(() => import("./pages/unauth-page"));

// Redux
import { useSelector, useDispatch } from "react-redux"; // Removed Provider import
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

function App() {
  const { user, isAuthenticated, isLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    // Initialize cache management for rate limiting
    const clearOldCache = () => {
      requestManager.clearCache();
    };
    
    // Clear cache every 30 minutes to prevent memory issues
    const cacheInterval = setInterval(clearOldCache, 1800000);
    
    // Check auth on mount
    dispatch(checkAuth());
    
    return () => {
      clearInterval(cacheInterval);
      requestManager.clearCache(); // Clear cache on unmount
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
          </Route>

          {/* ===================== UNAUTHORIZED & 404 ===================== */}
          <Route path="/unauth-page" element={<UnAuthPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;