import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  addressList: [],
  error: null,
};

/* ================= ADD NEW ADDRESS ================= */
export const addNewAddress = createAsyncThunk(
  "address/addNewAddress",
  async (formData, thunkAPI) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/shop/address/add",
        formData,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to add address"
      );
    }
  }
);

/* ================= FETCH ALL ADDRESSES ================= */
export const fetchAllAddresses = createAsyncThunk(
  "address/fetchAllAddresses",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/shop/address/get",
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch addresses"
      );
    }
  }
);

/* ================= EDIT ADDRESS ================= */
export const editAnAddress = createAsyncThunk(
  "address/editAnAddress",
  async ({ addressId, formData }, thunkAPI) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/shop/address/update/${addressId}`,
        formData,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update address"
      );
    }
  }
);

/* ================= DELETE ADDRESS ================= */
export const deleteAddress = createAsyncThunk(
  "address/deleteAddress",
  async (addressId, thunkAPI) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/shop/address/delete/${addressId}`,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      return addressId;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete address"
      );
    }
  }
);

/* ================= SLICE ================= */
const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    clearAddressError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ---------- ADD ----------
      .addCase(addNewAddress.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addNewAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addressList.push(action.payload);
      })
      .addCase(addNewAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // ---------- FETCH ----------
      .addCase(fetchAllAddresses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllAddresses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addressList = action.payload;
      })
      .addCase(fetchAllAddresses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // ---------- EDIT ----------
      .addCase(editAnAddress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(editAnAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addressList = state.addressList.map((addr) =>
          addr._id === action.payload._id ? action.payload : addr
        );
      })
      .addCase(editAnAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // ---------- DELETE ----------
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addressList = state.addressList.filter(
          (addr) => addr._id !== action.payload
        );
      });
  },
});

export const { clearAddressError } = addressSlice.actions;
export default addressSlice.reducer;
