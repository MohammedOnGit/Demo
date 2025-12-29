import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const initialState = {
  items: [],
  isLoading: false,
  error: null,
  wishlistCount: 0,
  lastUpdated: null
};

// Fetch user's wishlist
export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/shop/wishlist`, {
        withCredentials: true
      });
      
      if (response.data.success) {
        return response.data.data;
      } else {
        return rejectWithValue(response.data.message || "Failed to fetch wishlist");
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch wishlist");
    }
  }
);

// Add item to wishlist
export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/shop/wishlist/add`,
        { productId },
        { withCredentials: true }
      );
      
      if (response.data.success) {
        return response.data.data;
      } else {
        return rejectWithValue(response.data.message || "Failed to add to wishlist");
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to add to wishlist");
    }
  }
);

// Remove item from wishlist
export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/shop/wishlist/remove/${productId}`,
        { withCredentials: true }
      );
      
      if (response.data.success) {
        return { productId, ...response.data.data };
      } else {
        return rejectWithValue(response.data.message || "Failed to remove from wishlist");
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to remove from wishlist");
    }
  }
);

// Move item from wishlist to cart
export const moveToCart = createAsyncThunk(
  'wishlist/moveToCart',
  async ({ productId, quantity = 1 }, { rejectWithValue }) => {
    try {
      // First add to cart
      const cartResponse = await axios.post(
        `${API_BASE_URL}/shop/cart/add`,
        { productId, quantity },
        { withCredentials: true }
      );
      
      if (cartResponse.data.success) {
        // Then remove from wishlist
        await axios.delete(
          `${API_BASE_URL}/shop/wishlist/remove/${productId}`,
          { withCredentials: true }
        );
        
        return { productId, cartItem: cartResponse.data.data };
      } else {
        return rejectWithValue(cartResponse.data.message || "Failed to move to cart");
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to move to cart");
    }
  }
);

// Check if item is in wishlist
export const checkWishlistStatus = createAsyncThunk(
  'wishlist/checkStatus',
  async (productIds, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/shop/wishlist/check`,
        { productIds },
        { withCredentials: true }
      );
      
      if (response.data.success) {
        return response.data.data;
      } else {
        return rejectWithValue(response.data.message || "Failed to check wishlist status");
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to check wishlist status");
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

export const { clearWishlist, updateWishlistCount } = wishlistSlice.actions;
export default wishlistSlice.reducer;