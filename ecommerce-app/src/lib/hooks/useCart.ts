import { toggleWishlistAction } from '@/actions/wishlist-actions';
import {
  addToCart,
  moveToCart,
  removeFromCart,
  removeFromSaved,
  saveForLater,
  updateCartQuantity,
} from '@/lib/store/thunks/cartThunks';
import { CartItem } from '@/lib/types';
import { useCallback, useTransition } from 'react';
import { showToast } from '../store/thunks/uiThunks';
import { useAppDispatch } from './useAppDispatch';
import { useAppSelector } from './useAppSelector';
import { setWishlist } from '../store/slices/wishlistSlice';

export const useCart = () => {
  const dispatch = useAppDispatch();
  const { cart, savedForLater } = useAppSelector((state) => state.cart);
  const { itemIds: wishlistItems, isInitialized } = useAppSelector(
    (state) => state.wishlist
  );
  const [isToggling, startTransition] = useTransition();

  const handleAddToCart = useCallback(
    (item: Omit<CartItem, 'cartItemId' | 'image'>) => {
      dispatch(addToCart(item));
    },
    [dispatch]
  );

  const handleUpdateCartQuantity = useCallback(
    (cartItemId: string, newQuantity: number) => {
      dispatch(updateCartQuantity(cartItemId, newQuantity));
    },
    [dispatch]
  );

  const handleRemoveFromCart = useCallback(
    (cartItemId: string) => {
      dispatch(removeFromCart(cartItemId));
    },
    [dispatch]
  );

  const handleSaveForLater = useCallback(
    (cartItemId: string) => {
      dispatch(saveForLater(cartItemId));
    },
    [dispatch]
  );

  const handleMoveToCart = useCallback(
    (cartItemId: string) => {
      dispatch(moveToCart(cartItemId));
    },
    [dispatch]
  );

  const handleRemoveFromSaved = useCallback(
    (cartItemId: string) => {
      dispatch(removeFromSaved(cartItemId));
    },
    [dispatch]
  );

  const handleToggleWishlist = useCallback(
    (productId: string) => {
      startTransition(async () => {
        const wasInWishlist = wishlistItems.includes(productId);
        const result = await toggleWishlistAction(productId);
        if (result.success) {
          dispatch(setWishlist(result.wishlist));
          dispatch(
            showToast(
              wasInWishlist ? 'Removed from wishlist' : 'Added to wishlist',
              'info'
            )
          );
        } else {
          dispatch(
            showToast(result.error || 'Failed to update wishlist.', 'error')
          );
        }
      });
    },
    [dispatch, wishlistItems]
  );

  return {
    cart,
    savedForLater,
    wishlistItems,
    isWishlistInitialized: isInitialized,
    isTogglingWishlist: isToggling,
    addToCart: handleAddToCart,
    updateCartQuantity: handleUpdateCartQuantity,
    removeFromCart: handleRemoveFromCart,
    saveForLater: handleSaveForLater,
    moveToCart: handleMoveToCart,
    removeFromSaved: handleRemoveFromSaved,
    toggleWishlist: handleToggleWishlist,
  };
};
