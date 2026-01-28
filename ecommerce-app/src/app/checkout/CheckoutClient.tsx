'use client';

import { clearCartAction } from '@/actions/cart-actions';
import { createOrderAction } from '@/actions/order-actions';
import { CartSummary } from '@/components/cart/cart-summary';
import { AddressSelector } from '@/components/checkout/AddressSelector';
import { CheckoutSteps } from '@/components/checkout/checkout-steps';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Address } from '@/generated/prisma/client';
import { CartItemWithProduct, UserWithRelations } from '@/lib/types';
import { formatPrice } from '@/lib/utils/formatters';
import { getProductImage } from '@/lib/utils/product-images';
import { Edit2, Loader2, MapPin, ShoppingCart } from 'lucide-react';
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
	const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
	const [useManualAddress, setUseManualAddress] = useState(false);
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
		() => {
			// If using saved address, just check if one is selected
			if (!useManualAddress && selectedAddress) return true;
			// Otherwise validate manual form
			return Object.values(shippingInfo).every((field) => field.trim() !== '');
		},
		[shippingInfo, selectedAddress, useManualAddress]
	);

	const isPaymentValid = useMemo(
		() => Object.values(paymentInfo).every((field) => field.trim() !== ''),
		[paymentInfo]
	);

	const handleStepClick = useCallback((targetStep: number) => {
		setStep(targetStep);
	}, []);

	// Build shipping address from either saved address or manual form
	const getShippingAddressData = useCallback(() => {
		if (!useManualAddress && selectedAddress) {
			return {
				name: `${selectedAddress.firstName} ${selectedAddress.lastName}`,
				street: selectedAddress.street1 + (selectedAddress.street2 ? `, ${selectedAddress.street2}` : ''),
				city: selectedAddress.city,
				state: selectedAddress.state,
				zip: selectedAddress.postalCode,
				country: selectedAddress.country,
				phone: selectedAddress.phone,
				deliveryInstructions: selectedAddress.deliveryInstructions,
			};
		}
		return {
			name: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
			street: shippingInfo.address,
			city: shippingInfo.city,
			state: shippingInfo.state,
			zip: shippingInfo.zip,
			country: 'USA',
		};
	}, [selectedAddress, shippingInfo, useManualAddress]);

	const handlePlaceOrder = useCallback(async () => {
		startTransition(async () => {
			const shippingAddressData = getShippingAddressData();
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
				shippingAddress: JSON.stringify(shippingAddressData),
				billingAddress: JSON.stringify(shippingAddressData),
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
			} catch {
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
		shippingMethod,
		router,
		getShippingAddressData,
	]);

	return (
		<div className='bg-slate-50 min-h-[80vh] dark:bg-slate-950/50'>
			<div className='container-wide py-10 sm:py-16'>
				<div className="mb-10 text-center sm:text-left">
					<h1 className='text-3xl sm:text-5xl font-black tracking-tight text-foreground mb-4'>
						Checkout
					</h1>
					<p className='text-xl text-muted-foreground'>
						Complete your purchase in {3 - step + 1}{' '}
						{3 - step + 1 === 1 ? 'step' : 'steps'}
					</p>
				</div>

				<MobileOrderSummary
					cart={cartItems}
					subtotal={subtotal}
					shippingCost={shippingCost}
					taxes={taxes}
					discount={discount}
					total={total}
				/>

				<CheckoutSteps currentStep={step} onStepClick={handleStepClick} />

				<div className='mt-8 grid lg:grid-cols-12 gap-8'>
					<div className='lg:col-span-8 space-y-8'>
						<div className='glass-card p-8 rounded-3xl relative overflow-hidden'>
               <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
               
							{step === 1 && (
								<div className="relative z-10 animate-in fade-in slide-in-from-right-4 duration-500">
									<h2 className='text-2xl font-bold mb-8 flex items-center gap-3'>
                              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold">1</span>
										Shipping Information
									</h2>

									{/* Saved Address Selector - Only show for logged in users */}
									{user && !useManualAddress && (
										<div className="space-y-4 mb-6">
											<div className="flex items-center justify-between">
												<h3 className="text-lg font-semibold flex items-center gap-2">
													<MapPin className="w-4 h-4 text-primary" />
													Saved Addresses
												</h3>
												<Button
													variant="ghost"
													size="sm"
													onClick={() => setUseManualAddress(true)}
													className="text-muted-foreground hover:text-foreground"
												>
													<Edit2 className="w-4 h-4 mr-1" />
													Enter manually
												</Button>
											</div>
											<AddressSelector
												selectedAddress={selectedAddress}
												onSelect={setSelectedAddress}
												addressType="SHIPPING"
											/>
										</div>
									)}

									{/* Manual Address Form - Show if not logged in or user chose manual entry */}
									{(!user || useManualAddress) && (
										<div className="space-y-4">
											{user && useManualAddress && (
												<div className="flex items-center justify-between mb-4">
													<h3 className="text-lg font-semibold">Enter New Address</h3>
													<Button
														variant="ghost"
														size="sm"
														onClick={() => setUseManualAddress(false)}
														className="text-muted-foreground hover:text-foreground"
													>
														<MapPin className="w-4 h-4 mr-1" />
														Use saved address
													</Button>
												</div>
											)}
											<div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
												<Input
													name='firstName'
													placeholder='First Name'
													value={shippingInfo.firstName}
													onChange={handleShippingChange}
													required
													className="h-12 rounded-xl bg-secondary/30 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all font-medium"
												/>
												<Input
													name='lastName'
													placeholder='Last Name'
													value={shippingInfo.lastName}
													onChange={handleShippingChange}
													required
													className="h-12 rounded-xl bg-secondary/30 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all font-medium"
												/>
												<Input
													name='address'
													placeholder='Street Address'
													className='sm:col-span-2 h-12 rounded-xl bg-secondary/30 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all font-medium'
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
													className="h-12 rounded-xl bg-secondary/30 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all font-medium"
												/>
												<Input
													name='state'
													placeholder='State'
													value={shippingInfo.state}
													onChange={handleShippingChange}
													required
													className="h-12 rounded-xl bg-secondary/30 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all font-medium"
												/>
												<Input
													name='zip'
													placeholder='ZIP Code'
													value={shippingInfo.zip}
													onChange={handleShippingChange}
													maxLength={5}
													required
													className="h-12 rounded-xl bg-secondary/30 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all font-medium"
												/>
											</div>
										</div>
									)}
									<div className='mt-10'>
										<h3 className='text-lg font-bold mb-6 flex items-center gap-2'>
                                 <span className="w-1.5 h-6 bg-primary rounded-full" />
											Shipping Method
										</h3>
										<div className='grid sm:grid-cols-2 gap-4'>
											<label className={`relative flex items-start gap-4 cursor-pointer p-6 rounded-2xl border-2 transition-all duration-300 ${shippingMethod === 'standard' ? 'border-primary bg-primary/5 shadow-lg shadow-primary/5' : 'border-border bg-secondary/10 hover:border-primary/30'}`}>
												<input
													type='radio'
													name='shipping'
													value='standard'
													checked={shippingMethod === 'standard'}
													onChange={() => setShippingMethod('standard')}
													className='sr-only'
												/>
                                    <div className={`mt-1 flex items-center justify-center w-5 h-5 rounded-full border-2 transition-all ${shippingMethod === 'standard' ? 'border-primary' : 'border-muted-foreground'}`}>
                                       {shippingMethod === 'standard' && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                                    </div>
												<div className='flex-1'>
													<div className='flex items-center justify-between mb-1'>
														<p className='font-bold text-foreground'>
															Standard
														</p>
														<p className='font-bold text-primary'>
															{shippingCost > 0 ? formatPrice(5.0) : 'Free'}
														</p>
													</div>
													<p className='text-sm text-muted-foreground font-medium'>
														Delivery in 5-7 business days
													</p>
												</div>
											</label>

											<label className={`relative flex items-start gap-4 cursor-pointer p-6 rounded-2xl border-2 transition-all duration-300 ${shippingMethod === 'express' ? 'border-primary bg-primary/5 shadow-lg shadow-primary/5' : 'border-border bg-secondary/10 hover:border-primary/30'}`}>
												<input
													type='radio'
													name='shipping'
													value='express'
													checked={shippingMethod === 'express'}
													onChange={() => setShippingMethod('express')}
													className='sr-only'
												/>
                                    <div className={`mt-1 flex items-center justify-center w-5 h-5 rounded-full border-2 transition-all ${shippingMethod === 'express' ? 'border-primary' : 'border-muted-foreground'}`}>
                                       {shippingMethod === 'express' && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                                    </div>
												<div className='flex-1'>
													<div className='flex items-center justify-between mb-1'>
														<p className='font-bold text-foreground'>
															Express
														</p>
														<p className='font-bold text-primary'>
															{formatPrice(15.0)}
														</p>
													</div>
													<p className='text-sm text-muted-foreground font-medium'>
														Delivery in 2-3 business days
													</p>
												</div>
											</label>
										</div>
									</div>
									<Button
										size='lg'
										className='mt-10 w-full sm:w-auto h-12 px-8 rounded-xl font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] transition-all'
										onClick={() => setStep(2)}
										disabled={!isShippingValid}
									>
										Continue to Payment
									</Button>
								</div>
							)}
							{step === 2 && (
								<div className="relative z-10 animate-in fade-in slide-in-from-right-4 duration-500">
									<h2 className='text-2xl font-bold mb-8 flex items-center gap-3'>
                              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold">2</span>
										Payment Information
									</h2>
									<div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
										<Input
											name='cardNumber'
											placeholder='Card Number'
											className='sm:col-span-2 h-12 rounded-xl bg-secondary/30 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all font-medium font-mono'
											value={paymentInfo.cardNumber}
											onChange={handlePaymentChange}
											maxLength={16}
											required
										/>
										<Input
											name='nameOnCard'
											placeholder='Name on Card'
											className='sm:col-span-2 h-12 rounded-xl bg-secondary/30 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all font-medium'
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
                                 className="h-12 rounded-xl bg-secondary/30 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all font-medium font-mono"
										/>
										<Input
											name='cvc'
											placeholder='CVC'
											value={paymentInfo.cvc}
											onChange={handlePaymentChange}
											maxLength={3}
											required
                                 className="h-12 rounded-xl bg-secondary/30 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all font-medium font-mono"
										/>
									</div>
									<div className='flex flex-col sm:flex-row gap-4 mt-10'>
										<Button
											variant='outline'
											size='lg'
											onClick={() => setStep(1)}
											className='w-full sm:w-auto h-12 rounded-xl font-medium border-border/50'
										>
											Back
										</Button>
										<Button
											size='lg'
											onClick={() => setStep(3)}
											disabled={!isPaymentValid}
											className='w-full sm:flex-1 h-12 rounded-xl font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40'
										>
											Review Order
										</Button>
									</div>
								</div>
							)}
							{step === 3 && (
								<div className="relative z-10 animate-in fade-in slide-in-from-right-4 duration-500">
									<h2 className='text-2xl font-bold mb-8 flex items-center gap-3'>
                              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold">3</span>
										Review Your Order
									</h2>
									<div className='space-y-6'>
										<div className='group border border-border/50 rounded-2xl p-6 bg-secondary/10 hover:border-primary/30 transition-colors'>
											<div className='flex items-center justify-between mb-4'>
												<h3 className='font-bold flex items-center gap-2'>
                                       <span className="w-1.5 h-1.5 rounded-full bg-primary" />
													Shipping Address
												</h3>
												<Button
													variant='ghost'
													size='sm'
													onClick={() => setStep(1)}
                                       className="text-primary hover:text-primary hover:bg-primary/10"
												>
													Edit
												</Button>
											</div>
											{(() => {
												const addr = getShippingAddressData();
												return (
													<>
														<p className='text-muted-foreground text-sm leading-relaxed pl-3.5 border-l-2 border-border/50 ml-0.5'>
															<span className="font-semibold text-foreground">{addr.name}</span>
															<br />
															{addr.street}
															<br />
															{addr.city}, {addr.state} {addr.zip}
															<br />
															{addr.country}
														</p>
														<p className='text-sm text-primary font-medium mt-3 pl-4 flex items-center gap-2'>
															<span className="w-1 h-1 rounded-full bg-primary/50" />
															{shippingMethod === 'express' ? 'Express' : 'Standard'} Shipping
														</p>
													</>
												);
											})()}
										</div>
										<div className='group border border-border/50 rounded-2xl p-6 bg-secondary/10 hover:border-primary/30 transition-colors'>
											<div className='flex items-center justify-between mb-4'>
												<h3 className='font-bold flex items-center gap-2'>
                                       <span className="w-1.5 h-1.5 rounded-full bg-primary" />
													Payment Method
												</h3>
												<Button
													variant='ghost'
													size='sm'
													onClick={() => setStep(2)}
                                       className="text-primary hover:text-primary hover:bg-primary/10"
												>
													Edit
												</Button>
											</div>
											<p className='text-muted-foreground text-sm pl-3.5 border-l-2 border-border/50 ml-0.5'>
                                    <span className="font-semibold text-foreground">{paymentInfo.nameOnCard}</span>
												<br />
												Card ending in <span className="font-mono">{paymentInfo.cardNumber.slice(-4)}</span>
											</p>
										</div>
										<div className='border border-border/50 rounded-2xl p-6 bg-secondary/10'>
											<h3 className='font-bold mb-6 flex items-center gap-2'>
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
												Order Items ({cartItems.length})
											</h3>
											<ul className='space-y-4'>
												{cartItems.map((item) => (
													<li
														key={item.id}
														className='flex items-center gap-4 py-2'
													>
														<div className='w-16 h-16 flex shrink-0 relative rounded-xl overflow-hidden border border-border/50'>
															<Image
																src={getProductImage(item.product)}
																alt={item.product.title}
																fill
																className='object-cover'
															/>
														</div>
														<div className='flex-1 min-w-0'>
															<p className='font-bold text-foreground truncate'>
																{item.product.title}
															</p>
															<p className='text-sm text-muted-foreground font-medium'>
																Qty: {item.quantity}
															</p>
														</div>
														<p className='text-sm font-bold text-foreground'>
															{formatPrice(
																item.product.price * item.quantity
															)}
														</p>
													</li>
												))}
											</ul>
										</div>
									</div>
									<div className='flex flex-col sm:flex-row gap-4 mt-10'>
										<Button
											variant='outline'
											size='lg'
											onClick={() => setStep(2)}
											disabled={isPending}
											className='w-full sm:w-auto h-12 rounded-xl font-medium border-border/50'
										>
											Back
										</Button>
										<Button
											size='lg'
											className='btn-premium w-full sm:flex-1 h-12 rounded-xl font-bold hover:shadow-primary/40'
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
					</div>
					<div className='hidden lg:block lg:col-span-4'>
                  <div className="sticky top-24">
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
		</div>
	);
}
