import { toggleWishlistAction } from '@/actions/wishlist-actions';
import { setWishlist } from '../slices/wishlistSlice';
import { AppDispatch } from '../store';

export const toggleWishlist = (
  productId: string
) => async (dispatch: AppDispatch) => {
  const result = await toggleWishlistAction(productId);
  if (result.success && result.wishlist) {
    dispatch(setWishlist(result.wishlist));
  }
  // Optionally, handle the error case e.g. show a toast
};
