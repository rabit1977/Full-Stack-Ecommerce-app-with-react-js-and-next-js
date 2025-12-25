'use client';

import { CartItem } from '@/components/cart/cart-item';
import { CartSummary } from '@/components/cart/cart-summary';
import { SavedItem } from '@/components/cart/saved-item';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { clearCart } from '@/lib/store/slices/cartSlice';
import { ArrowLeft, Package, ShoppingCart, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Suspense, useMemo, useTransition } from 'react';
import { toast } from 'sonner';

/**
 * Cart skeleton loader
 */
function CartSkeleton() {
  return (
    <div className='space-y-8'>
      <Skeleton className='h-8 w-48' />
      <div className='grid lg:grid-cols-3 gap-8'>
        <div className='lg:col-span-2 space-y-4'>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className='h-32 w-full' />
          ))}
        </div>
        <Skeleton className='h-96' />
      </div>
    </div>
  );
}

/**
 * Empty cart state
 */
function EmptyCart() {
  const router = useRouter();

  return (
    <div className='container  mx-auto px-4'>
      <div className='flex flex-col items-center py-30 min-h-[calc(100lvh-440px)]   text-center space-y-6'>
        <div className='relative'>
          <div className='absolute inset-0 bg-slate-100 dark:bg-slate-800 rounded-full blur-3xl opacity-50' />
          <ShoppingCart className='relative h-24 w-24 text-slate-300 dark:text-slate-600' />
        </div>
        <div className='space-y-2'>
          <h2 className='text-3xl font-bold dark:text-white'>
            Your cart is empty
          </h2>
          <p className='text-slate-600 dark:text-slate-400 max-w-md'>
            Looks like you haven&apos;t added anything to your cart yet. Start
            exploring our products!
          </p>
        </div>
        <div className='flex flex-col sm:flex-row gap-4'>
          <Button size='lg' onClick={() => router.push('/products')}>
            <Package className='h-4 w-4 mr-2' />
            Browse Products
          </Button>
          <Button variant='outline' size='lg' onClick={() => router.push('/')}>
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * Cart page content
 */
function CartContent() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isPending, startTransition] = useTransition();
  const { cart, savedForLater } = useAppSelector((state) => state.cart);

  // Calculate totals
  const { subtotal, taxes, shipping, total, itemCount } = useMemo(() => {
    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const shipping = subtotal > 50 ? 0 : 5.0; // Free shipping over $50
    const taxes = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + taxes;
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    return { subtotal, taxes, shipping, total, itemCount };
  }, [cart]);

  // Handle clear cart
  const handleClearCart = () => {
    startTransition(() => {
      dispatch(clearCart());
      toast.success('Cart cleared successfully');
    });
  };

  if (cart.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className='bg-slate-50 min-h-[70vh] dark:bg-slate-900'>
      <div className='container mx-auto px-4 py-12'>
        {/* Header */}
        <div className='flex items-center justify-between mb-8'>
          <div className='space-y-1'>
            <div className='flex items-center gap-3'>
              <Button
                variant='ghost'
                size='icon'
                onClick={() => router.push('/products')}
                className='hover:bg-slate-100 dark:hover:bg-slate-800'
              >
                <ArrowLeft className='h-5 w-5' />
              </Button>
              <h1 className='text-3xl font-bold tracking-tight dark:text-white'>
                Shopping Cart
              </h1>
            </div>
            <p className='text-slate-600 dark:text-slate-400 ml-12'>
              {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>

          {/* Clear Cart Button */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant='outline' size='sm' disabled={isPending}>
                <Trash2 className='h-4 w-4 mr-2' />
                Clear Cart
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear Cart</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to remove all items from your cart? This
                  action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleClearCart}>
                  Clear Cart
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Free Shipping Banner */}
        {subtotal > 0 && subtotal < 50 && (
          <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 dark:bg-blue-950 dark:border-blue-900'>
            <p className='text-sm text-blue-800 dark:text-blue-200'>
              <span className='font-semibold'>Almost there!</span> Add $
              {(50 - subtotal).toFixed(2)} more to get free shipping!
            </p>
          </div>
        )}

        {subtotal >= 50 && (
          <div className='bg-green-50 border border-green-200 rounded-lg p-4 mb-8 dark:bg-green-950 dark:border-green-900'>
            <p className='text-sm text-green-800 dark:text-green-200 font-medium'>
              🎉 You&apos;ve qualified for free shipping!
            </p>
          </div>
        )}

        <div className='grid lg:grid-cols-3 gap-8'>
          {/* Cart Items */}
          <div className='lg:col-span-2 '>
            <Card>
              <CardHeader className=' border-b'>
                <CardTitle className='flex items-center gap-2'>
                  <ShoppingCart className='h-5 w-5 ' />
                  Cart Items
                </CardTitle>
              </CardHeader>
              <CardContent className='p-0'>
                <ul className='divide-y dark:divide-slate-800'>
                  {cart.map((item) => (
                    <CartItem key={item.cartItemId} item={item} />
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Cart Summary Sidebar */}
          <div className='lg:col-span-1'>
            <CartSummary
              subtotal={subtotal}
              shipping={shipping}
              taxes={taxes}
              total={total}
            />
          </div>
        </div>

        {/* Saved for Later Section */}
        {savedForLater.length > 0 && (
          <div className='mt-12'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-2xl font-bold tracking-tight dark:text-white'>
                Saved for Later
              </h2>
              <Badge variant='secondary'>{savedForLater.length} items</Badge>
            </div>
            <Card>
              <CardContent className='px-4'>
                <ul className='divide-y dark:divide-slate-800'>
                  {savedForLater.map((item) => (
                    <SavedItem key={item.cartItemId} item={item} />
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Cart page with Suspense
 */
export default function CartPage() {
  return (
    <Suspense fallback={<CartSkeleton />}>
      <CartContent />
    </Suspense>
  );
}
