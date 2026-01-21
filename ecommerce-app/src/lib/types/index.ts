// types/index.ts
import {
    CartItem as PrismaCartItem,
    Coupon as PrismaCoupon,
    Order as PrismaOrder,
    Review as PrismaReview,
    User as PrismaUser,
} from '@prisma/client';

// Re-export Prisma types
export type User = PrismaUser;
export type Review = PrismaReview;
export type CartItem = PrismaCartItem;
export type Order = PrismaOrder;
export type Coupon = PrismaCoupon;

// Re-export all product types from product.ts
export * from './cart';
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

export type UserWithRelations = PrismaUser & {
  coupon?: PrismaCoupon | null;
};