import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';

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

  return (
    <Card className='sticky top-24'>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* Subtotal */}
        <div className='flex justify-between text-sm'>
          <span className='text-slate-600 dark:text-slate-400'>Subtotal</span>
          <span className='font-medium dark:text-white'>
            ${subtotal.toFixed(2)}
          </span>
        </div>

        {/* Discount */}
        {discount > 0 && (
          <div className='flex justify-between text-sm'>
            <span className='text-slate-600 dark:text-slate-400'>
              Discount
            </span>
            <span className='font-medium text-green-600 dark:text-green-400'>
              -${discount.toFixed(2)}
            </span>
          </div>
        )}

        {/* Shipping */}
        <div className='flex justify-between text-sm'>
          <span className='text-slate-600 dark:text-slate-400'>Shipping</span>
          <span className='font-medium dark:text-white'>
            {shipping === 0 ? (
              <span className='text-green-600 dark:text-green-400'>Free</span>
            ) : (
              `$${shipping.toFixed(2)}`
            )}
          </span>
        </div>

        {/* Taxes */}
        <div className='flex justify-between text-sm'>
          <span className='text-slate-600 dark:text-slate-400'>
            Taxes (8%)
          </span>
          <span className='font-medium dark:text-white'>
            ${taxes.toFixed(2)}
          </span>
        </div>

        <Separator />

        {/* Total */}
        <div className='flex justify-between text-lg font-bold'>
          <span className='dark:text-white'>Total</span>
          <span className='dark:text-white'>${total.toFixed(2)}</span>
        </div>

        {/* Checkout Button */}
        <Button
          size='lg'
          className='w-full'
          onClick={() => router.push('/checkout')}
        >
          <ShoppingBag className='h-4 w-4 mr-2' />
          Proceed to Checkout
        </Button>

        {/* Additional Info */}
        <div className='text-xs text-center text-slate-500 dark:text-slate-400'>
          Secure checkout · Free returns · 30-day guarantee
        </div>
      </CardContent>
    </Card>
  );
}