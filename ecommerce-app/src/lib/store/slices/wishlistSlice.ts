import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WishlistState {
  itemIds: string[];
}

const WISHLIST_STORAGE_KEY = 'wishlist';

/**
 * Load wishlist from localStorage
 */
const loadWishlistFromStorage = (): string[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading wishlist from storage:', error);
    return [];
  }
};

/**
 * Save wishlist to localStorage
 */
const saveWishlistToStorage = (itemIds: string[]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(itemIds));
  } catch (error) {
    console.error('Error saving wishlist to storage:', error);
  }
};

const initialState: WishlistState = {
  itemIds: loadWishlistFromStorage(),
};

export const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    /**
     * Toggle product in wishlist (add if not present, remove if present)
     */
    toggleWishlistItem: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      const existingIndex = state.itemIds.findIndex(id => id === productId);

      if (existingIndex !== -1) {
        // Remove from wishlist
        state.itemIds.splice(existingIndex, 1);
      } else {
        // Add to wishlist (prepend for most recent first)
        state.itemIds.unshift(productId);
      }
      
      saveWishlistToStorage(state.itemIds);
    },

    /**
     * Add product to wishlist if not already present
     */
    addToWishlist: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      
      if (!state.itemIds.includes(productId)) {
        state.itemIds.unshift(productId);
        saveWishlistToStorage(state.itemIds);
      }
    },

    /**
     * Remove product from wishlist
     */
    removeFromWishlist: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      state.itemIds = state.itemIds.filter(id => id !== productId);
      saveWishlistToStorage(state.itemIds);
    },

    /**
     * Replace entire wishlist
     */
    setWishlist: (state, action: PayloadAction<string[]>) => {
      state.itemIds = action.payload;
      saveWishlistToStorage(state.itemIds);
    },

    /**
     * Clear all wishlist items
     */
    clearWishlist: (state) => {
      state.itemIds = [];
      saveWishlistToStorage(state.itemIds);
    },
  },
});

export const { 
  toggleWishlistItem, 
  addToWishlist,
  removeFromWishlist,
  setWishlist, 
  clearWishlist 
} = wishlistSlice.actions;

export default wishlistSlice.reducer;