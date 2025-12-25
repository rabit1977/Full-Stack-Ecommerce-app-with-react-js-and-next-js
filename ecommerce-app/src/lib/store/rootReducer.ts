
import { combineReducers } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import orderReducer from './slices/orderSlice';
import productReducer from './slices/productSlice';
import uiReducer from './slices/uiSlice';
import userReducer from './slices/userSlice';
import wishlistReducer from './slices/wishlistSlice';

/**
 * Root reducer combining all slice reducers
 * Keep order consistent across files for easier debugging
 */
const rootReducer = combineReducers({
  ui: uiReducer,
  user: userReducer,
  products: productReducer,
  wishlist: wishlistReducer,
  cart: cartReducer,
  orders: orderReducer, // Changed from 'order' to 'orders' for consistency
});

export default rootReducer;

// Export root state type for use in other files
export type RootState = ReturnType<typeof rootReducer>;
