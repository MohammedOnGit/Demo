// src/store/shop/shoppingProductsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "sonner"; // optional toast for errors

// Initial state
const initialState = {
  status: "idle", // idle | loading | succeeded | failed
  products: [],
  productDetails: null,
  error: null,
};

// ------------------ Async Thunks ------------------

// Fetch all products with optional filters and sorting
export const fetchAllFilteredProducts = createAsyncThunk(
  "shoppingProducts/fetchAllProducts",
  async ({ filterParams = {}, sortParam = "price-lowtohigh" }, thunkAPI) => {
    try {
      const query = new URLSearchParams({ ...filterParams, sortBy: sortParam });
      const response = await axios.get(
        `http://localhost:5000/api/shop/products/get?${query}`
      );
      return response.data?.data || response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "Failed to fetch products";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Fetch single product details by ID
export const fetchProductDetails = createAsyncThunk(
  "shoppingProducts/fetchProductDetails",
  async ({ productId }, thunkAPI) => {
    if (!productId) return thunkAPI.rejectWithValue("Invalid product ID");

    try {
      const response = await axios.get(
        `http://localhost:5000/api/shop/products/get/${productId}`
      );
      return response.data?.data || response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "Failed to fetch product details";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// ------------------ Slice ------------------
const shoppingProductsSlice = createSlice({
  name: "shoppingProducts",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setProductDetails: (state) => {
      state.productDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ------------------ fetchAllFilteredProducts ------------------
      .addCase(fetchAllFilteredProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload;
        state.error = null;
      })
      .addCase(fetchAllFilteredProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Something went wrong";
        state.products = [];
        toast.error(state.error, { position: "top-right" });
      })

      // ------------------ fetchProductDetails ------------------
      .addCase(fetchProductDetails.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.productDetails = action.payload;
        state.error = null;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Something went wrong";
        state.productDetails = null;
        toast.error(state.error, { position: "top-right" });
      });
  },
});

// ------------------ Exports ------------------
export const { clearError, setProductDetails } = shoppingProductsSlice.actions;
export default shoppingProductsSlice.reducer;
