import { toggleWishlistAction } from '@/actions/wishlist-actions';
import { AppThunk } from './cartThunks';
import { setWishlist } from '../slices/wishlistSlice';

export const toggleWishlist = (
  productId: string
): AppThunk => async (dispatch) => {
  const result = await toggleWishlistAction(productId);
  if (result.success && result.wishlist) {
    dispatch(setWishlist(result.wishlist));
  }
  // Optionally, handle the error case e.g. show a toast
};
