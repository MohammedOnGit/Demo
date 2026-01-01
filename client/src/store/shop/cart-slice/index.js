import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = "http://localhost:5000/api/shop/cart";

const initialState = {
  cartItems: [],
  isLoading: false,
  error: null,
};

/* ------------------ ADD TO CART ------------------ */
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ userId, productId, quantity }, thunkAPI) => {
    try {
      const response = await axios.post(`${BASE_URL}/add`, {
        userId,
        productId,
        quantity: Number(quantity) || 1,
      });

      return response.data?.data?.items || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to add to cart"
      );
    }
  }
);

// Add this action to update cart after moving from wishlist
export const updateCartAfterWishlistMove = createAsyncThunk(
  'cart/updateAfterWishlistMove',
  async (cartItems, { rejectWithValue }) => {
    try {
      // Fetch fresh cart data from server
      const response = await axios.get(
        `${API_BASE_URL}/shop/cart/get/${getState().auth.user.id}`,
        { withCredentials: true }
      );
      
      if (response.data.success) {
        return response.data.data.items || [];
      }
      return rejectWithValue("Failed to fetch updated cart");
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


/* ------------------ FETCH CART ITEMS ------------------ */
export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async (userId, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/get/${userId}`);
      return response.data?.data?.items || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch cart"
      );
    }
  }
);

/* ------------------ DELETE CART ITEM ------------------ */
export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async ({ userId, productId }, thunkAPI) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/${userId}/${productId}`
      );
      return response.data?.data?.items || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete cart item"
      );
    }
  }
);

/* ------------------ UPDATE CART QUANTITY ------------------ */
export const updateCartQuantity = createAsyncThunk(
  "cart/updateCartQuantity",
  async ({ userId, productId, quantity }, thunkAPI) => {
    try {
      const response = await axios.put(`${BASE_URL}/update`, {
        userId,
        productId,
        quantity: Number(quantity),
      });

      return response.data?.data?.items || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update quantity"
      );
    }
  }
);

/* ------------------ SLICE ------------------ */
const shoppingCartSlice = createSlice({
  name: "shoppingCart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cartItems = [];
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* ADD */
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload || [];
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      /* FETCH */
      .addCase(fetchCartItems.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload || [];
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      /* UPDATE */
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.cartItems = action.payload || [];
      })

      /* DELETE */
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.cartItems = action.payload || [];
      })

      /* CLEAR ON LOGOUT - Listen for clearAllUserData action */
      .addCase('clear/clearAllUserData', (state) => {
        state.cartItems = [];
        state.isLoading = false;
        state.error = null;
      });
  },
});

export const { clearCart } = shoppingCartSlice.actions;
export default shoppingCartSlice.reducer;
