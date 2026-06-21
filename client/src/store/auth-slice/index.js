
// src/store/auth-slice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance, {
  isValidTokenFormat,
  isTokenExpired,
} from "@/utils/axios-interceptor";

// ==================== CONSTANTS ====================

const TOKEN_REFRESH_THRESHOLD = 10 * 60 * 1000; // 10 minutes (reduced from 55 min)
const SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours
const TOKEN_CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes

// ==================== SECURE STORAGE CLASS ====================

class SecureStorage {
  constructor(prefix = "app_") {
    this.prefix = prefix;
  }

  getKey(key) {
    return `${this.prefix}${key}`;
  }

  getItem(key) {
    try {
      const value = localStorage.getItem(this.getKey(key));
      return value;
    } catch (err) {
      console.error(`Error getting ${key} from storage:`, err);
      return null;
    }
  }

  setItem(key, value) {
    try {
      localStorage.setItem(this.getKey(key), value);
      return true;
    } catch (err) {
      console.error(`Error setting ${key} in storage:`, err);
      return false;
    }
  }

  removeItem(key) {
    try {
      localStorage.removeItem(this.getKey(key));
      return true;
    } catch (err) {
      console.error(`Error removing ${key} from storage:`, err);
      return false;
    }
  }

  clear() {
    try {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
      return true;
    } catch (err) {
      console.error("Error clearing storage:", err);
      return false;
    }
  }
}

const secureStorage = new SecureStorage("app_");

// ==================== TOKEN VALIDATION UTILITIES ====================

const getTokenAge = () => {
  try {
    const timestampStr = secureStorage.getItem("auth_timestamp");
    if (!timestampStr) return Infinity;
    const timestamp = parseInt(timestampStr, 10);
    if (isNaN(timestamp)) return Infinity;
    if (timestamp > Date.now()) {
      console.warn("Future timestamp detected - clearing auth");
      secureStorage.clear();
      return Infinity;
    }
    return Date.now() - timestamp;
  } catch (error) {
    console.error("Error calculating token age:", error);
    return Infinity;
  }
};

const shouldVerifyTokenWithBackend = () => {
  const age = getTokenAge();
  return age === Infinity || age > TOKEN_REFRESH_THRESHOLD || age > SESSION_TIMEOUT;
};

const getStoredToken = () => {
  try {
    const token = secureStorage.getItem("token");
    if (!token) return null;
    if (!isValidTokenFormat(token)) {
      console.error("Stored token has invalid format - clearing");
      secureStorage.removeItem("token");
      return null;
    }
    if (isTokenExpired(token)) {
      console.warn("Stored token is expired - clearing");
      secureStorage.removeItem("token");
      secureStorage.removeItem("auth_timestamp");
      return null;
    }
    return token;
  } catch (error) {
    console.error("Error getting stored token:", error);
    return null;
  }
};

const getStoredUser = () => {
  try {
    const userStr = secureStorage.getItem("user");
    if (!userStr) return null;
    const user = JSON.parse(userStr);
    if (!user.id && !user._id) {
      console.warn("Invalid user data structure - clearing");
      secureStorage.removeItem("user");
      return null;
    }
    return user;
  } catch (error) {
    console.error("Error getting stored user:", error);
    return null;
  }
};

// ==================== ASYNC THUNKS ====================

/**
 * ✅ FIXED: Fail‑safe auth check – NEVER clears storage on failure
 */
export const checkAuthStatus = createAsyncThunk(
  "auth/checkAuthStatus",
  async ({ forceRefresh = false } = {}, { rejectWithValue, getState }) => {
    try {
      const storedToken = getStoredToken();
      const storedUser = getStoredUser();

      // If no stored credentials, return unauthenticated (but do NOT clear)
      if (!storedToken || !storedUser) {
        return rejectWithValue({
          message: "No stored credentials",
          code: "NO_TOKEN",
          silent: true,
        });
      }

      // If token is fresh and we don't force refresh, return cached
      if (!forceRefresh && !shouldVerifyTokenWithBackend()) {
        console.log("✅ Token is fresh, using stored credentials");
        return {
          verified: true,
          token: storedToken,
          user: storedUser,
          refreshed: false,
        };
      }

      // Verify with backend
      console.log("📡 Verifying token with backend...");
      const response = await axiosInstance.get("/auth/check-auth", {
        headers: { Authorization: `Bearer ${storedToken}` },
        timeout: 5000,
        validateStatus: (status) => status < 500,
      });

      if (response.status === 200 && response.data?.user) {
        const updatedUser = response.data.user;
        secureStorage.setItem("user", JSON.stringify(updatedUser));
        secureStorage.setItem("auth_timestamp", Date.now().toString());
        console.log("✅ Token verified by backend");
        return {
          verified: true,
          token: storedToken,
          user: updatedUser,
          refreshed: false,
        };
      } else {
        // Token invalid – keep cached data but mark as unverified
        console.warn("Backend verification failed – keeping cached session");
        return {
          verified: false,
          token: storedToken,
          user: storedUser,
          refreshed: false,
          needsRefresh: true,
        };
      }
    } catch (error) {
      // On network error or timeout, keep cached data
      console.warn("Auth check network error – keeping cached session:", error.message);
      return {
        verified: false,
        token: getStoredToken(),
        user: getStoredUser(),
        refreshed: false,
        needsRefresh: true,
      };
    }
  }
);

