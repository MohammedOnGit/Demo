import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isloading: false,
  featureImageList: [],
  uploadLoading: false,
  uploadSuccess: false,
  uploadError: null,
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
  async (image) => {
    const response = await axios.post(
      `http://localhost:5000/api/common/feature/add`,
      { image },
      {
        withCredentials: true,
      }
    );
    return response.data;
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
        state.uploadError = action.error.message;
      });
  }
});

export const { resetUploadState } = commonSlice.actions;
export default commonSlice.reducer;