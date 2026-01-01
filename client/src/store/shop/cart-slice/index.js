import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const initialState = {
  items: [],
  isLoading: false,
  error: null,
  cartCount: 0,
  subtotal: 0,
  lastUpdated: null
};

export const fetchCartItems  = createAsyncThunk(
  'cart/fetchCartItems',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/shop/cart/get/${userId}`,
        { 
          withCredentials: true,
          timeout: 10000
        }
      );
      
      if (response.data.success) {
        return response.data.data;
      } else {
        return rejectWithValue(response.data.message || "Failed to fetch cart");
      }
    } catch (error) {
      if (error.response?.status === 429) {
        return rejectWithValue("Rate limited. Please try again in a moment.");
      }
      return rejectWithValue(error.response?.data?.message || "Failed to fetch cart");
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ userId, productId, quantity = 1 }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/shop/cart/add`,
        { userId, productId, quantity },
        { 
          withCredentials: true,
          timeout: 8000
        }
      );
      
      if (response.data.success) {
        return response.data.data;
      } else {
        return rejectWithValue(response.data.message || "Failed to add to cart");
      }
    } catch (error) {
      if (error.response?.status === 429) {
        return rejectWithValue("Rate limited. Please try again in a moment.");
      }
      return rejectWithValue(error.response?.data?.message || "Failed to add to cart");
    }
  }
);

export const updateCartQuantity = createAsyncThunk(
  'cart/updateQuantity',
  async ({ userId, productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/shop/cart/update`,
        { userId, productId, quantity },
        { 
          withCredentials: true,
          timeout: 8000
        }
      );
      
      if (response.data.success) {
        return response.data.data;
      } else {
        return rejectWithValue(response.data.message || "Failed to update cart");
      }
    } catch (error) {
      if (error.response?.status === 429) {
        return rejectWithValue("Rate limited. Please try again in a moment.");
      }
      return rejectWithValue(error.response?.data?.message || "Failed to update cart");
    }
  }
);

export const deleteCartItem = createAsyncThunk(
  'cart/deleteItem',
  async ({ userId, productId }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/shop/cart/${userId}/${productId}`,
        { 
          withCredentials: true,
          timeout: 8000
        }
      );
      
      if (response.data.success) {
        return { productId, ...response.data.data };
      } else {
        return rejectWithValue(response.data.message || "Failed to delete item");
      }
    } catch (error) {
      if (error.response?.status === 429) {
        return rejectWithValue("Rate limited. Please try again in a moment.");
      }
      return rejectWithValue(error.response?.data?.message || "Failed to delete item");
    }
  }
);

