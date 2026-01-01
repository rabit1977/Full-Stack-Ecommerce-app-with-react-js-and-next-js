
import { renderHook } from '@testing-library/react-hooks';
import { useQuickViewHandlers } from './useQuickViewHandlers';
import * as wishlistActions from '@/actions/wishlist-actions';
import { useAppDispatch } from '@/lib/store/hooks';
import { Product } from '@/lib/types';

jest.mock('@/actions/wishlist-actions');
jest.mock('@/lib/store/hooks');

describe('useQuickViewHandlers', () => {
  const product = { id: '1', title: 'Test Product', price: 10, stock: 5 } as Product;
  const setAdding = jest.fn();
  const setAdded = jest.fn();
  const setActiveImage = jest.fn();
  const setValidationError = jest.fn();
  const dispatch = jest.fn();

  beforeEach(() => {
    (useAppDispatch as jest.Mock).mockReturnValue(dispatch);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call toggleWishlistAction and dispatch setWishlist on success', async () => {
    const wishlist = ['1', '2'];
    (wishlistActions.toggleWishlistAction as jest.Mock).mockResolvedValue({ success: true, wishlist });

    const { result } = renderHook(() =>
      useQuickViewHandlers(product, 1, {}, setAdding, setAdded, setActiveImage, setValidationError)
    );

    await result.current.handleToggleWishlist();

    expect(wishlistActions.toggleWishlistAction).toHaveBeenCalledWith('1');
    expect(dispatch).toHaveBeenCalledWith({ type: 'wishlist/setWishlist', payload: wishlist });
  });

  it('should not dispatch setWishlist on failure', async () => {
    (wishlistActions.toggleWishlistAction as jest.Mock).mockResolvedValue({ success: false });

    const { result } = renderHook(() =>
      useQuickViewHandlers(product, 1, {}, setAdding, setAdded, setActiveImage, setValidationError)
    );

    await result.current.handleToggleWishlist();

    expect(wishlistActions.toggleWishlistAction).toHaveBeenCalledWith('1');
    expect(dispatch).not.toHaveBeenCalled();
  });
});
