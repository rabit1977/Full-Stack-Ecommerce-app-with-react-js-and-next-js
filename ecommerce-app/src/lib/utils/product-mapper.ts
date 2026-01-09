// lib/utils/product-mapper.ts
// Utility to convert Prisma products to frontend format

import { Product as PrismaProduct } from '@prisma/client';
import { Product } from '@/lib/types';

type PrismaProductWithRelations = PrismaProduct & {
  images: { id: string; url: string; }[];
  reviews: {
    id: string;
    userId: string;
    rating: number;
    title: string;
    comment: string;
    helpful: number;
    verifiedPurchase: boolean;
    createdAt: Date;
  }[];
};

/**
 * Maps a Prisma product to frontend Product type
 */
export function mapPrismaProductToFrontend(
  prismaProduct: PrismaProductWithRelations
): Product {
  return {
    id: prismaProduct.id,
    title: prismaProduct.title,
    description: prismaProduct.description,
    price: prismaProduct.price,
    discount: prismaProduct.discount,
    stock: prismaProduct.stock,
    brand: prismaProduct.brand,
    category: prismaProduct.category,
    rating: prismaProduct.rating,
    reviewCount: prismaProduct.reviewCount,
    thumbnail: prismaProduct.thumbnail,
    // Convert images to string array
    images: prismaProduct.images.map(img => img.url),
    // Convert JSON fields
    options: prismaProduct.options ? JSON.parse(JSON.stringify(prismaProduct.options)) : undefined,
    specifications: prismaProduct.specifications ? JSON.parse(JSON.stringify(prismaProduct.specifications)) : undefined,
    // Convert arrays
    features: prismaProduct.features || [],
    tags: prismaProduct.tags || [],
    // Convert reviews
    reviews: prismaProduct.reviews.map(review => ({
      id: review.id,
      author: review.userId,
      rating: review.rating,
      title: review.title,
      comment: review.comment,
      date: review.createdAt.toISOString(),
      helpful: review.helpful,
      verifiedPurchase: review.verifiedPurchase,
    })),
    // Convert dates
    createdAt: prismaProduct.createdAt.toISOString(),
    updatedAt: prismaProduct.updatedAt.toISOString(),
  };
}

/**
 * Maps an array of Prisma products to frontend format
 */
export function mapPrismaProductsToFrontend(
  prismaProducts: PrismaProductWithRelations[]
): Product[] {
  return prismaProducts.map(mapPrismaProductToFrontend);
}