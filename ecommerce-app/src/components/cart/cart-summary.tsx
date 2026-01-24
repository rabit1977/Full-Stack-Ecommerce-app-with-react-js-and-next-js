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
    <Card className='sticky top-24 border-border shadow-lg bg-card/80 backdrop-blur-sm'>
      <CardHeader className='pb-4 border-b border-border/50 bg-secondary/20'>
        <CardTitle className='text-xl font-bold'>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className='space-y-6 pt-6'>
        <div className='space-y-3'>
          <div className='flex justify-between text-sm'>
            <span className='text-muted-foreground'>Subtotal</span>
            <span className='font-semibold text-foreground'>
              {formatPrice(subtotal)}
            </span>
          </div>

          {discount > 0 && (
            <div className='flex justify-between text-sm'>
              <span className='text-muted-foreground'>Discount</span>
              <span className='font-semibold text-green-600 dark:text-green-400'>
                -{formatPrice(discount)}
              </span>
            </div>
          )}

          <div className='flex justify-between text-sm'>
            <span className='text-muted-foreground'>Shipping</span>
            <span className='font-semibold text-foreground'>
              {shipping === 0 ? (
                <span className='text-green-600 dark:text-green-400 font-bold tracking-wide'>Free</span>
              ) : (
                formatPrice(shipping)
              )}
            </span>
          </div>

          <div className='flex justify-between text-sm'>
            <span className='text-muted-foreground'>Taxes (8%)</span>
            <span className='font-semibold text-foreground'>
              {formatPrice(taxes)}
            </span>
          </div>
        </div>

        <Separator className='bg-border/60' />

        <div className='flex justify-between items-end'>
          <span className='text-base font-semibold text-muted-foreground'>Total</span>
          <span className='text-2xl font-black tracking-tight text-primary'>
            {formatPrice(total)}
          </span>
        </div>

        {!isCheckout && (
          <div className='space-y-3 pt-2'>
            <Button size='lg' className='w-full h-12 text-base font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-95' onClick={handleCheckout}>
              <ShoppingBag className='h-4 w-4 mr-2' />
              Proceed to Checkout
            </Button>
            <Button
              variant='outline'
              className='w-full h-11 border-border/60 hover:bg-secondary/50'
              onClick={handleContinueShopping}
            >
              Continue Shopping
              <ArrowRight className='h-4 w-4 ml-2' />
            </Button>
          </div>
        )}

        <div className='bg-secondary/30 rounded-lg p-3 text-xs text-center text-muted-foreground border border-border/40'>
          <p>Secure checkout · Free returns · 30-day guarantee</p>
        </div>
      </CardContent>
    </Card>
  );
}
