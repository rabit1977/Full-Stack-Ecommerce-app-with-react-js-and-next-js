import { Product } from '@prisma/client';

interface ProductOption {
  name: string;
  type: string;
  variants: Array<{
    value: string;
    image?: string;
    [key: string]: any;
  }>;
}

// This function gets the best available image for a product
// with a robust fallback to a placeholder.
export const getProductImage = (product: Product): string => {
  try {
    // 1. Try to get the image from the first variant of the first option (e.g., color)
    const options = product.options as ProductOption[] | null;
    if (options && Array.isArray(options) && options.length > 0) {
      const firstVariant = options[0]?.variants?.[0];
      if (firstVariant?.image) {
        const trimmedImage = (firstVariant.image as string).trim();
        if (trimmedImage) {
          return trimmedImage;
        }
      }
    }
  } catch (error) {
    // If parsing fails, continue to fallback
  }

  // 2. Fallback to thumbnail
  if (product.thumbnail && product.thumbnail.trim()) {
    return product.thumbnail;
  }

  // 3. Final fallback to a generic placeholder
  return '/images/placeholder.jpg';
};
