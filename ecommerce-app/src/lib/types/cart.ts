import { CartItem as PrismaCartItem } from '@/generated/prisma/browser';
import { ProductWithRelations } from './product';

export type CartItemWithProduct = PrismaCartItem & {
  product: ProductWithRelations;
  
};
