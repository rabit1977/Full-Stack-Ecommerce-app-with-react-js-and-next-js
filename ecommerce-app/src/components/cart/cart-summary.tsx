'use client';

import { Button } from '@/components/ui/button';
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
    <div className='sticky top-24 glass-card rounded-3xl overflow-hidden'>
      <div className='p-6 border-b border-border/50 bg-secondary/10'>
        <h2 className='text-xl font-bold flex items-center gap-2'>
          <ShoppingBag className="h-5 w-5 text-primary" />
          Order Summary
        </h2>
      </div>
      <div className='p-6 space-y-6'>
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
              <span className='font-semibold text-emerald-600 dark:text-emerald-400'>
                -{formatPrice(discount)}
              </span>
            </div>
          )}

          <div className='flex justify-between text-sm'>
            <span className='text-muted-foreground'>Shipping</span>
            <span className='font-semibold text-foreground'>
              {shipping === 0 ? (
                <span className='text-emerald-600 dark:text-emerald-400 font-bold tracking-wide uppercase text-xs border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/[0.5]'>Free</span>
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

        <Separator className='bg-border/50' />

        <div className='flex justify-between items-end'>
          <span className='text-base font-bold text-muted-foreground'>Total</span>
          <span className='text-3xl font-black tracking-tight text-primary'>
            {formatPrice(total)}
          </span>
        </div>

        {!isCheckout && (
          <div className='space-y-3 pt-2'>
            <Button size='lg' className='btn-premium w-full h-12 rounded-xl text-base font-bold hover:shadow-primary/40' onClick={handleCheckout}>
              Proceed to Checkout
            </Button>
            <Button
              variant='outline'
              className='w-full h-12 rounded-xl border-border/50 hover:bg-secondary/50 font-semibold'
              onClick={handleContinueShopping}
            >
              Continue Shopping
              <ArrowRight className='h-4 w-4 ml-2' />
            </Button>
          </div>
        )}

        <div className='bg-secondary/30 rounded-xl p-4 text-xs text-center text-muted-foreground border border-border/40 flex flex-col gap-2'>
           <div className="flex justify-center gap-3 opacity-70 mb-1">
              <div className="h-1 w-8 bg-foreground/20 rounded-full" />
              <div className="h-1 w-8 bg-foreground/20 rounded-full" />
              <div className="h-1 w-8 bg-foreground/20 rounded-full" />
           </div>
          <p className="font-medium">Secure checkout · Free returns · 30-day guarantee</p>
        </div>
      </div>
    </div>
  );
}
