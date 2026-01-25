'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { formatPrice } from '@/lib/utils/formatters';
import { ArrowRight, Lock, ShoppingBag, Truck } from 'lucide-react';
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
      console.log('Finalizing order...');
    } else {
      router.push('/checkout');
    }
  };

  const handleContinueShopping = () => {
    router.push('/products');
  };

  return (
    <div className='lg:h-full glass-card rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col'>
      <div className='p-4 sm:p-6 border-b border-border/50 bg-secondary/10'>
        <h2 className='text-base sm:text-xl font-bold flex items-center gap-2'>
          <ShoppingBag className='h-4 w-4 sm:h-5 sm:w-5 text-primary' />
          Order Summary
        </h2>
      </div>
      <div className='p-4 sm:p-6 space-y-4 sm:space-y-6 flex-1 flex flex-col'>
        <div className='space-y-2 sm:space-y-3'>
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
                <span className='inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold text-xs'>
                  <Truck className='h-3 w-3' />
                  Free
                </span>
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
          <span className='text-sm sm:text-base font-bold text-muted-foreground'>Total</span>
          <span className='text-2xl sm:text-3xl font-black tracking-tight text-primary'>
            {formatPrice(total)}
          </span>
        </div>

        {!isCheckout && (
          <div className='space-y-2 sm:space-y-3 pt-2'>
            <Button 
              size='lg' 
              className='btn-premium w-full h-11 sm:h-12 rounded-xl text-sm sm:text-base font-bold hover:shadow-primary/40' 
              onClick={handleCheckout}
            >
              <Lock className='h-4 w-4 mr-2' />
              Checkout
            </Button>
            <Button
              variant='outline'
              className='w-full h-10 sm:h-12 rounded-xl border-border/50 hover:bg-secondary/50 font-semibold text-sm'
              onClick={handleContinueShopping}
            >
              Continue Shopping
              <ArrowRight className='h-4 w-4 ml-2' />
            </Button>
          </div>
        )}

        {/* Spacer to push footer to bottom on lg */}
        <div className='flex-1' />

        <div className='bg-secondary/30 rounded-xl p-3 sm:p-4 text-[10px] sm:text-xs text-center text-muted-foreground border border-border/40 mt-auto'>
          <p className='font-medium'>Secure checkout · Free returns · 30-day guarantee</p>
        </div>
      </div>
    </div>
  );
}
