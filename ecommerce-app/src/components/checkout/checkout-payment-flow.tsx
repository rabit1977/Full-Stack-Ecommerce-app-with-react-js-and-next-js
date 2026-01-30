'use client';

import { clearCartAction } from '@/actions/cart-actions';
import { createOrderAction } from '@/actions/order-actions';
import { Button } from '@/components/ui/button';
import { CartItemWithProduct } from '@/lib/types';
import { cn } from '@/lib/utils'; // Ensure cn is imported or use template literal
import { formatPrice } from '@/lib/utils/formatters';
import { getProductImage } from '@/lib/utils/product-images';
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

interface CheckoutPaymentFlowProps {
  step: number;
  setStep: (step: number) => void;
  cartItems: CartItemWithProduct[];
  total: number;
  subtotal: number;
  taxes: number;
  shippingCost: number;
  discount: number;
  shippingMethod: string;
  appliedCoupon: any;
  shippingAddressData: any;
}

export function CheckoutPaymentFlow({
  step,
  setStep,
  cartItems,
  total,
  subtotal,
  taxes,
  shippingCost,
  discount,
  shippingMethod,
  appliedCoupon,
  shippingAddressData,
}: CheckoutPaymentFlowProps) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleReviewOrder = async () => {
      if (!stripe || !elements) return;

      // Validate payment details before moving to Review
      const { error: submitError } = await elements.submit();
      if (submitError) {
          setErrorMessage(submitError.message || 'Please complete payment details');
          return;
      }
      setErrorMessage(null);
      setStep(3);
  };

  const handlePlaceOrder = async () => {
    if (!stripe || !elements) return;

    startTransition(async () => {
      try {
        // Elements are already submitted/validated in Step 2.
        // We can confirm directly?
        // Actually confirming initiates the payment processing.

        // 2. Create Order in DB (Pending)
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
            paymentMethod: 'Credit Card (Stripe)',
        };

        const orderRes = await createOrderAction(orderDetails as any);
        if (!orderRes.success || !orderRes.orderId) {
             toast.error(orderRes.message || 'Failed to initialize order');
             return;
        }

        // 3. Confirm Payment
        const { error: confirmError } = await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: `${window.location.origin}/order-confirmation?orderId=${orderRes.orderId}`,
            payment_method_data: {
               billing_details: {
                  name: shippingAddressData.name,
                  address: {
                     city: shippingAddressData.city,
                     country: 'US',
                     line1: shippingAddressData.street,
                     postal_code: shippingAddressData.zip,
                     state: shippingAddressData.state
                  }
               }
            }
          },
        });

        if (confirmError) {
           toast.error(confirmError.message || 'Payment failed');
           setErrorMessage(confirmError.message ?? 'Payment failed');
           // You might want to delete the pending order here?
           // Or update it to 'Failed'. 
        } else {
           // Success redirects automatically
           await clearCartAction();
        }

      } catch (err) {
        console.error(err);
        toast.error('An unexpected error occurred');
      }
    });
  };

  return (
    <>
      {/* Step 2: Payment Information - Kept mounted but hidden if step 3 */}
      <div className={cn(
          "relative z-10 animate-in fade-in slide-in-from-right-4 duration-500",
          step !== 2 && "hidden"
      )}>
          <h2 className='text-2xl font-bold mb-8 flex items-center gap-3'>
            Payment Information
          </h2>
          
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-border/50">
             <PaymentElement />
          </div>
          {errorMessage && <p className="text-destructive text-sm mt-2">{errorMessage}</p>}

          <div className='flex flex-col sm:flex-row gap-4 mt-8'>
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
              onClick={handleReviewOrder}
              className='w-full sm:flex-1 h-12 rounded-xl font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40'
            >
              Review Order
            </Button>
          </div>
      </div>

      {/* Step 3: Review */}
      {step === 3 && (
        <div className="relative z-10 animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className='text-2xl font-bold mb-8 flex items-center gap-3'>
                Review Your Order
            </h2>
            <div className='space-y-6'>
                {/* Minimal Review */}
                <div className='group border border-border/50 rounded-2xl p-6 bg-secondary/10 hover:border-primary/30 transition-colors'>
                    <div className='flex items-center justify-between mb-4'>
                        <h3 className='font-bold flex items-center gap-2'>
                            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                            Shipping Address
                        </h3>
                        {/* Go back to Step 1 */}
                        <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => setStep(1)}
                            className="text-primary hover:text-primary hover:bg-primary/10"
                        >
                            Edit
                        </Button>
                    </div>
                    <div>
                         <p className='text-muted-foreground text-sm leading-relaxed'>
                            <span className="font-semibold text-foreground">{shippingAddressData.name}</span><br />
                            {shippingAddressData.street}<br />
                            {shippingAddressData.city}, {shippingAddressData.state} {shippingAddressData.zip}
                        </p>
                    </div>
                </div>

                {/* Edit Payment Button (Step 2) */}
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
                    <p className='text-sm text-muted-foreground'>Card entered</p>
                </div>


                <div className='border border-border/50 rounded-2xl p-6 bg-secondary/10'>
                     <h3 className='font-bold mb-6 flex items-center gap-2'>
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        Order Items ({cartItems.length})
                    </h3>
                    <div className="space-y-3">
                         {cartItems.map(item => (
                             <div key={item.id} className="flex gap-4 items-center">
                                 <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-background">
                                     <Image src={getProductImage(item.product)} alt={item.product.title} fill className="object-cover" />
                                 </div>
                                 <div className="flex-1 min-w-0">
                                     <p className="font-medium text-sm truncate">{item.product.title}</p>
                                     <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                                 </div>
                                 <div className="text-sm font-bold">{formatPrice(item.product.price * item.quantity)}</div>
                             </div>
                         ))}
                    </div>
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
                    disabled={isPending || !stripe || !elements}
                >
                    {isPending ? (
                        <>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                            Processing...
                        </>
                    ) : (
                        `Pay ${formatPrice(total)}`
                    )}
                </Button>
            </div>
        </div>
      )}
    </>
  );
}
