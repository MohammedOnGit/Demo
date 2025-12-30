import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Create a separate module-level Set for tracking pending requests
// This is NOT stored in Redux state
const pendingRequests = new Set();

const initialState = {
  items: [],
  isLoading: false,
  error: null,
  wishlistCount: 0,
  lastUpdated: null
};

// Helper to check if request is pending (not stored in Redux)
function isRequestPending(key) {
  return pendingRequests.has(key);
}

// Helper to mark request as pending (not stored in Redux)
function markRequestPending(key) {
  pendingRequests.add(key);
}

// Helper to mark request as completed (not stored in Redux)
function markRequestCompleted(key) {
  pendingRequests.delete(key);
}

// Fetch user's wishlist
export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, { rejectWithValue, getState }) => {
    const requestKey = 'fetch-wishlist';
    
    // Check if request is already pending
    if (isRequestPending(requestKey)) {
      return rejectWithValue("Request already in progress");
    }
    
    try {
      markRequestPending(requestKey);
      
      const response = await axios.get(`${API_BASE_URL}/shop/wishlist`, {
        withCredentials: true,
        timeout: 10000 // Add timeout to prevent hanging requests
      });
      
      if (response.data.success) {
        return response.data.data;
      } else {
        return rejectWithValue(response.data.message || "Failed to fetch wishlist");
      }
    } catch (error) {
      // Handle 429 rate limiting specifically
      if (error.response?.status === 429) {
        return rejectWithValue("Rate limited. Please try again in a moment.");
      }
      return rejectWithValue(error.response?.data?.message || "Failed to fetch wishlist");
    } finally {
      // Always mark as completed, even on error
      setTimeout(() => markRequestCompleted(requestKey), 1000);
    }
  }
);

// Add item to wishlist
export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async (productId, { rejectWithValue, getState }) => {
    const requestKey = `add-wishlist-${productId}`;
    
    // Check if request is already pending
    if (isRequestPending(requestKey)) {
      return rejectWithValue("Request already in progress");
    }
    
    try {
      markRequestPending(requestKey);
      
      const response = await axios.post(
        `${API_BASE_URL}/shop/wishlist/add`,
        { productId },
        { 
          withCredentials: true,
          timeout: 8000
        }
      );
      
      if (response.data.success) {
        return response.data.data;
      } else {
        return rejectWithValue(response.data.message || "Failed to add to wishlist");
      }
    } catch (error) {
      // Handle 429 rate limiting
      if (error.response?.status === 429) {
        return rejectWithValue("Rate limited. Please try again in a moment.");
      }
      return rejectWithValue(error.response?.data?.message || "Failed to add to wishlist");
    } finally {
      setTimeout(() => markRequestCompleted(requestKey), 1000);
    }
  }
);

// Remove item from wishlist
export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (productId, { rejectWithValue }) => {
    const requestKey = `remove-wishlist-${productId}`;
    
    // Check if request is already pending
    if (isRequestPending(requestKey)) {
      return rejectWithValue("Request already in progress");
    }
    
    try {
      markRequestPending(requestKey);
      
      const response = await axios.delete(
        `${API_BASE_URL}/shop/wishlist/remove/${productId}`,
        { 
          withCredentials: true,
          timeout: 8000
        }
      );
      
      if (response.data.success) {
        return { productId, ...response.data.data };
      } else {
        return rejectWithValue(response.data.message || "Failed to remove from wishlist");
      }
    } catch (error) {
      // Handle 429 rate limiting
      if (error.response?.status === 429) {
        return rejectWithValue("Rate limited. Please try again in a moment.");
      }
      return rejectWithValue(error.response?.data?.message || "Failed to remove from wishlist");
    } finally {
      setTimeout(() => markRequestCompleted(requestKey), 1000);
    }
  }
);

