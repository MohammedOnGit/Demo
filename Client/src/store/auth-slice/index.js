// Import helper function from Redux Toolkit for creating a slice of state
import { createSlice } from '@reduxjs/toolkit';

// 🔹 Initial state for authentication
const initialState = {
  user: null,             // Stores the logged-in user's data (null if not logged in)
  isAuthenticated: false, // Boolean flag to check if user is logged in
  loading: false,         // Indicates whether an auth request (login/logout) is in progress
};

// 🔹 Create the auth slice
const authSlice = createSlice({
  name: 'auth',           // Slice name (used in Redux store)
  initialState,           // Attach initial state
  reducers: {             // Define reducer functions (state modifiers)

    // ✅ Sets the current user when logging in
    setUser(state, action) {
      state.user = action.payload;   // Save user data from payload
      state.isAuthenticated = true;  // Mark user as logged in
    },

    // (You can add more reducers here e.g., logout, setLoading, etc.)
  }
});

// 🔹 Export actions so they can be dispatched in components
export const { setUser } = authSlice.actions;

// 🔹 Export reducer to be used in the Redux store
export default authSlice.reducer;
