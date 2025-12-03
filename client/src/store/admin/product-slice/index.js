import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  isLoading: false,
  error: null,
};

/* ------------------ ADD NEW PRODUCT ------------------ */
export const addNewProduct = createAsyncThunk(
  "/products/addNewProduct",
  async (FormData) => {
    const result = await axios.post(
      "http://localhost:5000/api/admin/products/add",
      FormData,
      { headers: { "Content-Type": "application/json" } }
    );
    return result.data;
  }
);

/* ------------------ FETCH ALL PRODUCTS ------------------ */
export const fetchAllProducts = createAsyncThunk(
  "/products/fetchAllProducts",
  async () => {
    const result = await axios.get(
      "http://localhost:5000/api/admin/products/get"
    );
    return result.data;
  }
);

/* ------------------ EDIT PRODUCT ------------------ */
export const editProduct = createAsyncThunk(
  "/products/editProduct",
  async ({ productId, FormData }) => {
    const result = await axios.put(
      `http://localhost:5000/api/admin/products/edit/${productId}`,
      FormData,
      { headers: { "Content-Type": "application/json" } }
    );
    return result.data;
  }
);

/* ------------------ DELETE PRODUCT ------------------ */
export const deletedProduct = createAsyncThunk(
  "/products/deletedProduct",
  async ({ productId }) => {
    const result = await axios.delete(
      `http://localhost:5000/api/admin/products/delete/${productId}`
    );
    return result.data;
  }
);

/* ------------------ SLICE ------------------ */
const AdminProductSlice = createSlice({
  name: "adminProduct",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      /* FETCH */
      .addCase(fetchAllProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.data;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.products
        state.error = action.error.message;
      })

      /* ADD */
      .addCase(addNewProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addNewProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products.push(action.payload.data);
      })
      .addCase(addNewProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      /* EDIT */
      .addCase(editProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(editProduct.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(editProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      /* DELETE */
      .addCase(deletedProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deletedProduct.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(deletedProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export default AdminProductSlice.reducer;
