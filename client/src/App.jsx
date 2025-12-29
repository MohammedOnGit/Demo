

import React, { useEffect } from 'react';
import { Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import { Skeleton } from "@/components/ui/skeleton";

// Auth components
import AuthLayout from "./components/auth/layout";
import AuthLogin from "./pages/auth/login";
import AuthRegister from "./pages/auth/register";

// Admin components
import AdminLayout from "./components/admin-view/layout";
import AdminDashBoard from "./pages/admin-view/dashboard";
import AdminOrders from "./pages/admin-view/orders";
import AdminFeatures from "./pages/admin-view/features";
import AdminProducts from "./pages/admin-view/products";

// Shopping components
import ShoppingLayout from "./components/shoping-view/layout";
import ShoppingHome from "./pages/shopping-view/home";
import ShopListing from "./pages/shopping-view/listing";
import ShoppingAccount from "./pages/shopping-view/account";
import ShoppingCheckout from "./pages/shopping-view/checkout";
import SearchResults from "./components/shoping-view/search-results";
import SearchPage from "./pages/shopping-view/search-page"; // Add this import
import Wishlist from "./pages/shopping-view/Wishlist";


// Error pages
import NotFound from "./pages/not-found";
import CheckAuth from "./components/common/check-auth";
import UnAuthPage from "./pages/unauth-page";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { checkAuth } from "./store/auth-slice";

function App() {
  const { user, isAuthenticated, isLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Skeleton className="h-full w-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
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
          <Route path="search" element={<SearchPage />} /> {/* Changed from SearchResults to SearchPage */}
          {/* Remove the duplicate route: <Route path="/shop/search" element={<SearchPage />} /> */}
          <Route path="wishlist" element={<Wishlist />} /> 

        </Route>

        {/* ===================== UNAUTHORIZED & 404 ===================== */}
        <Route path="/unauth-page" element={<UnAuthPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;