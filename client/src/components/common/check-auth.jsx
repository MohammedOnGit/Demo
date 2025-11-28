import React from "react";
import { Navigate, useLocation } from "react-router-dom";

function CheckAuth({ isAuthenticated, user, children }) {
  const location = useLocation();

   // 1. Root route `/`
   if (location.pathname === "/") {
    if (!isAuthenticated) {
      return <Navigate to="/auth/login" replace />;
    }
    return user?.role === "admin" ? (
      <Navigate to="/admin/dashboard" replace />   // ✅ Admin → dashboard
    ) : (
      <Navigate to="dashboard" replace />
      // <Navigate to="/shop/home" replace />         // ✅ User → shop
    );
  }

  // 2. Unauthenticated users → block everything except login/register
  if (!isAuthenticated) {
    if (
      !location.pathname.includes("/login") &&
      !location.pathname.includes("/register")
    ) {
      return <Navigate to="/auth/login" replace />;
    }
  }

  // 3. Authenticated users → prevent access to login/register
  if (
    isAuthenticated &&
    (location.pathname.includes("/login") ||
      location.pathname.includes("/register"))
  ) {
    return user?.role === "admin" ? (
      <Navigate to="/admin/dashboard" replace />
    ) : (
      <Navigate to="/shop/home" replace />
    );
  }

  // 4. Non-admin users → block admin routes
  if (
    isAuthenticated &&
    user?.role !== "admin" &&
    location.pathname.includes("/admin")
  ) {
    return <Navigate to="/unauth-page" replace />;
  }

  // 5. Admin users → block shop routes
  if (
    isAuthenticated &&
    user?.role === "admin" &&
    location.pathname.includes("/shop")
  ) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // ✅ Otherwise, allow access
  return <>{children}</>;
}

export default CheckAuth;
