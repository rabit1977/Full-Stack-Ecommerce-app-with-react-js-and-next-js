// types/index.ts
import {
  CartItem as PrismaCartItem,
  Order as PrismaOrder,
  Review as PrismaReview,
  User as PrismaUser,
} from '@prisma/client';

// Re-export Prisma types
export type User = PrismaUser;
export type Review = PrismaReview;
export type CartItem = PrismaCartItem;
export type Order = PrismaOrder;

// Re-export all product types from product.ts
export * from './product';

/**
 * Review with user relation
 */
export type ReviewWithUser = PrismaReview & {
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
};