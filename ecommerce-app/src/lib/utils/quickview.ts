import { Product, ProductWithImages } from '../types';

export const getSafeImageUrl = (url: string | undefined): string => {
  if (!url || url === '') {
    return '/images/placeholder.jpg';
  }
  return url;
};

export const getInitialOptions = (
  options: Product['options'],
): Record<string, string> => {
  return (
    options?.reduce(
      (acc, opt) => ({
        ...acc,
        [opt.name]: opt.variants[0]?.value || '',
      }),
      {},
    ) || {}
  );
};

export const getInitialActiveImage = (product: ProductWithImages): string => {
  return getSafeImageUrl(
    product.options?.[0]?.variants?.[0]?.image || product.images?.[0]?.url,
  );
};

export const getCartItemImage = (
  product: ProductWithImages,
  selectedOptions: Record<string, string>,
): string => {
  const colorOption = product.options?.find((o) => o.name === 'Color');
  const selectedVariant = colorOption?.variants.find(
    (v) => v.value === selectedOptions?.Color,
  );
  return (
    selectedVariant?.image ||
    product.images?.[0]?.url ||
    '/images/placeholder.jpg'
  );
};

export const generateCartItemId = (
  productId: string,
  selectedOptions: Record<string, string>,
): string => {
  return `${productId}-${JSON.stringify(selectedOptions)}`;
};

export const validateRequiredOptions = (
  options: Product['options'],
  selectedOptions: Record<string, string>,
): { isValid: boolean; missingOptions: string[] } => {
  if (!options || options.length === 0) {
    return { isValid: true, missingOptions: [] };
  }

  const missingOptions: string[] = [];

  options.forEach((option) => {
    const selectedValue = selectedOptions[option.name];
    if (!selectedValue || selectedValue === '') {
      missingOptions.push(option.name);
    }
  });

  return {
    isValid: missingOptions.length === 0,
    missingOptions,
  };
};
