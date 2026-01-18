import { CartItem as PrismaCartItem, Product } from '@prisma/client';

export type CartItemWithProduct = PrismaCartItem & {
  product: Product;
};
