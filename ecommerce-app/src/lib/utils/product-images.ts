// lib/utils/product-images.ts
import { Product, ProductWithImages, ProductWithRelations } from '@/lib/types';

/**
 * Default placeholder image for products without images
 */
const DEFAULT_PRODUCT_IMAGE = '/placeholder-product.png';

/**
 * Get the primary image URL for a product
 * Priority: First image in images array > thumbnail > placeholder
 */
export function getProductImage(
  product: Product | ProductWithImages | ProductWithRelations,
): string {
  // Check if product has images array (ProductWithImages or ProductWithRelations)
  if (
    'images' in product &&
    Array.isArray(product.images) &&
    product.images.length > 0
  ) {
    return product.images[0].url;
  }

  // Fallback to thumbnail
  if (product.thumbnail) {
    return product.thumbnail;
  }

  // Final fallback to placeholder
  return DEFAULT_PRODUCT_IMAGE;
}

/**
 * Get all image URLs for a product
 */
export function getProductImages(
  product: ProductWithImages | ProductWithRelations,
): string[] {
  const images: string[] = [];

  // Add all images from images array
  if (product.images && Array.isArray(product.images)) {
    images.push(...product.images.map((img) => img.url));
  }

  // Add thumbnail if not already included
  if (product.thumbnail && !images.includes(product.thumbnail)) {
    images.push(product.thumbnail);
  }

  // Return placeholder if no images found
  return images.length > 0 ? images : [DEFAULT_PRODUCT_IMAGE];
}

/**
 * Get image URL by index
 */
export function getProductImageByIndex(
  product: ProductWithImages | ProductWithRelations,
  index: number,
): string {
  const images = getProductImages(product);
  return images[index] || images[0] || DEFAULT_PRODUCT_IMAGE;
}

/**
 * Check if product has images
 */
export function hasProductImages(
  product: Product | ProductWithImages | ProductWithRelations,
): boolean {
  if (
    'images' in product &&
    Array.isArray(product.images) &&
    product.images.length > 0
  ) {
    return true;
  }
  return !!product.thumbnail;
}

/**
 * Get image count for a product
 */
export function getProductImageCount(
  product: Product | ProductWithImages | ProductWithRelations,
): number {
  if ('images' in product && Array.isArray(product.images)) {
    return product.images.length;
  }
  return product.thumbnail ? 1 : 0;
}
