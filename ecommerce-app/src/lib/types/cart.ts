import { CartItem as PrismaCartItem } from '@/generated/prisma/client';
import { ProductWithRelations } from './product';

export type CartItemWithProduct = PrismaCartItem & {
  product: ProductWithRelations;
  
};
