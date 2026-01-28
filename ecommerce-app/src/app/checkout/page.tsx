import { getCartAction } from '@/actions/cart-actions';
import { redirect } from 'next/navigation';
import { CheckoutContent } from './CheckoutContent';

export default async function CheckoutPage() {
	const { items, user } = await getCartAction();

	if (items.length === 0) {
		redirect('/cart');
	}

	return <CheckoutContent cartItems={items} user={user} />;
}