
import { configureStore} from '@reduxjs/toolkit';
import authReducer from './auth-slice';
import adminProductsSlice from './admin/product-slice';
import shoppingProductsSlice from './shop/products-slice';



const store = configureStore({
  reducer: {
    auth: authReducer,
    adminProducts: adminProductsSlice,
    shopProducts : shoppingProductsSlice,
  },
})

export default store;