
// src/utils/axios-interceptor.js
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ==================== TOKEN VALIDATION UTILITIES ====================

const isValidTokenFormat = (token) => {
  if (typeof token !== "string" || !token.trim()) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const base64urlRegex = /^[\w\-]+$/;
  return parts.every((part) => base64urlRegex.test(part));
};

const isTokenExpired = (token) => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return true;
    const payload = parts[1];
    const padded = payload + "=".repeat((4 - (payload.length % 4)) % 4);
    const decoded = JSON.parse(atob(padded));
    if (!decoded.exp) return false;
    return decoded.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
};

const getTokenFromUrl = () => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    if (!token) return null;
    if (!isValidTokenFormat(token)) {
      console.error("Invalid token format in URL - rejecting");
      if (window.history.replaceState) {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
      return null;
    }
    if (token.length > 4096) {
      console.error("Token suspiciously large - likely DoS attempt");
      if (window.history.replaceState) {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
      return null;
    }
    if (isTokenExpired(token)) {
      console.warn("Token from URL is already expired - rejecting");
      if (window.history.replaceState) {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
      return null;
    }
    if (window.history.replaceState) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    return token;
  } catch (error) {
    console.error("Error extracting token from URL:", error);
    return null;
  }
};

const getStoredToken = () => {
  try {
    const token = localStorage.getItem("app_token");
    if (!token) return null;
    if (!isValidTokenFormat(token)) {
      localStorage.removeItem("app_token");
      return null;
    }
    if (isTokenExpired(token)) {
      localStorage.removeItem("app_token");
      return null;
    }
    return token;
  } catch {
    return null;
  }
};

/**
 * ✅ CRITICAL FIX: Protect order-confirmation pages from token clearing
 * These pages handle their own session restoration via URL token.
 */
const isProtectedFromAuthRedirect = () => {
  const pathname = window.location.pathname;
  return (
    pathname.startsWith("/auth/") ||
    pathname.startsWith("/shop/order-confirmation") ||
    pathname.startsWith("/order-confirmation")
  );
};

// ==================== AXIOS INSTANCE ====================

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// ==================== REQUEST INTERCEPTOR ====================

axiosInstance.interceptors.request.use(
  (config) => {
    let token = getStoredToken();

    if (!token) {
      const urlToken = getTokenFromUrl();
      if (urlToken) {
        token = urlToken;
        // Store token immediately so subsequent requests can use it
        localStorage.setItem("app_token", token);
        localStorage.setItem("app_auth_timestamp", Date.now().toString());
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const csrfToken = document
      .querySelector('meta[name="csrf-token"]')
      ?.getAttribute("content");
    if (csrfToken) {
      config.headers["X-CSRF-Token"] = csrfToken;
    }

    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// ==================== RESPONSE INTERCEPTOR ====================

axiosInstance.interceptors.response.use(
  (response) => {
    if (response.data?.token && isValidTokenFormat(response.data.token)) {
      if (!isTokenExpired(response.data.token)) {
        localStorage.setItem("app_token", response.data.token);
        localStorage.setItem("app_auth_timestamp", Date.now().toString());
        axiosInstance.defaults.headers.common["Authorization"] =
          `Bearer ${response.data.token}`;
      }
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const isProtected = isProtectedFromAuthRedirect();

        console.log("Protected page check:", isProtected, window.location.pathname);


    // If we're on a protected page and get a 401/403, do NOT clear tokens
    // and do NOT attempt refresh – let the page handle the error.
    if ((error.response?.status === 401 || error.response?.status === 403) && isProtected) {
      console.warn("Protected page – skipping token refresh and clearing");
      return Promise.reject(error);
    }

    // For non‑protected pages, handle token refresh
    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        console.warn(`Auth error (${error.response.status}): Attempting token refresh...`);
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/auth/refresh-token`,
          {},
          { withCredentials: true, timeout: 5000 }
        );

        if (
          refreshResponse.data?.token &&
          isValidTokenFormat(refreshResponse.data.token) &&
          !isTokenExpired(refreshResponse.data.token)
        ) {
          localStorage.setItem("app_token", refreshResponse.data.token);
          localStorage.setItem("app_auth_timestamp", Date.now().toString());
          axiosInstance.defaults.headers.common["Authorization"] =
            `Bearer ${refreshResponse.data.token}`;
          originalRequest.headers.Authorization =
            `Bearer ${refreshResponse.data.token}`;
          return axiosInstance(originalRequest);
        } else {
          throw new Error("Invalid token from refresh");
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError.message);
        // Clear only if NOT protected
        if (!isProtected) {
          localStorage.removeItem("app_token");
          localStorage.removeItem("app_user");
          localStorage.removeItem("app_auth_timestamp");
          setTimeout(() => {
            window.location.href = "/auth/login";
          }, 100);
        }
        return Promise.reject(refreshError);
      }
    } else if (error.response?.status === 401 || error.response?.status === 403) {
      // Already retried once – clear only if NOT protected
      if (!isProtected) {
        localStorage.removeItem("app_token");
        localStorage.removeItem("app_user");
        localStorage.removeItem("app_auth_timestamp");
        setTimeout(() => {
          window.location.href = "/auth/login";
        }, 100);
      }
    }

    // Handle other errors
    if (!error.response) {
      console.error("Network Error: No response from server");
      return Promise.reject({
        message: "Network error. Please check your connection.",
        isNetworkError: true,
        status: 0,
      });
    }

    const { status, data } = error.response;
    switch (status) {
      case 404:
        console.error("Not Found (404):", data?.message || "Resource not found");
        break;
      case 422:
        console.error("Validation Error (422):", data?.errors || data?.message);
        break;
      case 429:
        console.error("Rate Limited (429): Too many requests");
        return Promise.reject({
          status: 429,
          message: "Too many requests. Please wait a moment.",
          retryAfter: parseInt(error.response.headers["retry-after"] || "60"),
          isRateLimit: true,
        });
      case 500:
      case 502:
      case 503:
      case 504:
        console.error(`Server Error (${status}): Please try again later`);
        return Promise.reject({
          status: status,
          message: "Server is temporarily unavailable. Please try again later.",
          isServerError: true,
        });
      default:
        console.error(`Request failed (${status}):`, error.message);
    }

    return Promise.reject({
      status: status,
      message: data?.message || error.message || "Request failed",
      errors: data?.errors,
      data: data,
      isAxiosError: true,
    });
  }
);

// ==================== RETRY LOGIC ====================

const MAX_RETRIES = 2;
const BASE_RETRY_DELAY = 1000;

axiosInstance.interceptors.response.use(
  (response) => response,
  async (err) => {
    const config = err.config;
    if (!config || config._retryCount >= MAX_RETRIES) {
      return Promise.reject(err);
    }
    const shouldRetry =
      !err.response ||
      (err.response.status >= 500 && err.response.status < 600) ||
      err.code === "ECONNABORTED" ||
      err.code === "ENOTFOUND" ||
      err.code === "ECONNREFUSED" ||
      err.code === "ETIMEDOUT";
    if (!shouldRetry) {
      return Promise.reject(err);
    }
    config._retryCount = (config._retryCount || 0) + 1;
    const delay = BASE_RETRY_DELAY * Math.pow(2, config._retryCount - 1);
    await new Promise((resolve) => setTimeout(resolve, delay));
    return axiosInstance(config);
  }
);

export default axiosInstance;
export { isValidTokenFormat, isTokenExpired };