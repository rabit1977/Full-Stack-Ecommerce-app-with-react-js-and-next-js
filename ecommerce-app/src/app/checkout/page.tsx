import { getCartAction } from '@/actions/cart-actions';
import { CheckoutClient } from './CheckoutClient';
import { CartItemWithProduct } from '@/lib/types/cart';
import { redirect } from 'next/navigation';

export default async function CheckoutPage() {
  const { items } = await getCartAction();

  if (items.length === 0) {
    // Redirect to cart page which will show an "empty" message
    // or just show an empty message here. Redirecting is cleaner.
    redirect('/cart');
  }

  // The type from getCartAction is already what CheckoutClient will need.
  const cartItems = items as CartItemWithProduct[];

  return <CheckoutClient cartItems={cartItems} />;
}