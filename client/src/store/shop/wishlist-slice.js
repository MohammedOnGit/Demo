import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const initialState = {
  items: [],
  isLoading: false,
  error: null,
  wishlistCount: 0,
  lastUpdated: null,
  isFetching: false
};

let lastFetchRequestTime = 0;
const FETCH_COOLDOWN_MS = 1000;

export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, { rejectWithValue, getState }) => {
    const now = Date.now();
    
    if (now - lastFetchRequestTime < FETCH_COOLDOWN_MS) {
      const state = getState();
      if (state.wishlist.items.length > 0) {
        return {
          items: state.wishlist.items,
          count: state.wishlist.wishlistCount
        };
      }
    }
    
    lastFetchRequestTime = now;
    
    try {
      const response = await axios.get(`${API_BASE_URL}/shop/wishlist`, {
        withCredentials: true,
        timeout: 10000,
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (response.data.success) {
        return response.data.data;
      } else {
        return rejectWithValue(response.data.message || "Failed to fetch wishlist");
      }
    } catch (error) {
      console.error("Fetch wishlist error:", error);
      
      if (error.response?.status === 429) {
        return rejectWithValue("Rate limited. Please try again in a moment.");
      }
      
      if (error.code === 'ECONNABORTED') {
        return rejectWithValue("Request timeout. Please check your connection.");
      }
      
      if (!error.response) {
        return rejectWithValue("Network error. Please check your connection.");
      }
      
      return rejectWithValue(error.response?.data?.message || "Failed to fetch wishlist");
    }
  }
);

export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async (productId, { rejectWithValue }) => {
    try {
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
      console.error("Add to wishlist error:", error);
      
      if (error.response?.status === 429) {
        return rejectWithValue("Rate limited. Please try again in a moment.");
      }
      
      return rejectWithValue(error.response?.data?.message || "Failed to add to wishlist");
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (productId, { rejectWithValue }) => {
    try {
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
      console.error("Remove from wishlist error:", error);
      
      if (error.response?.status === 429) {
        return rejectWithValue("Rate limited. Please try again in a moment.");
      }
      
      return rejectWithValue(error.response?.data?.message || "Failed to remove from wishlist");
    }
  }
);

export const moveToCart = createAsyncThunk(
  'wishlist/moveToCart',
  async ({ productId, quantity = 1 }, { rejectWithValue, getState, dispatch }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/shop/wishlist/move-to-cart`,
        { productId, quantity },
        { 
          withCredentials: true,
          timeout: 10000
        }
      );
      
      if (response.data.success) {
        return { 
          productId, 
          cartItems: response.data.data.cartItems,
          wishlistCount: response.data.data.wishlistCount 
        };
      } else {
        return rejectWithValue(response.data.message || "Failed to move to cart");
      }
    } catch (error) {
      console.error("Move to cart error:", error);
      
      if (error.response?.status === 429) {
        return rejectWithValue("Rate limited. Please try again in a moment.");
      }
      
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        "Failed to move item to cart"
      );
    }
  }
);

export const moveSelectedToCart = createAsyncThunk(
  'wishlist/moveSelectedToCart',
  async (productIds, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/shop/wishlist/move-selected-to-cart`,
        { productIds },
        { 
          withCredentials: true,
          timeout: 15000
        }
      );
      
      if (response.data.success) {
        return { 
          movedItems: response.data.data.movedItems,
          failedItems: response.data.data.failedItems,
          inStockItems: response.data.data.inStockItems,
          cartItems: response.data.data.cartItems,
          wishlistCount: response.data.data.wishlistCount 
        };
      } else {
        return rejectWithValue(response.data.message || "Failed to move items to cart");
      }
    } catch (error) {
      console.error("Move selected to cart error:", error);
      
      if (error.response?.status === 429) {
        return rejectWithValue("Rate limited. Please try again in a moment.");
      }
      
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        "Failed to move items to cart"
      );
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
      state.isFetching = false;
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
    },
    clearWishlistError: (state) => {
      state.error = null;
    },
    setWishlistItems: (state, action) => {
      state.items = action.payload;
      state.wishlistCount = action.payload.length;
      state.lastUpdated = new Date().toISOString();
    },
    resetWishlistState: (state) => {
      return { ...initialState };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.isLoading = true;
        state.isFetching = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isFetching = false;
        state.items = action.payload.items || [];
        state.wishlistCount = action.payload.count || state.items.length;
        state.lastUpdated = new Date().toISOString();
        state.error = null;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.isFetching = false;
        state.error = action.payload;
        
        if (state.items.length === 0) {
          state.items = [];
          state.wishlistCount = 0;
        }
      })
      
      .addCase(addToWishlist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        const exists = state.items.find(item => item.product?._id === action.payload.product?._id);
        if (!exists) {
          state.items.unshift(action.payload);
          state.wishlistCount += 1;
          state.lastUpdated = new Date().toISOString();
        }
        state.error = null;
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      .addCase(removeFromWishlist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = state.items.filter(item => 
          item.product?._id !== action.payload.productId && 
          item._id !== action.payload.productId
        );
        state.wishlistCount = Math.max(0, state.wishlistCount - 1);
        state.lastUpdated = new Date().toISOString();
        state.error = null;
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      .addCase(moveToCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(moveToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = state.items.filter(item => 
          item.product?._id !== action.payload.productId && 
          item.productId !== action.payload.productId
        );
        
        if (action.payload.wishlistCount !== undefined) {
          state.wishlistCount = action.payload.wishlistCount;
        } else {
          state.wishlistCount = Math.max(0, state.wishlistCount - 1);
        }
        
        state.lastUpdated = new Date().toISOString();
        state.error = null;
      })
      .addCase(moveToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      .addCase(moveSelectedToCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(moveSelectedToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        
        if (action.payload.movedItems && action.payload.movedItems.length > 0) {
          state.items = state.items.filter(item => {
            const productId = item.product?._id || item.productId;
            return !action.payload.movedItems.includes(productId);
          });
        }
        
        if (action.payload.wishlistCount !== undefined) {
          state.wishlistCount = action.payload.wishlistCount;
        } else if (action.payload.movedItems) {
          state.wishlistCount = Math.max(0, state.wishlistCount - action.payload.movedItems.length);
        }
        
        state.lastUpdated = new Date().toISOString();
        state.error = null;
      })
      .addCase(moveSelectedToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      .addCase('clear/clearAllUserData', (state) => {
        return { ...initialState };
      });
  }
});

export const { 
  clearWishlist, 
  updateWishlistCount, 
  addOptimistic, 
  removeOptimistic,
  clearWishlistError,
  setWishlistItems,
  resetWishlistState
} = wishlistSlice.actions;

export default wishlistSlice.reducer;