export const updateCartFromWishlistMove = createAsyncThunk(
  'cart/updateFromWishlistMove',
  async (cartData, { rejectWithValue }) => {
    try {
      return cartData;
    } catch (error) {
      return rejectWithValue("Failed to update cart from wishlist move");
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart: (state) => {
      state.items = [];
      state.cartCount = 0;
      state.subtotal = 0;
      state.error = null;
      state.lastUpdated = new Date().toISOString();
    },
    updateCartCount: (state, action) => {
      state.cartCount = action.payload;
    },
    updateCartSubtotal: (state, action) => {
      state.subtotal = action.payload;
    },
    addOptimisticCartItem: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      const exists = state.items.find(item => item.productId === product._id);
      
      if (exists) {
        exists.quantity += quantity;
      } else {
        state.items.push({
          productId: product._id,
          image: product.image,
          title: product.title,
          price: product.price,
          salePrice: product.salePrice,
          quantity: quantity,
          _id: `optimistic-${Date.now()}`
        });
      }
      
      state.cartCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.subtotal = state.items.reduce((sum, item) => {
        const price = item.salePrice || item.price || 0;
        return sum + (price * item.quantity);
      }, 0);
      state.lastUpdated = new Date().toISOString();
    },
    removeOptimisticCartItem: (state, action) => {
      const { productId } = action.payload;
      state.items = state.items.filter(item => item.productId !== productId);
      state.cartCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.subtotal = state.items.reduce((sum, item) => {
        const price = item.salePrice || item.price || 0;
        return sum + (price * item.quantity);
      }, 0);
      state.lastUpdated = new Date().toISOString();
    },
    clearCartError: (state) => {
      state.error = null;
    },
    syncCartItems: (state, action) => {
      const { items, cartCount, subtotal } = action.payload;
      state.items = items || [];
      state.cartCount = cartCount || state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.subtotal = subtotal || state.items.reduce((sum, item) => {
        const price = item.salePrice || item.price || 0;
        return sum + (price * item.quantity);
      }, 0);
      state.lastUpdated = new Date().toISOString();
      state.error = null;
    },
    addCartItemDirectly: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      const existingItem = state.items.find(item => item.productId === product._id);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          productId: product._id,
          image: product.image || product.images?.[0],
          title: product.title,
          price: product.price,
          salePrice: product.salePrice,
          quantity: quantity,
          addedAt: new Date().toISOString()
        });
      }
      
      state.cartCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.subtotal = state.items.reduce((sum, item) => {
        const price = item.salePrice || item.price || 0;
        return sum + (price * item.quantity);
      }, 0);
      state.lastUpdated = new Date().toISOString();
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartItems .pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCartItems .fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.items || [];
        state.cartCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
        state.subtotal = state.items.reduce((sum, item) => {
          const price = item.salePrice || item.price || 0;
          return sum + (price * item.quantity);
        }, 0);
        state.lastUpdated = new Date().toISOString();
        state.error = null;
      })
      .addCase(fetchCartItems .rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.items || [];
        state.cartCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
        state.subtotal = state.items.reduce((sum, item) => {
          const price = item.salePrice || item.price || 0;
          return sum + (price * item.quantity);
        }, 0);
        state.lastUpdated = new Date().toISOString();
        state.error = null;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      .addCase(updateCartQuantity.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.items || [];
        state.cartCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
        state.subtotal = state.items.reduce((sum, item) => {
          const price = item.salePrice || item.price || 0;
          return sum + (price * item.quantity);
        }, 0);
        state.lastUpdated = new Date().toISOString();
        state.error = null;
      })
      .addCase(updateCartQuantity.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      .addCase(deleteCartItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = state.items.filter(item => item.productId !== action.payload.productId);
        state.cartCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
        state.subtotal = state.items.reduce((sum, item) => {
          const price = item.salePrice || item.price || 0;
          return sum + (price * item.quantity);
        }, 0);
        state.lastUpdated = new Date().toISOString();
        state.error = null;
      })
      .addCase(deleteCartItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      .addCase(updateCartFromWishlistMove.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCartFromWishlistMove.fulfilled, (state, action) => {
        state.isLoading = false;
        const { cartItems, cartSummary } = action.payload;
        
        if (cartItems) {
          state.items = cartItems;
        }
        
        if (cartSummary) {
          state.cartCount = cartSummary.totalItems || state.items.reduce((sum, item) => sum + item.quantity, 0);
          state.subtotal = cartSummary.subtotal || state.items.reduce((sum, item) => {
            const price = item.salePrice || item.price || 0;
            return sum + (price * item.quantity);
          }, 0);
        } else {
          state.cartCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
          state.subtotal = state.items.reduce((sum, item) => {
            const price = item.salePrice || item.price || 0;
            return sum + (price * item.quantity);
          }, 0);
        }
        
        state.lastUpdated = new Date().toISOString();
        state.error = null;
      })
      .addCase(updateCartFromWishlistMove.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      .addCase('clear/clearAllUserData', (state) => {
        return { ...initialState };
      });
  }
});

export const { 
  clearCart, 
  updateCartCount, 
  updateCartSubtotal, 
  addOptimisticCartItem,
  removeOptimisticCartItem,
  clearCartError,
  syncCartItems,
  addCartItemDirectly
} = cartSlice.actions;

export default cartSlice.reducer;