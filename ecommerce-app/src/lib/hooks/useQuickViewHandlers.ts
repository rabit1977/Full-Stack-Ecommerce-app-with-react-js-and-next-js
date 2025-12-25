import { useCallback } from 'react';
import { useAppDispatch } from '@/lib/store/hooks';
import { addToCart } from '@/lib/store/slices/cartSlice';
import { toggleWishlist } from '@/lib/store/thunks/cartThunks';
import { Product } from '@/lib/types';
import {
  getCartItemImage,
  generateCartItemId,
  getSafeImageUrl,
  validateRequiredOptions,
} from '../utils/quickview';

export const useQuickViewHandlers = (
  product: Product | undefined,
  quantity: number,
  selectedOptions: Record<string, string>,
  setAdding: (adding: boolean) => void,
  setAdded: (added: boolean) => void,
  setActiveImage: (image: string) => void,
  setValidationError: (error: string) => void
) => {
  const dispatch = useAppDispatch();

  const handleAddToCart = useCallback(async () => {
    if (!product) return;

    // Validate all required options are selected
    const validation = validateRequiredOptions(product.options, selectedOptions);
    
    if (!validation.isValid) {
      const missingOptionsText = validation.missingOptions.join(', ');
      setValidationError(`Please select: ${missingOptionsText}`);
      return;
    }

    // Clear any previous validation errors
    setValidationError('');
    setAdding(true);
    await new Promise((r) => setTimeout(r, 900));

    const cartItemId = generateCartItemId(product.id, selectedOptions);
    const itemImage = getCartItemImage(product, selectedOptions);

    dispatch(
      addToCart({
        id: product.id,
        quantity,
        title: product.title,
        price: product.price,
        options: selectedOptions,
        cartItemId,
        image: itemImage,
      })
    );

    setAdding(false);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }, [product, quantity, selectedOptions, dispatch, setAdding, setAdded, setValidationError]);

  const handleToggleWishlist = useCallback(() => {
    if (!product) return;
    dispatch(toggleWishlist(product.id));
  }, [product, dispatch]);

  const handleOptionChange = useCallback(
    (optionName: string, optionValue: string) => {
      if (!product) return;

      // Clear validation error when user selects an option
      setValidationError('');

      if (optionName === 'Color' && product.options?.[0]?.type === 'color') {
        const selectedVariant = product.options[0].variants.find(
          (v) => v.value === optionValue
        );
        const newImage = getSafeImageUrl(
          selectedVariant?.image || product.images?.[0]
        );
        setActiveImage(newImage);
      }

      return { [optionName]: optionValue };
    },
    [product, setActiveImage, setValidationError]
  );

  const handleQuantityChange = useCallback(
    (newQuantity: number) => {
      if (!product) return newQuantity;
      return Math.max(1, Math.min(product.stock, newQuantity));
    },
    [product]
  );

  return {
    handleAddToCart,
    handleToggleWishlist,
    handleOptionChange,
    handleQuantityChange,
  };
};