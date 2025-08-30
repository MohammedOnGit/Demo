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
        { withCredentials: true } // ✅ no semicolon here
      );
      return response.data; // ✅ return data properly
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Something went wrong"
      );
    }
  }
);

// 🔹 Create the auth slice
const authSlice = createSlice({
  name: "auth", // Slice name (used in Redux store)
  initialState, // Attach initial state
  reducers: {
    // Define reducer functions (state modifiers)

    // ✅ Sets the current user when logging in
    setUser(state, action) {
      state.user = action.payload; // Save user data from payload
      state.isAuthenticated = true; // Mark user as logged in
    },

    

    // (You can add more reducers here e.g., logout, setLoading, etc.)
  },
});

// 🔹 Export actions so they can be dispatched in components
export const { setUser } = authSlice.actions;

// 🔹 Export reducer to be used in the Redux store
export default authSlice.reducer;
