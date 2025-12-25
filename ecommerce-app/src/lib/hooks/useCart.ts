import { useAppSelector } from './useAppSelector';
import { useAppDispatch } from './useAppDispatch';
import {
  addToCart,
  updateCartQuantity,
  removeFromCart,
  saveForLater,
  moveToCart,
  removeFromSaved,
  toggleWishlist,
} from '@/lib/store/thunks/cartThunks';
import { useCallback } from 'react';
import { CartItem } from '@/lib/types';

export const useCart = () => {
  const dispatch = useAppDispatch();
  const { cart, savedForLater } = useAppSelector((state) => state.cart);
  const wishlistItems = useAppSelector((state) => state.wishlist.itemIds);

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
      dispatch(toggleWishlist(productId));
    },
    [dispatch]
  );

  return {
    cart,
    savedForLater,
    wishlistItems,
    addToCart: handleAddToCart,
    updateCartQuantity: handleUpdateCartQuantity,
    removeFromCart: handleRemoveFromCart,
    saveForLater: handleSaveForLater,
    moveToCart: handleMoveToCart,
    removeFromSaved: handleRemoveFromSaved,
    toggleWishlist: handleToggleWishlist,
  };
};
