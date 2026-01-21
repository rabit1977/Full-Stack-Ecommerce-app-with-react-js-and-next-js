'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatPrice } from '@/lib/utils/formatters';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

interface CartSummaryProps {
  subtotal: number;
  discount?: number;
  shipping: number;
  taxes: number;
  total: number;
}

export function CartSummary({
  subtotal,
  discount = 0,
  shipping,
  taxes,
  total,
}: CartSummaryProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isCheckout = pathname.includes('/checkout');

  const handleCheckout = () => {
    if (isCheckout) {
      // In a real app, you'd trigger the final order placement here.
      // For this component, we'll just log it.
      console.log('Finalizing order...');
    } else {
      router.push('/checkout');
    }
  };

  const handleContinueShopping = () => {
    router.push('/products');
  };

  return (
    <Card className='sticky top-24'>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='flex justify-between text-sm'>
          <span className='text-slate-600 dark:text-slate-400'>Subtotal</span>
          <span className='font-medium dark:text-white'>
            {formatPrice(subtotal)}
          </span>
        </div>

        {discount > 0 && (
          <div className='flex justify-between text-sm'>
            <span className='text-slate-600 dark:text-slate-400'>Discount</span>
            <span className='font-medium text-green-600 dark:text-green-400'>
              -{formatPrice(discount)}
            </span>
          </div>
        )}

        <div className='flex justify-between text-sm'>
          <span className='text-slate-600 dark:text-slate-400'>Shipping</span>
          <span className='font-medium dark:text-white'>
            {shipping === 0 ? (
              <span className='text-green-600 dark:text-green-400'>Free</span>
            ) : (
              formatPrice(shipping)
            )}
          </span>
        </div>

        <div className='flex justify-between text-sm'>
          <span className='text-slate-600 dark:text-slate-400'>Taxes (8%)</span>
          <span className='font-medium dark:text-white'>
            {formatPrice(taxes)}
          </span>
        </div>

        <Separator />

        <div className='flex justify-between text-lg font-bold'>
          <span className='dark:text-white'>Total</span>
          <span className='dark:text-white'>{formatPrice(total)}</span>
        </div>

        {!isCheckout && (
          <>
            <Button size='lg' className='w-full' onClick={handleCheckout}>
              <ShoppingBag className='h-4 w-4 mr-2' />
              Proceed to Checkout
            </Button>
            <Button
              variant='outline'
              className='w-full'
              onClick={handleContinueShopping}
            >
              Continue Shopping
              <ArrowRight className='h-4 w-4 ml-2' />
            </Button>
          </>
        )}

        <div className='text-xs text-center text-slate-500 dark:text-slate-400'>
          Secure checkout · Free returns · 30-day guarantee
        </div>
      </CardContent>
    </Card>
  );
}
