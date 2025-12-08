// const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");
// const { builder } = require("vite");

// const initialState = {
//   isLoading : false,
//   products: [],
// }

// export const fetchAllFilteredProducts = createAsyncThunk(
//   "/products/fetchAllProducts",
//   async (_, { rejectWithValue }) => {
//     try {
//       const result = await axios.get(
//         "http://localhost:5000/api/shop/products/get"
//       );
//       return result.data?.data || result.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

// const shoppingProductsSlice = createSlice({
//   name : "shopppingProducts",
//   initialState,
//   reducers : {},
//   extraReducers: (builder)=>{
//    builder.addCase(fetchAllFilteredProducts.pending,(state, action)=>{
//     state.isLoading = true;
//    }
//   }
// })

// src/features/products/shoppingProductsSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  products: [],
  error: null,
};

// Async thunk – fetch all products from backend
export const fetchAllFilteredProducts = createAsyncThunk(
  "shoppingProducts/fetchAllProducts", // clean action name
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/shop/products/get"
      );

      // Adjust this line based on your actual API response structure
      return response.data?.data || response.data; // most common patterns
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "Failed to fetch products";
      return rejectWithValue(message);
    }
  }
);

// Slice
const shoppingProductsSlice = createSlice({
  name: "shoppingProducts", // fixed typo: shoppping → shopping
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Pending → loading
      .addCase(fetchAllFilteredProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      // Success → save products
      .addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload;
        state.error = null;
      })
      // Failed → save error
      .addCase(fetchAllFilteredProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Something went wrong";
        state.products = []; // optional: clear old data on error
      });
  },
});

// Export actions and reducer
export const { clearError } = shoppingProductsSlice.actions;
export default shoppingProductsSlice.reducer;