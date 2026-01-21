import { getCartAction } from '@/actions/cart-actions';
import { redirect } from 'next/navigation';
import { CheckoutClient } from './CheckoutClient';

export default async function CheckoutPage() {
	const { items, user } = await getCartAction();

	if (items.length === 0) {
		redirect('/cart');
	}

	return <CheckoutClient cartItems={items} user={user} />;
}