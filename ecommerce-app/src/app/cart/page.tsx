import { getCartAction } from '@/actions/cart-actions';
import { Suspense } from 'react';
import { CartClient } from './CartClient';
import { CartSkeleton } from './CartSkeleton';

export default async function CartPage() {
  const { items, savedForLater } = await getCartAction();

  // The items from getCartAction now include the full product object.
  // No need to fetch product details separately.
  // The types should be compatible with what CartClient expects.

  return (
    <Suspense fallback={<CartSkeleton />}>
      <CartClient cartItems={items} savedForLaterItems={savedForLater} />
    </Suspense>
  );
}