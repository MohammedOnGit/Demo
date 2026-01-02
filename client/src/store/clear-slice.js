// // // store/shop/clear-slice.js
// // import { createSlice } from '@reduxjs/toolkit';

// // const clearSlice = createSlice({
// //   name: 'clear',
// //   initialState: {},
// //   reducers: {
// //     clearAllUserData: () => {
// //       // This is a trigger action that other slices will listen to
// //       return {};
// //     }
// //   }
// // });

// // export const { clearAllUserData } = clearSlice.actions;
// // export default clearSlice.reducer;

// // store/shop/clear-slice.js
// import { createSlice } from '@reduxjs/toolkit';

// const clearSlice = createSlice({
//   name: 'clear',
//   initialState: {},
//   reducers: {
//     clearAllUserData: () => {
//       // This is a trigger action that other slices will listen to
//       return {};
//     }
//   }
// });

// export const { clearAllUserData } = clearSlice.actions;
// export default clearSlice.reducer;



import { createSlice } from '@reduxjs/toolkit';

const clearSlice = createSlice({
  name: 'clear',
  initialState: {},
  reducers: {
    clearAllUserData: () => {
      return {};
    }
  }
});

export const { clearAllUserData } = clearSlice.actions;
export default clearSlice.reducer;