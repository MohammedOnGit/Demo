import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isloading: false,
  featureImageList: [],
  uploadLoading: false,
  uploadSuccess: false,
  uploadError: null,
  deleteLoading: false,
  deleteSuccess: false,
  deleteError: null,
  error: null,
};

export const getFeatureImages = createAsyncThunk(
  "/common/getFeatureImages",
  async () => {
    const response = await axios.get(`http://localhost:5000/api/common/feature/get`);
    return response.data;
  }
);

export const addFeatureImage = createAsyncThunk(
  "/common/addFeatureImage",
  async (image, { rejectWithValue }) => {
    try {
      // Get token from localStorage (your SecureStorage uses "app_" prefix)
      const token = localStorage.getItem('app_token');
      
      const response = await axios.post(
        `http://localhost:5000/api/common/feature/add`,
        { image },
        {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Add feature image error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteFeatureImage = createAsyncThunk(
  "/common/deleteFeatureImage",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('app_token');
      
      const response = await axios.delete(
        `http://localhost:5000/api/common/feature/delete/${id}`,
        {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
          },
          withCredentials: true,
        }
      );
      return { id, data: response.data };
    } catch (error) {
      console.error("Delete feature image error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const commonSlice = createSlice({
  name: 'commonSlice',
  initialState,
  reducers: {
    resetUploadState: (state) => {
      state.uploadLoading = false;
      state.uploadSuccess = false;
      state.uploadError = null;
    },
    resetDeleteState: (state) => {
      state.deleteLoading = false;
      state.deleteSuccess = false;
      state.deleteError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Feature Images
      .addCase(getFeatureImages.pending, (state) => {
        state.isloading = true;
        state.error = null;
      })
      .addCase(getFeatureImages.fulfilled, (state, action) => {
        state.isloading = false;
        state.featureImageList = action.payload.data;
      })
      .addCase(getFeatureImages.rejected, (state, action) => {
        state.isloading = false;
        state.error = action.error.message;
        state.featureImageList = [];
      })
      
      // Add Feature Image
      .addCase(addFeatureImage.pending, (state) => {
        state.uploadLoading = true;
        state.uploadSuccess = false;
        state.uploadError = null;
      })
      .addCase(addFeatureImage.fulfilled, (state, action) => {
        state.uploadLoading = false;
        state.uploadSuccess = true;
        if (action.payload.data) {
          state.featureImageList.unshift(action.payload.data);
        }
      })
      .addCase(addFeatureImage.rejected, (state, action) => {
        state.uploadLoading = false;
        state.uploadSuccess = false;
        state.uploadError = action.payload?.message || action.error.message;
      })
      
      // Delete Feature Image
      .addCase(deleteFeatureImage.pending, (state) => {
        state.deleteLoading = true;
        state.deleteSuccess = false;
        state.deleteError = null;
      })
      .addCase(deleteFeatureImage.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.deleteSuccess = true;
        state.featureImageList = state.featureImageList.filter(
          image => image._id !== action.payload.id
        );
      })
      .addCase(deleteFeatureImage.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteSuccess = false;
        state.deleteError = action.payload?.message || action.error.message;
      });
  }
});

export const { resetUploadState, resetDeleteState } = commonSlice.actions;
export default commonSlice.reducer;