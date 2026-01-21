'use client';

import { clearCartAction } from '@/actions/cart-actions';
import { createOrderAction } from '@/actions/order-actions';
import { CartSummary } from '@/components/cart/cart-summary';
import { CheckoutSteps } from '@/components/checkout/checkout-steps';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CartItemWithProduct, UserWithRelations } from '@/lib/types';
import { formatPrice } from '@/lib/utils/formatters';
import { getProductImage } from '@/lib/utils/product-images';
import { Loader2, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, {
    memo,
    useCallback,
    useMemo,
    useState,
    useTransition,
} from 'react';
import { toast } from 'sonner';

interface ShippingInfo {
	firstName: string;
	lastName: string;
	address: string;
	city: string;
	state: string;
	zip: string;
}

interface PaymentInfo {
	cardNumber: string;
	nameOnCard: string;
	expiry: string;
	cvc: string;
}

interface MobileOrderSummaryProps {
	cart: CartItemWithProduct[];
	subtotal: number;
	shippingCost: number;
	taxes: number;
	discount: number;
	total: number;
}

const MobileOrderSummary = memo(
	({
		cart,
		subtotal,
		shippingCost,
		taxes,
		discount,
		total,
	}: MobileOrderSummaryProps) => (
		<div className='lg:hidden mb-8'>
			<Accordion type='single' collapsible className='w-full'>
				<AccordionItem value='order-summary' className='border rounded-lg'>
					<AccordionTrigger className='px-6 hover:no-underline'>
						<div className='flex items-center justify-between w-full pr-4'>
							<div className='flex items-center gap-2'>
								<ShoppingCart className='h-5 w-5' />
								<span className='font-medium'>Order Summary</span>
							</div>
							<span className='font-bold text-lg'>{formatPrice(total)}</span>
						</div>
					</AccordionTrigger>
					<AccordionContent className='px-6 pb-6'>
						<div className='border-t border-slate-200 dark:border-slate-800 pt-4'>
							<ul className='space-y-4 mb-4'>
								{cart.map((item) => (
									<li key={item.id} className='flex items-center gap-4'>
										<div className='w-16 h-16 flex shrink-0 relative rounded-md overflow-hidden border dark:border-slate-700'>
											<Image
												src={getProductImage(item.product)}
												alt={item.product.title}
												fill
												className='object-cover'
											/>
										</div>
										<div className='flex-1 min-w-0'>
											<p className='font-medium dark:text-white truncate'>
												{item.product.title}
											</p>
											<p className='text-sm text-slate-500 dark:text-slate-400'>
												Qty: {item.quantity}
											</p>
										</div>
										<p className='text-sm font-medium dark:text-white'>
											{formatPrice(item.product.price * item.quantity)}
										</p>
									</li>
								))}
							</ul>
							<CartSummary
								subtotal={subtotal}
								shipping={shippingCost}
								taxes={taxes}
								discount={discount}
								total={total}
							/>
						</div>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</div>
	)
);
MobileOrderSummary.displayName = 'MobileOrderSummary';

interface CheckoutClientProps {
	cartItems: CartItemWithProduct[];
	user: UserWithRelations | null;
}

export function CheckoutClient({ cartItems, user }: CheckoutClientProps) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	const [step, setStep] = useState(1);
	const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
		firstName: user?.name?.split(' ')[0] || '',
		lastName: user?.name?.split(' ')[1] || '',
		address: '',
		city: '',
		state: '',
		zip: '',
	});
	const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
		cardNumber: '',
		nameOnCard: '',
		expiry: '',
		cvc: '',
	});
	const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>(
		'standard'
	);

	const appliedCoupon = user?.coupon;

	const { subtotal, taxes, total, shippingCost, discount } = useMemo(() => {
		const subtotal = cartItems.reduce(
			(sum, item) => sum + item.product.price * item.quantity,
			0
		);

		let discount = 0;
		if (appliedCoupon) {
			if (appliedCoupon.type === 'PERCENTAGE') {
				discount = subtotal * (appliedCoupon.discount / 100);
			} else {
				discount = appliedCoupon.discount;
			}
		}

		const discountedSubtotal = subtotal - discount;
		const shippingCost =
			shippingMethod === 'express'
				? 15.0
				: discountedSubtotal > 50
				? 0
				: 5.0;
		const taxes = discountedSubtotal * 0.08;
		const total = discountedSubtotal + shippingCost + taxes;

		return { subtotal, taxes, total, shippingCost, discount };
	}, [cartItems, shippingMethod, appliedCoupon]);

	const handleShippingChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const { name, value } = e.target;
			setShippingInfo((prev) => ({ ...prev, [name]: value }));
		},
		[]
	);

	const handlePaymentChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const { name, value } = e.target;
			setPaymentInfo((prev) => ({ ...prev, [name]: value }));
		},
		[]
	);

	const isShippingValid = useMemo(
		() => Object.values(shippingInfo).every((field) => field.trim() !== ''),
		[shippingInfo]
	);

	const isPaymentValid = useMemo(
		() => Object.values(paymentInfo).every((field) => field.trim() !== ''),
		[paymentInfo]
	);

	const handleStepClick = useCallback((targetStep: number) => {
		setStep(targetStep);
	}, []);

	const handlePlaceOrder = useCallback(async () => {
		startTransition(async () => {
			const orderDetails = {
				items: cartItems.map((item) => ({
					productId: item.productId,
					quantity: item.quantity,
					price: item.product.price,
					title: item.product.title,
					thumbnail: getProductImage(item.product),
				})),
				total,
				subtotal,
				tax: taxes,
				shipping: shippingCost,
				discount,
				couponId: appliedCoupon?.id,
				shippingAddress: JSON.stringify({
					name: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
					street: shippingInfo.address,
					city: shippingInfo.city,
					state: shippingInfo.state,
					zip: shippingInfo.zip,
					country: 'USA',
				}),
				billingAddress: JSON.stringify({
					name: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
					street: shippingInfo.address,
					city: shippingInfo.city,
					state: shippingInfo.state,
					zip: shippingInfo.zip,
					country: 'USA',
				}),
				shippingMethod: JSON.stringify({
					method: shippingMethod,
					cost: shippingCost,
				}),
				paymentMethod: 'Credit Card', // Mocked
			};

			try {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const result = await createOrderAction(orderDetails as any);
				if (result.success && result.orderId) {
					await clearCartAction();
					toast.success('Order placed successfully!');
					router.push(`/order-confirmation?orderId=${result.orderId}`);
				} else {
					toast.error(result.message || 'Failed to place order.');
				}
			} catch (error) {
				toast.error('An unexpected error occurred.');
			}
		});
	}, [
		cartItems,
		total,
		subtotal,
		taxes,
		shippingCost,
		discount,
		appliedCoupon,
		shippingInfo,
		shippingMethod,
		router,
	]);

	return (
		<div className='bg-slate-50 min-h-[70vh] dark:bg-slate-900'>
			<div className='container mx-auto px-4 py-12'>
				<h1 className='text-3xl font-bold tracking-tight dark:text-white mb-2'>
					Checkout
				</h1>
				<p className='text-slate-600 dark:text-slate-400 mb-8'>
					Complete your purchase in {3 - step + 1}{' '}
					{3 - step + 1 === 1 ? 'step' : 'steps'}
				</p>

				<MobileOrderSummary
					cart={cartItems}
					subtotal={subtotal}
					shippingCost={shippingCost}
					taxes={taxes}
					discount={discount}
					total={total}
				/>

				<CheckoutSteps currentStep={step} onStepClick={handleStepClick} />

				<div className='mt-8 grid lg:grid-cols-3 gap-8'>
					<div className='lg:col-span-2 rounded-lg border bg-white p-6 shadow-sm dark:bg-slate-900 dark:border-slate-800'>
						{step === 1 && (
							<div>
								<h2 className='text-xl font-semibold dark:text-white mb-6'>
									Shipping Information
								</h2>
								<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
									<Input
										name='firstName'
										placeholder='First Name'
										value={shippingInfo.firstName}
										onChange={handleShippingChange}
										required
									/>
									<Input
										name='lastName'
										placeholder='Last Name'
										value={shippingInfo.lastName}
										onChange={handleShippingChange}
										required
									/>
									<Input
										name='address'
										placeholder='Street Address'
										className='sm:col-span-2'
										value={shippingInfo.address}
										onChange={handleShippingChange}
										required
									/>
									<Input
										name='city'
										placeholder='City'
										value={shippingInfo.city}
										onChange={handleShippingChange}
										required
									/>
									<Input
										name='state'
										placeholder='State'
										value={shippingInfo.state}
										onChange={handleShippingChange}
										required
									/>
									<Input
										name='zip'
										placeholder='ZIP Code'
										value={shippingInfo.zip}
										onChange={handleShippingChange}
										maxLength={5}
										required
									/>
								</div>
								<div className='mt-8'>
									<h3 className='text-lg font-semibold dark:text-white mb-4'>
										Shipping Method
									</h3>
									<div className='space-y-3'>
										<label className='flex items-center gap-3 cursor-pointer p-4 border-2 rounded-lg transition-all hover:border-slate-300 dark:hover:border-slate-600 has-:checked:border-blue-600 has-:checked:bg-blue-50 dark:has-:checked:bg-blue-900 dark:border-slate-700'>
											<input
												type='radio'
												name='shipping'
												value='standard'
												checked={shippingMethod === 'standard'}
												onChange={() => setShippingMethod('standard')}
												className='w-4 h-4 text-blue-600'
											/>
											<div className='flex-1'>
												<div className='flex items-center justify-between'>
													<p className='font-semibold text-slate-900 dark:text-white'>
														Standard Shipping
													</p>
													<p className='font-semibold text-slate-900 dark:text-white'>
														{shippingCost > 0 ? formatPrice(5.0) : 'Free'}
													</p>
												</div>
												<p className='text-sm text-slate-600 dark:text-slate-400 mt-1'>
													Delivery in 5-7 business days
												</p>
											</div>
										</label>
										<label className='flex items-center gap-3 cursor-pointer p-4 border-2 rounded-lg transition-all hover:border-slate-300 dark:hover:border-slate-600 has-:checked:border-blue-600 has-:checked:bg-blue-50 dark:has-:checked:bg-blue-900 dark:border-slate-700'>
											<input
												type='radio'
												name='shipping'
												value='express'
												checked={shippingMethod === 'express'}
												onChange={() => setShippingMethod('express')}
												className='w-4 h-4 text-blue-600'
											/>
											<div className='flex-1'>
												<div className='flex items-center justify-between'>
													<p className='font-semibold text-slate-900 dark:text-white'>
														Express Shipping
													</p>
													<p className='font-semibold text-slate-900 dark:text-white'>
														{formatPrice(15.0)}
													</p>
												</div>
												<p className='text-sm text-slate-600 dark:text-slate-400 mt-1'>
													Delivery in 2-3 business days
												</p>
											</div>
										</label>
									</div>
								</div>
								<Button
									size='lg'
									className='mt-8 w-full sm:w-auto'
									onClick={() => setStep(2)}
									disabled={!isShippingValid}
								>
									Continue to Payment
								</Button>
							</div>
						)}
						{step === 2 && (
							<div>
								<h2 className='text-xl font-semibold dark:text-white mb-6'>
									Payment Information
								</h2>
								<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
									<Input
										name='cardNumber'
										placeholder='Card Number'
										className='sm:col-span-2'
										value={paymentInfo.cardNumber}
										onChange={handlePaymentChange}
										maxLength={16}
										required
									/>
									<Input
										name='nameOnCard'
										placeholder='Name on Card'
										className='sm:col-span-2'
										value={paymentInfo.nameOnCard}
										onChange={handlePaymentChange}
										required
									/>
									<Input
										name='expiry'
										placeholder='MM/YY'
										value={paymentInfo.expiry}
										onChange={handlePaymentChange}
										maxLength={5}
										required
									/>
									<Input
										name='cvc'
										placeholder='CVC'
										value={paymentInfo.cvc}
										onChange={handlePaymentChange}
										maxLength={3}
										required
									/>
								</div>
								<div className='flex flex-col sm:flex-row gap-4 mt-8'>
									<Button
										variant='outline'
										size='lg'
										onClick={() => setStep(1)}
										className='w-full sm:w-auto'
									>
										Back
									</Button>
									<Button
										size='lg'
										onClick={() => setStep(3)}
										disabled={!isPaymentValid}
										className='w-full sm:flex-1'
									>
										Review Order
									</Button>
								</div>
							</div>
						)}
						{step === 3 && (
							<div>
								<h2 className='text-xl font-semibold dark:text-white mb-6'>
									Review Your Order
								</h2>
								<div className='space-y-4'>
									<div className='border rounded-lg p-4 dark:border-slate-700'>
										<div className='flex items-center justify-between mb-2'>
											<h3 className='font-semibold dark:text-white'>
												Shipping Address
											</h3>
											<Button
												variant='ghost'
												size='sm'
												onClick={() => setStep(1)}
											>
												Edit
											</Button>
										</div>
										<p className='text-slate-600 dark:text-slate-300 text-sm'>
											{shippingInfo.firstName} {shippingInfo.lastName}
											<br />
											{shippingInfo.address}
											<br />
											{shippingInfo.city}, {shippingInfo.state}{' '}
											{shippingInfo.zip}
										</p>
										<p className='text-sm text-slate-500 dark:text-slate-400 mt-2'>
											{shippingMethod === 'express'
												? 'Express'
												: 'Standard'}{' '}
											Shipping
										</p>
									</div>
									<div className='border rounded-lg p-4 dark:border-slate-700'>
										<div className='flex items-center justify-between mb-2'>
											<h3 className='font-semibold dark:text-white'>
												Payment Method
											</h3>
											<Button
												variant='ghost'
												size='sm'
												onClick={() => setStep(2)}
											>
												Edit
											</Button>
										</div>
										<p className='text-slate-600 dark:text-slate-300 text-sm'>
											{paymentInfo.nameOnCard}
											<br />
											Card ending in {paymentInfo.cardNumber.slice(-4)}
										</p>
									</div>
									<div className='border rounded-lg p-4 dark:border-slate-700'>
										<h3 className='font-semibold dark:text-white mb-4'>
											Order Items ({cartItems.length})
										</h3>
										<ul className='space-y-4'>
											{cartItems.map((item) => (
												<li
													key={item.id}
													className='flex items-center gap-4'
												>
													<div className='w-16 h-16 flex shrink-0 relative rounded-md overflow-hidden border dark:border-slate-700'>
														<Image
															src={getProductImage(item.product)}
															alt={item.product.title}
															fill
															className='object-cover'
														/>
													</div>
													<div className='flex-1 min-w-0'>
														<p className='font-medium dark:text-white truncate'>
															{item.product.title}
														</p>
														<p className='text-sm text-slate-500 dark:text-slate-400'>
															Qty: {item.quantity}
														</p>
													</div>
													<p className='text-sm font-semibold dark:text-white'>
														{formatPrice(
															item.product.price * item.quantity
														)}
													</p>
												</li>
											))}
										</ul>
									</div>
								</div>
								<div className='flex flex-col sm:flex-row gap-4 mt-8'>
									<Button
										variant='outline'
										size='lg'
										onClick={() => setStep(2)}
										disabled={isPending}
										className='w-full sm:w-auto'
									>
										Back
									</Button>
									<Button
										size='lg'
										className='bg-green-600 hover:bg-green-700 w-full sm:flex-1'
										onClick={handlePlaceOrder}
										disabled={isPending}
									>
										{isPending ? (
											<>
												<Loader2 className='mr-2 h-4 w-4 animate-spin' />
												Processing...
											</>
										) : (
											'Place Order'
										)}
									</Button>
								</div>
							</div>
						)}
					</div>
					<div className='hidden lg:block'>
						<CartSummary
							subtotal={subtotal}
							shipping={shippingCost}
							taxes={taxes}
							discount={discount}
							total={total}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