/**
 * ✅ FIXED: Restore auth from localStorage without any backend call
 */
export const restoreAuthFromStorage = createAsyncThunk(
  "auth/restoreFromStorage",
  async (_, { rejectWithValue }) => {
    try {
      const token = getStoredToken();
      const user = getStoredUser();
      if (token && user) {
        console.log("✅ Auth restored from localStorage");
        return { token, user };
      }
      return rejectWithValue("No stored auth data");
    } catch (error) {
      console.error("Error restoring auth:", error);
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Login, Register, Logout – unchanged
 */
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/auth/login", credentials);
      if (response.data?.token && isValidTokenFormat(response.data.token)) {
        const { token, user } = response.data;
        secureStorage.setItem("token", token);
        secureStorage.setItem("user", JSON.stringify(user));
        secureStorage.setItem("auth_timestamp", Date.now().toString());
        return { token, user };
      }
      throw new Error("Invalid token in login response");
    } catch (error) {
      console.error("Login failed:", error);
      return rejectWithValue(
        error.response?.data?.message || "Login failed. Please try again."
      );
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/auth/register", userData);
      if (response.data?.token && isValidTokenFormat(response.data.token)) {
        const { token, user } = response.data;
        secureStorage.setItem("token", token);
        secureStorage.setItem("user", JSON.stringify(user));
        secureStorage.setItem("auth_timestamp", Date.now().toString());
        return { token, user };
      }
      throw new Error("Invalid token in register response");
    } catch (error) {
      console.error("Registration failed:", error);
      return rejectWithValue(
        error.response?.data?.message || "Registration failed. Please try again."
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.post("/auth/logout");
      return null;
    } catch (error) {
      console.error("Logout error:", error);
      return null;
    } finally {
      secureStorage.clear();
    }
  }
);

// ==================== SELECTORS ====================

export const selectNeedsRefresh = (state) => {
  if (!state.auth.token) return false;
  const age = getTokenAge();
  return age > TOKEN_REFRESH_THRESHOLD;
};

export const selectIsChecking = (state) => state.auth.isCheckingAuth;

export const selectTokenAge = (state) => {
  const age = getTokenAge();
  return age === Infinity ? null : age;
};

// ==================== SLICE ====================

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  isLoading: false,
  isCheckingAuth: false,
  error: null,
  lastAuthCheck: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthTokens: (state, action) => {
      const { token, user } = action.payload;
      if (token && isValidTokenFormat(token) && !isTokenExpired(token)) {
        state.token = token;
        state.user = user;
        state.isAuthenticated = true;
        state.error = null;
        secureStorage.setItem("token", token);
        secureStorage.setItem("user", JSON.stringify(user));
        secureStorage.setItem("auth_timestamp", Date.now().toString());
        console.log("✅ Auth tokens set");
      }
    },

    clearAuth: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;
      secureStorage.clear();
      console.log("🔓 Auth cleared");
    },

    setAuthError: (state, action) => {
      state.error = action.payload;
    },

    clearAuthError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    // Restore from storage
    builder
      .addCase(restoreAuthFromStorage.pending, (state) => {
        state.isCheckingAuth = true;
      })
      .addCase(restoreAuthFromStorage.fulfilled, (state, action) => {
        const { token, user } = action.payload;
        state.token = token;
        state.user = user;
        state.isAuthenticated = true;
        state.isCheckingAuth = false;
        state.error = null;
        console.log("✅ Auth restored from storage");
      })
      .addCase(restoreAuthFromStorage.rejected, (state) => {
        state.isCheckingAuth = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = null;
      });

    // Check auth status
    builder
      .addCase(checkAuthStatus.pending, (state) => {
        state.isCheckingAuth = true;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        const { token, user, verified } = action.payload;
        // Always set authenticated if we have token and user (even if not verified)
        if (token && user) {
          state.token = token;
          state.user = user;
          state.isAuthenticated = true;
          state.error = null;
          state.lastAuthCheck = Date.now();
        }
        state.isCheckingAuth = false;
        state.needsRefresh = action.payload?.needsRefresh || false;
      })
      .addCase(checkAuthStatus.rejected, (state, action) => {
        state.isCheckingAuth = false;
        // Do NOT clear auth – keep existing state
        if (action.payload?.code === "NO_TOKEN") {
          state.isAuthenticated = false;
          state.user = null;
          state.token = null;
          state.error = null;
        } else {
          state.needsRefresh = true;
          state.error = action.payload?.message || "Auth check failed";
        }
        state.lastAuthCheck = Date.now();
      });

    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        const { token, user } = action.payload;
        state.isAuthenticated = true;
        state.user = user;
        state.token = token;
        state.isLoading = false;
        state.error = null;
        state.needsRefresh = false;
        console.log("✅ User logged in");
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
      });

    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        const { token, user } = action.payload;
        state.isAuthenticated = true;
        state.user = user;
        state.token = token;
        state.isLoading = false;
        state.error = null;
        state.needsRefresh = false;
        console.log("✅ User registered");
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
      });

    // Logout
    builder
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = null;
        state.isLoading = false;
        state.needsRefresh = false;
        console.log("✅ User logged out");
      })
      .addCase(logoutUser.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.isLoading = false;
      });
  },
});

export const { setAuthTokens, clearAuth, setAuthError, clearAuthError } =
  authSlice.actions;
export default authSlice.reducer;
