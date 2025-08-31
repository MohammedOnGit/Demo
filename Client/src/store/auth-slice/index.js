// Import helper function from Redux Toolkit for creating a slice of state
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// 🔹 Initial state for authentication
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
};

export const registerUser = createAsyncThunk(
  "auth/register",
  async (formData, thunkAPI) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        formData,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Something went wrong"
      );
    }
  }
);

// 🔹 Create the auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // ✅ Sets the current user when logging in
    setUser(state, action) {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = null // ✅ set user properly here
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

// 🔹 Export actions
export const { setUser } = authSlice.actions;

// 🔹 Export reducer
export default authSlice.reducer;
