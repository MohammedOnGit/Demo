// Import core routing components
import { Route, Routes, Navigate } from "react-router-dom";

// Import global CSS styles
import "./App.css";

// 🔹 Auth section components
import AuthLayout from "./components/auth/layout";
import AuthLogin from "./pages/auth/login";
import AuthRegister from "./pages/auth/register";

// 🔹 Admin section components
import AdminLayout from "./components/admin-view/layout";
import AdminDashBoard from "./pages/admin-view/dashboard";
import AdminOrders from "./pages/admin-view/orders";
import AdminFeatures from "./pages/admin-view/features";
import AdminProducts from "./pages/admin-view/products";

// 🔹 Shopping section components
import ShoppingLayout from "./components/shoping-view/layout";
import ShoppingHome from "./pages/shopping-view/home";
import ShopListing from "./pages/shopping-view/listing";
import ShoppingAccount from "./pages/shopping-view/account";
import ShoppingCheckout from "./pages/shopping-view/checkout";

// 🔹 Error / Not Found page
import NotFound from "./pages/not-found";
import CheckAuth from "./components/common/check-auth";
import UnAuthPage from "./pages/unauth-page";

// Redux
import { useSelector, useDispatch } from "react-redux"; // ✅ FIXED
import { useEffect } from "react";

// Action
import { checkAuth } from "./store/auth-slice"; 

function App() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch(); // ✅ FIXED

  useEffect(() => {
    dispatch(checkAuth()); // ✅ run checkAuth when app loads
  }, [dispatch]);

  return (
    <div>
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
          {/* redirect to admin dashboard by default */}
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
        </Route>

        {/* ===================== UNAUTHORIZED & 404 ===================== */}
        <Route path="/unauth-page" element={<UnAuthPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
