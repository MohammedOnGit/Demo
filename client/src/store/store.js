
import { configureStore } from "@reduxjs/toolkit";

// Auth
import authReducer from "./auth-slice";

// Admin
import adminProductsReducer from "./admin/product-slice";

// Shop
import shopProductsReducer from "./shop/products-slice";
import shopCartReducer from "./shop/cart-slice";
import shopAddressSlice from "./shop/address-slice";
import searchReducer from "./shop/search-slice"; // Add this import
import wishlistReducer from "./shop/wishlist-slice"; // Add this


const store = configureStore({
  reducer: {
    auth: authReducer,
    adminProducts: adminProductsReducer,
    shopProducts: shopProductsReducer,
    shopCart: shopCartReducer,
    shopAddress: shopAddressSlice,
    search: searchReducer, // Add this line
    wishlist: wishlistReducer, // Add this

  },
});

export default store;