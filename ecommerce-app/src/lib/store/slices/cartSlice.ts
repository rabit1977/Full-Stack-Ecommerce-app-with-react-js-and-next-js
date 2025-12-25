import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem } from '@/lib/types';

interface CartState {
  cart: CartItem[];
  savedForLater: CartItem[];
}

const CART_STORAGE_KEY = 'cart';
const SAVED_STORAGE_KEY = 'savedForLater';

/**
 * Load cart from localStorage
 */
const loadCartFromStorage = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading cart from storage:', error);
    return [];
  }
};

/**
 * Load saved items from localStorage
 */
const loadSavedFromStorage = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(SAVED_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading saved items from storage:', error);
    return [];
  }
};

/**
 * Save cart to localStorage
 */
const saveCartToStorage = (cart: CartItem[]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving cart to storage:', error);
  }
};

/**
 * Save savedForLater to localStorage
 */
const saveSavedToStorage = (saved: CartItem[]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(saved));
  } catch (error) {
    console.error('Error saving saved items to storage:', error);
  }
};

const initialState: CartState = {
  cart: loadCartFromStorage(),
  savedForLater: loadSavedFromStorage(),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    /**
     * Add item to cart or update quantity if exists
     */
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const newItem = action.payload;
      const existingItem = state.cart.find(
        item => item.cartItemId === newItem.cartItemId
      );
      
      if (existingItem) {
        existingItem.quantity += newItem.quantity;
      } else {
        state.cart.push(newItem);
      }
      
      saveCartToStorage(state.cart);
    },

    /**
     * Update cart item quantity
     */
    updateCartQuantity: (
      state,
      action: PayloadAction<{ cartItemId: string; newQuantity: number }>
    ) => {
      const { cartItemId, newQuantity } = action.payload;
      
      if (newQuantity <= 0) {
        // Remove item if quantity is 0 or negative
        state.cart = state.cart.filter(item => item.cartItemId !== cartItemId);
      } else {
        const itemToUpdate = state.cart.find(
          item => item.cartItemId === cartItemId
        );
        if (itemToUpdate) {
          itemToUpdate.quantity = newQuantity;
        }
      }
      
      saveCartToStorage(state.cart);
    },

    /**
     * Remove item from cart
     */
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.cart = state.cart.filter(
        item => item.cartItemId !== action.payload
      );
      saveCartToStorage(state.cart);
    },

    /**
     * Move item from cart to saved for later
     */
    saveForLater: (state, action: PayloadAction<string>) => {
      const itemIndex = state.cart.findIndex(
        item => item.cartItemId === action.payload
      );
      
      if (itemIndex !== -1) {
        const [itemToMove] = state.cart.splice(itemIndex, 1);
        state.savedForLater.push(itemToMove);
        
        saveCartToStorage(state.cart);
        saveSavedToStorage(state.savedForLater);
      }
    },

    /**
     * Move item from saved for later to cart
     */
    moveToCart: (state, action: PayloadAction<string>) => {
      const itemIndex = state.savedForLater.findIndex(
        item => item.cartItemId === action.payload
      );
      
      if (itemIndex !== -1) {
        const [itemToMove] = state.savedForLater.splice(itemIndex, 1);
        
        // Check if item already exists in cart
        const existingCartItem = state.cart.find(
          item => item.cartItemId === itemToMove.cartItemId
        );
        
        if (existingCartItem) {
          existingCartItem.quantity += itemToMove.quantity;
        } else {
          state.cart.push(itemToMove);
        }
        
        saveCartToStorage(state.cart);
        saveSavedToStorage(state.savedForLater);
      }
    },

    /**
     * Remove item from saved for later
     */
    removeFromSaved: (state, action: PayloadAction<string>) => {
      state.savedForLater = state.savedForLater.filter(
        item => item.cartItemId !== action.payload
      );
      saveSavedToStorage(state.savedForLater);
    },

    /**
     * Clear all items from cart
     */
    clearCart: (state) => {
      state.cart = [];
      saveCartToStorage(state.cart);
    },

    /**
     * Clear all saved items
     */
    clearSavedForLater: (state) => {
      state.savedForLater = [];
      saveSavedToStorage(state.savedForLater);
    },

    /**
     * Replace entire cart state (useful for hydration or debugging)
     */
    setCartState: (state, action: PayloadAction<CartState>) => {
      state.cart = action.payload.cart;
      state.savedForLater = action.payload.savedForLater;
      
      saveCartToStorage(state.cart);
      saveSavedToStorage(state.savedForLater);
    },
  },
});

export const {
  addToCart,
  updateCartQuantity,
  removeFromCart,
  saveForLater,
  moveToCart,
  removeFromSaved,
  clearCart,
  clearSavedForLater,
  setCartState,
} = cartSlice.actions;

export default cartSlice.reducer;