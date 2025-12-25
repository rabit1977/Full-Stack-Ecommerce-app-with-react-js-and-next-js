import { CartItem } from '@/lib/types';
import {
  addToCart as addToCartAction,
  moveToCart as moveToCartAction,
  removeFromCart as removeFromCartAction,
  removeFromSaved as removeFromSavedAction,
  saveForLater as saveForLaterAction,
  updateCartQuantity as updateCartQuantityAction,
} from '../slices/cartSlice';
import {
  clearWishlist as clearWishlistAction,
  toggleWishlistItem as toggleWishlistAction,
  addToWishlist as addToWishlistAction,
  removeFromWishlist as removeFromWishlistAction,
} from '../slices/wishlistSlice';
import { AppDispatch, RootState } from '../store';
import { showToast } from './uiThunks';

/**
 * Add item to cart with stock validation
 */
export const addToCart = (item: Omit<CartItem, 'cartItemId' | 'image'>) => (
  dispatch: AppDispatch,
  getState: () => RootState
) => {
  const { products } = getState().products;
  const { cart } = getState().cart;

  const product = products.find((p) => p.id === item.id);
  if (!product) {
    dispatch(showToast('Product not found.', 'error'));
    return { success: false };
  }

  // Resolve selected options with defaults
  const selectedOptions =
    item.options ??
    product.options?.reduce((acc, option) => {
      acc[option.name] = option.variants[0].value;
      return acc;
    }, {} as Record<string, string>) ??
    {};

  const cartItemId = `${item.id}-${JSON.stringify(selectedOptions)}`;
  const existingItem = cart.find((i) => i.cartItemId === cartItemId);
  const quantityInCart = existingItem ? existingItem.quantity : 0;

  // Stock validation
  if (quantityInCart + item.quantity > product.stock) {
    dispatch(
      showToast(
        `Only ${product.stock} available for ${item.title}.`,
        'error'
      )
    );
    return { success: false };
  }

  // Get variant image if color option exists
  const colorOption = product.options?.find((o) => o.name === 'Color');
  const selectedVariant = colorOption?.variants.find(
    (v) => v.value === selectedOptions.Color
  );
  const itemImage =
    selectedVariant?.image ||
    product.images?.[0] ||
    '/images/placeholder.jpg';

  // Create cart item
  const newItem: CartItem = {
    ...item,
    options: selectedOptions,
    cartItemId,
    image: itemImage,
  };

  dispatch(addToCartAction(newItem));
  dispatch(showToast(`${item.title} added to cart`, 'success'));
  return { success: true };
};

/**
 * Update cart item quantity with stock validation
 */
export const updateCartQuantity = (cartItemId: string, newQuantity: number) => (
  dispatch: AppDispatch,
  getState: () => RootState
) => {
  const { cart } = getState().cart;
  const { products } = getState().products;

  const cartItem = cart.find((i) => i.cartItemId === cartItemId);
  if (!cartItem) {
    return { success: false };
  }

  const product = products.find((p) => p.id === cartItem.id);
  
  // Stock validation
  if (product && newQuantity > product.stock) {
    dispatch(
      showToast(`Only ${product.stock} available.`, 'error')
    );
    return { success: false };
  }

  dispatch(updateCartQuantityAction({ cartItemId, newQuantity }));
  
  if (newQuantity === 0) {
    dispatch(showToast('Item removed from cart.', 'info'));
  }
  
  return { success: true };
};

/**
 * Remove item from cart
 */
export const removeFromCart = (cartItemId: string) => (
  dispatch: AppDispatch,
  getState: () => RootState
) => {
  const { cart } = getState().cart;
  const item = cart.find((i) => i.cartItemId === cartItemId);
  
  if (item) {
    dispatch(removeFromCartAction(cartItemId));
    dispatch(showToast(`${item.title} removed from cart.`, 'info'));
    return { success: true };
  }
  
  return { success: false };
};

/**
 * Move item from cart to saved for later
 */
export const saveForLater = (cartItemId: string) => (
  dispatch: AppDispatch
) => {
  dispatch(saveForLaterAction(cartItemId));
  dispatch(showToast("Item moved to 'Saved for Later'.", 'info'));
  return { success: true };
};

/**
 * Move item from saved for later to cart
 */
export const moveToCart = (cartItemId: string) => (
  dispatch: AppDispatch
) => {
  dispatch(moveToCartAction(cartItemId));
  dispatch(showToast('Item moved to cart.', 'info'));
  return { success: true };
};

/**
 * Remove item from saved for later
 */
export const removeFromSaved = (cartItemId: string) => (
  dispatch: AppDispatch
) => {
  dispatch(removeFromSavedAction(cartItemId));
  dispatch(showToast('Item removed.', 'info'));
  return { success: true };
};

/**
 * Toggle product in wishlist
 */
export const toggleWishlist = (productId: string) => (
  dispatch: AppDispatch,
  getState: () => RootState
) => {
  const { itemIds } = getState().wishlist;
  const isInWishlist = itemIds.includes(productId);

  dispatch(toggleWishlistAction(productId));
  dispatch(
    showToast(
      isInWishlist ? 'Removed from wishlist' : 'Added to wishlist',
      'info'
    )
  );
  
  return { success: true, wasInWishlist: isInWishlist };
};

/**
 * Add product to wishlist (explicit add)
 */
export const addToWishlist = (productId: string) => (
  dispatch: AppDispatch,
  getState: () => RootState
) => {
  const { itemIds } = getState().wishlist;
  
  if (itemIds.includes(productId)) {
    return { success: false, message: 'Already in wishlist' };
  }

  dispatch(addToWishlistAction(productId));
  dispatch(showToast('Added to wishlist', 'success'));
  return { success: true };
};

/**
 * Remove product from wishlist (explicit remove)
 */
export const removeFromWishlist = (productId: string) => (
  dispatch: AppDispatch
) => {
  dispatch(removeFromWishlistAction(productId));
  dispatch(showToast('Removed from wishlist', 'info'));
  return { success: true };
};

/**
 * Clear entire wishlist
 */
export const clearWishlist = () => (dispatch: AppDispatch) => {
  dispatch(clearWishlistAction());
  dispatch(showToast('Wishlist cleared', 'info'));
  return { success: true };
};