import { CartItem as PrismaCartItem } from '@prisma/client';
import { ProductWithRelations } from './product';

export type CartItemWithProduct = PrismaCartItem & {
  product: ProductWithRelations;
};
