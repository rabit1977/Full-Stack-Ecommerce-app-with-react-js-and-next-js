import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WishlistState {
  itemIds: string[];
  isInitialized: boolean;
}

const initialState: WishlistState = {
  itemIds: [],
  isInitialized: false,
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    setWishlist: (state, action: PayloadAction<string[]>) => {
      state.itemIds = action.payload;
      state.isInitialized = true;
    },
    clearWishlist: (state) => {
      state.itemIds = [];
    },
  },
});

export const { setWishlist, clearWishlist } = wishlistSlice.actions;

export default wishlistSlice.reducer;
