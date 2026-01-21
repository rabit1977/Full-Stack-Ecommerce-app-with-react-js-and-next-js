import { getCartAction } from '@/actions/cart-actions';
import { Suspense } from 'react';
import { CartClient } from './CartClient';
import { CartSkeleton } from './CartSkeleton';

export default async function CartPage() {
	const { items, savedForLater, user } = await getCartAction();

	return (
		<Suspense fallback={<CartSkeleton />}>
			<CartClient
				cartItems={items}
				savedForLaterItems={savedForLater}
				user={user}
			/>
		</Suspense>
	);
}