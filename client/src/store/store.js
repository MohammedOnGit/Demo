import { configureStore } from "@reduxjs/toolkit";

// Auth
import authReducer from "./auth-slice";

// Admin
import adminProductsReducer from "./admin/product-slice";

// Shop
import shopProductsReducer from "./shop/products-slice";
import shopCartReducer from "./shop/cart-slice";
import shopAddressSlice from "./shop/address-slice";



const store = configureStore({
  reducer: {
    auth: authReducer,
    adminProducts: adminProductsReducer,
    shopProducts: shopProductsReducer,
    shopCart: shopCartReducer,
    shopAddress: shopAddressSlice,
  },
});

export default store;
