// src/store/shop/shoppingProductsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  products: [],
  productDetails: null,
  error: null,
};

// Fetch products with filters + sorting
export const fetchAllFilteredProducts = createAsyncThunk(
  "shoppingProducts/fetchAllProducts",
  async ({ filterParams = {}, sortParam = "price-lowtohigh" }, thunkAPI) => {
    try {
      const query = new URLSearchParams({
        ...filterParams,
        sortBy: sortParam,
      });

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

// Fetch one product with filters + sorting
export const fetchProductDetails = createAsyncThunk(
  "shoppingProducts/fetchProductDetails",
  async ({ productId }, thunkAPI) => {
    try {
     

      const response = await axios.get(
        `http://localhost:5000/api/shop/products/get?${productId}`
      );

      return response.data?.data || response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "Failed to fetch the product details";
      return thunkAPI.rejectWithValue(message);
    }
  }
);


const shoppingProductsSlice = createSlice({
  name: "shoppingProducts",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllFilteredProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload;
        state.error = null;
      })
      .addCase(fetchAllFilteredProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Something went wrong";
        state.products = [];
      })
      .addCase(fetchProductDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productDetails = action.payload;
        state.error = null;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Something went wrong";
        state.productDetails = null;
      });
  },
});

export const { clearError } = shoppingProductsSlice.actions;
export default shoppingProductsSlice.reducer;
