import { Product } from '@prisma/client';

// This function gets the best available image for a product
// with a robust fallback to a placeholder.
export const getProductImage = (product: Product): string => {
  // 1. Try to get the image from the first variant of the first option (e.g., color)
  if (product.options?.[0]?.variants?.[0]?.image) {
    return product.options[0].variants[0].image;
  }

  // 2. Fallback to thumbnail
  if (product.thumbnail) {
    return product.thumbnail;
  }

  // 3. Final fallback to a generic placeholder
  return '/images/placeholder.jpg';
};