// Move item from wishlist to cart
export const moveToCart = createAsyncThunk(
  'wishlist/moveToCart',
  async ({ productId, quantity = 1 }, { rejectWithValue }) => {
    const requestKey = `move-to-cart-${productId}`;
    
    // Check if request is already pending
    if (isRequestPending(requestKey)) {
      return rejectWithValue("Request already in progress");
    }
    
    try {
      markRequestPending(requestKey);
      
      // First add to cart
      const cartResponse = await axios.post(
        `${API_BASE_URL}/shop/cart/add`,
        { productId, quantity },
        { 
          withCredentials: true,
          timeout: 10000
        }
      );
      
      if (cartResponse.data.success) {
        // Then remove from wishlist
        await axios.delete(
          `${API_BASE_URL}/shop/wishlist/remove/${productId}`,
          { 
            withCredentials: true,
            timeout: 8000
          }
        );
        
        return { productId, cartItem: cartResponse.data.data };
      } else {
        return rejectWithValue(cartResponse.data.message || "Failed to move to cart");
      }
    } catch (error) {
      // Handle 429 rate limiting
      if (error.response?.status === 429) {
        return rejectWithValue("Rate limited. Please try again in a moment.");
      }
      return rejectWithValue(error.response?.data?.message || "Failed to move to cart");
    } finally {
      setTimeout(() => markRequestCompleted(requestKey), 1000);
    }
  }
);

// Check if item is in wishlist
export const checkWishlistStatus = createAsyncThunk(
  'wishlist/checkStatus',
  async (productIds, { rejectWithValue }) => {
    const requestKey = `check-wishlist-${productIds.sort().join('-')}`;
    
    // Check if request is already pending
    if (isRequestPending(requestKey)) {
      return rejectWithValue("Request already in progress");
    }
    
    try {
      markRequestPending(requestKey);
      
      const response = await axios.post(
        `${API_BASE_URL}/shop/wishlist/check`,
        { productIds },
        { 
          withCredentials: true,
          timeout: 8000
        }
      );
      
      if (response.data.success) {
        return response.data.data;
      } else {
        return rejectWithValue(response.data.message || "Failed to check wishlist status");
      }
    } catch (error) {
      // Handle 429 rate limiting - return empty data instead of error
      if (error.response?.status === 429) {
        console.warn('Rate limited for wishlist check');
        return { inWishlist: [], count: 0 };
      }
      return rejectWithValue(error.response?.data?.message || "Failed to check wishlist status");
    } finally {
      setTimeout(() => markRequestCompleted(requestKey), 1000);
    }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    clearWishlist: (state) => {
      state.items = [];
      state.wishlistCount = 0;
      state.error = null;
    },
    updateWishlistCount: (state, action) => {
      state.wishlistCount = action.payload;
    },
    // Add optimistic update reducers
    addOptimistic: (state, action) => {
      const { product } = action.payload;
      // Check if already in wishlist
      const exists = state.items.find(item => item.product?._id === product._id);
      if (!exists) {
        state.items.unshift({ 
          product, 
          _id: `optimistic-${Date.now()}`,
          addedAt: new Date().toISOString()
        });
        state.wishlistCount += 1;
        state.lastUpdated = new Date().toISOString();
      }
    },
    removeOptimistic: (state, action) => {
      const { productId } = action.payload;
      state.items = state.items.filter(item => 
        item.product?._id !== productId && item._id !== productId
      );
      state.wishlistCount = Math.max(0, state.wishlistCount - 1);
      state.lastUpdated = new Date().toISOString();
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch wishlist
      .addCase(fetchWishlist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.items || [];
        state.wishlistCount = action.payload.count || state.items.length;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Add to wishlist
      .addCase(addToWishlist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        // Check if item already exists
        const exists = state.items.find(item => item.product?._id === action.payload.productId);
        if (!exists) {
          state.items.unshift(action.payload);
          state.wishlistCount += 1;
          state.lastUpdated = new Date().toISOString();
        }
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Remove from wishlist
      .addCase(removeFromWishlist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = state.items.filter(item => item.product?._id !== action.payload.productId);
        state.wishlistCount = Math.max(0, state.wishlistCount - 1);
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Move to cart
      .addCase(moveToCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(moveToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = state.items.filter(item => item.product?._id !== action.payload.productId);
        state.wishlistCount = Math.max(0, state.wishlistCount - 1);
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(moveToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Check wishlist status
      .addCase(checkWishlistStatus.fulfilled, (state, action) => {
        // Update wishlist count if available
        if (action.payload.count !== undefined) {
          state.wishlistCount = action.payload.count;
        }
      });
  }
});

export const { clearWishlist, updateWishlistCount, addOptimistic, removeOptimistic } = wishlistSlice.actions;
export default wishlistSlice.reducer;