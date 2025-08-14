import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,         // Holds user data when logged in
 
  isAuthenticated: false, // Tracks login state
  loading: false,     // Useful for showing a loader during login/logout
  error: null         // Stores error messages from failed auth attempts
};



const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action){

    }
  
  }
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;