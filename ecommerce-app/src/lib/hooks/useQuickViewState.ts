import { ProductWithImages } from '@/lib/types';
import { useEffect, useState } from 'react';
import { getInitialActiveImage, getInitialOptions } from '../utils/quickview';

export const useQuickViewState = (product: ProductWithImages | undefined) => {
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});
  const [activeImage, setActiveImage] = useState<string>('');
  const [validationError, setValidationError] = useState<string>('');

  useEffect(() => {
    if (product) {
      setQuantity(product.stock > 0 ? 1 : 0);
      setAdding(false);
      setAdded(false);
      setValidationError('');
      setSelectedOptions(getInitialOptions(product.options));
      setActiveImage(getInitialActiveImage(product));
    }
  }, [product]);

  return {
    quantity,
    setQuantity,
    adding,
    setAdding,
    added,
    setAdded,
    selectedOptions,
    setSelectedOptions,
    activeImage,
    setActiveImage,
    validationError,
    setValidationError,
  };
};
