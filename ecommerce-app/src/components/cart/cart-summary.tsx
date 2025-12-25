'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/utils/formatters';
import { useRouter } from 'next/navigation';
import { memo } from 'react';

interface CartSummaryProps {
  subtotal: number;
  shipping?: number;
  taxes?: number;
  discount?: number;
  total: number;
  isCollapsible?: boolean;
  showCheckoutButton?: boolean;
  onCheckout?: () => void;
}

/**
 * Cart summary component - displays order totals
 * Memoized to prevent unnecessary re-renders
 */
const CartSummary = memo(
  ({
    subtotal,
    shipping = 0,
    taxes = 0,
    discount = 0,
    total,
    isCollapsible = false,
    showCheckoutButton = true,
    onCheckout,
  }: CartSummaryProps) => {
    const router = useRouter();

    const handleCheckout = () => {
      if (onCheckout) {
        onCheckout();
      } else {
        router.push('/checkout');
      }
    };

    return (
      <div
        className={cn(
          'h-fit',
          !isCollapsible &&
            'rounded-lg border bg-white p-6 shadow-sm lg:sticky lg:top-24 dark:bg-slate-900 dark:border-slate-800'
        )}
      >
        {!isCollapsible && (
          <h2 className='text-lg font-semibold dark:text-white mb-6'>
            Order Summary
          </h2>
        )}

        <div
          className={cn(
            'space-y-3',
            !isCollapsible &&
              'border-b border-slate-200 dark:border-slate-800 pb-4'
          )}
        >
          {/* Subtotal */}
          <div className='flex items-center justify-between'>
            <p className='text-sm text-slate-600 dark:text-slate-300'>
              Subtotal
            </p>
            <p className='text-sm font-medium dark:text-white'>
              {formatPrice(subtotal)}
            </p>
          </div>

          {/* Shipping */}
          {shipping > 0 && (
            <div className='flex items-center justify-between'>
              <p className='text-sm text-slate-600 dark:text-slate-300'>
                Shipping
              </p>
              <p className='text-sm font-medium dark:text-white'>
                {formatPrice(shipping)}
              </p>
            </div>
          )}

          {/* Discount */}
          {discount > 0 && (
            <div className='flex items-center justify-between text-green-600 dark:text-green-400'>
              <p className='text-sm font-medium'>Discount</p>
              <p className='text-sm font-medium'>-{formatPrice(discount)}</p>
            </div>
          )}

          {/* Taxes */}
          {taxes > 0 && (
            <div className='flex items-center justify-between'>
              <p className='text-sm text-slate-600 dark:text-slate-300'>
                Estimated Tax
              </p>
              <p className='text-sm font-medium dark:text-white'>
                {formatPrice(taxes)}
              </p>
            </div>
          )}
        </div>

        {/* Total */}
        <div className='pt-4 flex items-center justify-between'>
          <p className='text-base font-semibold dark:text-white'>Total</p>
          <p className='text-xl font-bold dark:text-white'>
            {formatPrice(total)}
          </p>
        </div>

        {/* Checkout Button */}
        {!isCollapsible && showCheckoutButton && (
          <Button
            size='lg'
           className=' w-full mt-6 '
            onClick={handleCheckout}
            disabled={subtotal === 0}
          >
            Proceed to Checkout
          </Button>
        )}
      </div>
    );
  }
);

CartSummary.displayName = 'CartSummary';

export { CartSummary };
