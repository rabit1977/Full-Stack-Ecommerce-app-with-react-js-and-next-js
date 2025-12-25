'use client';

import AuthGuard from '@/components/auth/auth-guard';
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
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { placeOrder } from '@/lib/store/thunks/managementThunks';
import { CartItem } from '@/lib/types';
import { formatPrice } from '@/lib/utils/formatters';
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
  cart: CartItem[];
  subtotal: number;
  shippingCost: number;
  taxes: number;
  total: number;
}

/**
 * Mobile collapsible order summary
 */
const MobileOrderSummary = memo(
  ({ cart, subtotal, shippingCost, taxes, total }: MobileOrderSummaryProps) => (
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
                  <li key={item.cartItemId} className='flex items-center gap-4'>
                    <div className='w-16 h-16 flex-shrink-0 relative rounded-md overflow-hidden border dark:border-slate-700'>
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className='object-cover'
                      />
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='font-medium dark:text-white truncate'>
                        {item.title}
                      </p>
                      <p className='text-sm text-slate-500 dark:text-slate-400'>
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className='text-sm font-medium dark:text-white'>
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </li>
                ))}
              </ul>
              <CartSummary
                subtotal={subtotal}
                shipping={shippingCost}
                taxes={taxes}
                total={total}
                isCollapsible
                showCheckoutButton={false}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
);

MobileOrderSummary.displayName = 'MobileOrderSummary';

/**
 * Checkout page component
 */
const CheckoutPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { cart } = useAppSelector((state) => state.cart);
  const [isPending, startTransition] = useTransition();

  // Form state
  const [step, setStep] = useState(1);
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: '',
    lastName: '',
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

  // Calculate totals
  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );
  const shippingCost = shippingMethod === 'express' ? 15.0 : 5.0;
  const taxes = subtotal * 0.08;
  const total = subtotal + shippingCost + taxes;

  // Form handlers
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

  // Validation
  const isShippingValid = useMemo(
    () => Object.values(shippingInfo).every((field) => field.trim() !== ''),
    [shippingInfo]
  );

  const isPaymentValid = useMemo(
    () => Object.values(paymentInfo).every((field) => field.trim() !== ''),
    [paymentInfo]
  );

  // Navigation
  const handleStepClick = useCallback((targetStep: number) => {
    setStep(targetStep);
  }, []);

  // Order placement
  const handlePlaceOrder = useCallback(async () => {
    const orderDetails = {
      items: cart,
      total,
      subtotal,
      shippingCost,
      taxes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      discountAmount: 0,
      shippingAddress: {
        name: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
        street: shippingInfo.address,
        city: shippingInfo.city,
        state: shippingInfo.state,
        zip: shippingInfo.zip,
        country: 'USA',
      },
      billingAddress: {
        name: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
        street: shippingInfo.address,
        city: shippingInfo.city,
        state: shippingInfo.state,
        zip: shippingInfo.zip,
        country: 'USA',
      },
      paymentMethod: 'Credit Card',
      shippingMethod,
      status: 'Pending' as const,
    };

    try {
      const result = await dispatch(placeOrder(orderDetails)).unwrap();
      if (result) {
        startTransition(() => {
          router.push(`/order-confirmation?orderId=${result}`);
        });
      }
    } catch (error) {
      console.error('Order placement failed:', error);
    }
  }, [
    cart,
    total,
    subtotal,
    shippingCost,
    taxes,
    shippingInfo,
    shippingMethod,
    dispatch,
    router,
  ]);

  // Empty cart check
  if (cart.length === 0) {
    return (
      <AuthGuard>
        <div className='container mx-auto px-4 py-16'>
          <div className='text-center'>
            <ShoppingCart className='mx-auto h-16 w-16 text-slate-300 dark:text-slate-600' />
            <h2 className='mt-4 text-2xl font-bold dark:text-white'>
              Your cart is empty
            </h2>
            <p className='mt-2 text-slate-600 dark:text-slate-400'>
              Add items to your cart before checking out
            </p>
            <Button onClick={() => router.push('/products')} className='mt-6'>
              Continue Shopping
            </Button>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
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
            cart={cart}
            subtotal={subtotal}
            shippingCost={shippingCost}
            taxes={taxes}
            total={total}
          />

          <CheckoutSteps currentStep={step} onStepClick={handleStepClick} />

          <div className='mt-8 grid lg:grid-cols-3 gap-8'>
            {/* Main Content */}
            <div className='lg:col-span-2 rounded-lg border bg-white p-6 shadow-sm dark:bg-slate-900 dark:border-slate-800'>
              {/* Step 1: Shipping */}
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

                  {/* Shipping Method */}
                  <div className='mt-8'>
                    <h3 className='text-lg font-semibold dark:text-white mb-4'>
                      Shipping Method
                    </h3>
                    <div className='space-y-3'>
                      <label className='flex items-center gap-3 cursor-pointer p-4 border-2 rounded-lg transition-all hover:border-slate-300 dark:hover:border-slate-600 has-[:checked]:border-blue-600 has-[:checked]:bg-blue-50 dark:has-[:checked]:bg-blue-900 dark:border-slate-700'>
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
                              {formatPrice(5.0)}
                            </p>
                          </div>
                          <p className='text-sm text-slate-600 dark:text-slate-400 mt-1'>
                            Delivery in 5-7 business days
                          </p>
                        </div>
                      </label>

                      <label className='flex items-center gap-3 cursor-pointer p-4 border-2 rounded-lg transition-all hover:border-slate-300 dark:hover:border-slate-600 has-[:checked]:border-blue-600 has-[:checked]:bg-blue-50 dark:has-[:checked]:bg-blue-900 dark:border-slate-700'>
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

              {/* Step 2: Payment */}
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

              {/* Step 3: Review */}
              {step === 3 && (
                <div>
                  <h2 className='text-xl font-semibold dark:text-white mb-6'>
                    Review Your Order
                  </h2>

                  <div className='space-y-4'>
                    {/* Shipping Info */}
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
                        {shippingMethod === 'express' ? 'Express' : 'Standard'}{' '}
                        Shipping
                      </p>
                    </div>

                    {/* Payment Info */}
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

                    {/* Order Items */}
                    <div className='border rounded-lg p-4 dark:border-slate-700'>
                      <h3 className='font-semibold dark:text-white mb-4'>
                        Order Items ({cart.length})
                      </h3>
                      <ul className='space-y-4'>
                        {cart.map((item) => (
                          <li
                            key={item.cartItemId}
                            className='flex items-center gap-4'
                          >
                            <div className='w-16 h-16 flex-shrink-0 relative rounded-md overflow-hidden border dark:border-slate-700'>
                              <Image
                                src={item.image}
                                alt={item.title || 'Product Image'}
                                fill
                                className='object-cover'
                              />
                            </div>
                            <div className='flex-1 min-w-0'>
                              <p className='font-medium dark:text-white truncate'>
                                {item.title}
                              </p>
                              <p className='text-sm text-slate-500 dark:text-slate-400'>
                                Qty: {item.quantity}
                              </p>
                            </div>
                            <p className='text-sm font-semibold dark:text-white'>
                              {formatPrice(item.price * item.quantity)}
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

            {/* Sidebar - Desktop Order Summary */}
            <div className='hidden lg:block'>
              <CartSummary
                subtotal={subtotal}
                shipping={shippingCost}
                taxes={taxes}
                total={total}
                showCheckoutButton={false}
              />
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
};

export default CheckoutPage;
