'use client';

import { createPaymentIntentAction, updatePaymentIntentAction } from '@/actions/payment-actions';
import { CartSummary } from '@/components/cart/cart-summary';
import { AddressSelector } from '@/components/checkout/AddressSelector';
import { CheckoutPaymentFlow } from '@/components/checkout/checkout-payment-flow';
import { CheckoutSteps } from '@/components/checkout/checkout-steps';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Address } from '@/generated/prisma/browser';
import { CartItemWithProduct, UserWithRelations } from '@/lib/types';
import { formatPrice } from '@/lib/utils/formatters';
import { getProductImage } from '@/lib/utils/product-images';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
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

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
	// Should throw or warn
	console.error("Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY");
}
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface ShippingInfo {
	firstName: string;
	lastName: string;
	address: string;
	city: string;
	state: string;
	zip: string;
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

interface CheckoutContentProps {
	cartItems: CartItemWithProduct[];
	user: UserWithRelations | null;
}

export function CheckoutContent({ cartItems, user }: CheckoutContentProps) {
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
	const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>(
		'standard'
	);

    // Stripe State
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);

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

	const isShippingValid = useMemo(
		() => {
			// If using saved address, just check if one is selected
			if (!useManualAddress && selectedAddress) return true;
			// Otherwise validate manual form
			return Object.values(shippingInfo).every((field) => field.trim() !== '');
		},
		[shippingInfo, selectedAddress, useManualAddress]
	);

	const handleStepClick = useCallback((targetStep: number) => {
        if (targetStep > step) return; // Prevent skipping forward
		setStep(targetStep);
	}, [step]);

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


    const handleContinueToPayment = async () => {
        startTransition(async () => {
            try {
                if (paymentIntentId) {
                    await updatePaymentIntentAction(paymentIntentId, total);
                } else {
                    const res = await createPaymentIntentAction(total);
                    if (res.success && res.clientSecret) {
                         setClientSecret(res.clientSecret);
                         if (res.paymentIntentId) setPaymentIntentId(res.paymentIntentId);
                    } else {
                        toast.error(res.error || "Failed to initialize payment");
                        return;
                    }
                }
                setStep(2);
            } catch (e) {
                toast.error("An error occurred");
                console.error(e);
            }
        });
    }

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
										onClick={handleContinueToPayment}
										disabled={!isShippingValid || isPending}
									>
                                        {isPending ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Preparing Payment...
                                            </>
                                        ) : (
                                            'Continue to Payment'
                                        )}
									</Button>
								</div>
							)}
                            
                            {/* STRIPE PAYMENT FLOW */}
                            {(step === 2 || step === 3) && clientSecret && (
                                <Elements stripe={stripePromise} options={{ 
                                    clientSecret, 
                                    appearance: { 
                                        theme: 'stripe', // 'night', 'flat' etc.
                                        variables: {
                                            colorPrimary: '#6366f1', // Indigo-500
                                        }
                                    } 
                                }}>
                                    <CheckoutPaymentFlow 
                                        step={step}
                                        setStep={setStep}
                                        cartItems={cartItems}
                                        total={total}
                                        subtotal={subtotal}
                                        taxes={taxes}
                                        shippingCost={shippingCost}
                                        discount={discount}
                                        shippingMethod={shippingMethod}
                                        appliedCoupon={appliedCoupon}
                                        shippingAddressData={getShippingAddressData()}
                                    />
                                </Elements>
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
