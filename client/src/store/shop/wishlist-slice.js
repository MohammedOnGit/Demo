import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Create a separate module-level Set for tracking pending requests
const pendingRequests = new Set();

const initialState = {
  items: [],
  isLoading: false,
  error: null,
  wishlistCount: 0,
  lastUpdated: null
};

// Helper functions
function isRequestPending(key) {
  return pendingRequests.has(key);
}

function markRequestPending(key) {
  pendingRequests.add(key);
}

function markRequestCompleted(key) {
  pendingRequests.delete(key);
}

// Fetch user's wishlist
export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, { rejectWithValue, getState }) => {
    const requestKey = 'fetch-wishlist';
    
    if (isRequestPending(requestKey)) {
      return rejectWithValue("Request already in progress");
    }
    
    try {
      markRequestPending(requestKey);
      
      const response = await axios.get(`${API_BASE_URL}/shop/wishlist`, {
        withCredentials: true,
        timeout: 10000
      });
      
      if (response.data.success) {
        return response.data.data;
      } else {
        return rejectWithValue(response.data.message || "Failed to fetch wishlist");
      }
    } catch (error) {
      if (error.response?.status === 429) {
        return rejectWithValue("Rate limited. Please try again in a moment.");
      }
      return rejectWithValue(error.response?.data?.message || "Failed to fetch wishlist");
    } finally {
      setTimeout(() => markRequestCompleted(requestKey), 1000);
    }
  }
);

// Add item to wishlist
export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async (productId, { rejectWithValue, getState }) => {
    const requestKey = `add-wishlist-${productId}`;
    
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
    
    if (isRequestPending(requestKey)) {
      return rejectWithValue("Request already in progress");
    }
    
    try {
      markRequestPending(requestKey);
      
      const cartResponse = await axios.post(
        `${API_BASE_URL}/shop/cart/add`,
        { productId, quantity },
        { 
          withCredentials: true,
          timeout: 10000
        }
      );
      
      if (cartResponse.data.success) {
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
      state.lastUpdated = new Date().toISOString();
    },
    updateWishlistCount: (state, action) => {
      state.wishlistCount = action.payload;
    },
    addOptimistic: (state, action) => {
      const { product } = action.payload;
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
        if (action.payload.count !== undefined) {
          state.wishlistCount = action.payload.count;
        }
      })
      
      /* CLEAR ON LOGOUT - Listen for clearAllUserData action */
      .addCase('clear/clearAllUserData', (state) => {
        state.items = [];
        state.wishlistCount = 0;
        state.isLoading = false;
        state.error = null;
        state.lastUpdated = new Date().toISOString();
      });
  }
});

export const { clearWishlist, updateWishlistCount, addOptimistic, removeOptimistic } = wishlistSlice.actions;
export default wishlistSlice.reducer;