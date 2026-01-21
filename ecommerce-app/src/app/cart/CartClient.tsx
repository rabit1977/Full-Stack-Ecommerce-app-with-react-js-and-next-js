'use client';

import {
    clearCartAction,
    moveToCartAction,
    removeCartItemAction,
    removeSavedForLaterItemAction,
    saveForLaterAction,
    updateCartItemQuantityAction,
} from '@/actions/cart-actions';
import {
    applyCouponAction,
    removeCouponAction,
} from '@/actions/coupon-actions';
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
import { Input } from '@/components/ui/input';
import { CartItemWithProduct } from '@/lib/types/cart';
import { cn } from '@/lib/utils';
import {
    ArrowLeft,
    Check,
    Package,
    ShoppingCart,
    Tag,
    Trash2,
    X,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState, useTransition } from 'react';
import { toast } from 'sonner';

function EmptyCart() {
  const router = useRouter();

  return (
    <div className='container-wide'>
      <div className='flex flex-col items-center justify-center py-20 sm:py-30 min-h-[calc(100lvh-200px)] text-center space-y-6 sm:space-y-8'>
        <div className='relative'>
          <div className='absolute inset-0 bg-primary/10 rounded-full blur-3xl opacity-50' />
          <ShoppingCart className='relative h-20 w-20 sm:h-24 sm:w-24 text-primary/40' />
        </div>
        <div className='space-y-3'>
          <h1 className='text-3xl sm:text-4xl font-extrabold tracking-tight'>Your cart is empty</h1>
          <p className='text-lg text-muted-foreground max-w-md mx-auto'>
            Looks like you haven&apos;t added anything to your cart yet. Start
            exploring our products!
          </p>
        </div>
        <div className='flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-4'>
          <Button size='lg' onClick={() => router.push('/products')} className='w-full sm:w-auto h-12 px-8'>
            <Package className='h-5 w-5 mr-2' />
            Browse Products
          </Button>
          <Button variant='outline' size='lg' onClick={() => router.push('/')} className='w-full sm:w-auto h-12 px-8'>
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}

function CouponInput({
  onApplyCoupon,
  isApplying,
}: {
  onApplyCoupon: (code: string) => void;
  isApplying: boolean;
}) {
  const [couponCode, setCouponCode] = useState('');

  const handleApply = () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }
    onApplyCoupon(couponCode.toUpperCase());
  };

  return (
    <div className='flex gap-2'>
      <div className='relative flex-1'>
        <Tag className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400' />
        <Input
          placeholder='Enter coupon code'
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleApply()}
          className='pl-9'
          disabled={isApplying}
        />
      </div>
      <Button
        onClick={handleApply}
        disabled={isApplying || !couponCode.trim()}
        className='whitespace-nowrap'
      >
        {isApplying ? 'Applying...' : 'Apply'}
      </Button>
    </div>
  );
}

import { Coupon, User } from '@prisma/client';

interface CartClientProps {
  cartItems: CartItemWithProduct[];
  savedForLaterItems: CartItemWithProduct[];
  user: (User & { coupon?: Coupon | null }) | null;
}

export function CartClient({
  cartItems,
  savedForLaterItems,
  user,
}: CartClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isApplyingCoupon, startCouponTransition] = useTransition();

  const appliedCoupon = user?.coupon;

  const { subtotal, taxes, shipping, discount, total, itemCount } =
    useMemo(() => {
      const subtotal = cartItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0,
      );

      let discount = 0;
      const isCouponValid = appliedCoupon && 
        appliedCoupon.isActive && 
        (!appliedCoupon.expiresAt || new Date(appliedCoupon.expiresAt) > new Date());

      if (appliedCoupon && isCouponValid) {
        if (appliedCoupon.type === 'PERCENTAGE') {
          discount = subtotal * (appliedCoupon.discount / 100);
        } else {
          discount = appliedCoupon.discount;
        }
      }

      const discountedSubtotal = subtotal - discount;
      const shipping = discountedSubtotal > 50 ? 0 : 5.0;
      const taxes = discountedSubtotal * 0.08;
      const total = discountedSubtotal + shipping + taxes;
      const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

      return { subtotal, taxes, shipping, discount, total, itemCount };
    }, [cartItems, appliedCoupon]);

  const handleApplyCoupon = (code: string) => {
    startCouponTransition(async () => {
      const result = await applyCouponAction(code);
      if (result.success) {
        toast.success(
          <div className='flex items-center gap-2'>
            <Check className='h-4 w-4' />
            <span>{result.message}</span>
          </div>,
        );
      } else {
        toast.error(result.message);
      }
    });
  };

  const handleRemoveCoupon = () => {
    startCouponTransition(async () => {
      const result = await removeCouponAction();
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  };

  const handleClearCart = () => {
    startTransition(async () => {
      const result = await clearCartAction();
      if (result.success) {
        toast.success('Cart cleared successfully');
      } else {
        toast.error(result.message || 'Failed to clear cart');
      }
    });
  };

  const handleUpdateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity < 1) return;
    startTransition(async () => {
      const result = await updateCartItemQuantityAction(cartItemId, quantity);
      if (result.success) {
        toast.success('Quantity updated');
      } else {
        toast.error(result.message || 'Failed to update quantity');
      }
    });
  };

  const handleRemoveItem = (cartItemId: string) => {
    startTransition(async () => {
      const result = await removeCartItemAction(cartItemId);
      if (result.success) {
        toast.success('Item removed');
      } else {
        toast.error(result.message || 'Failed to remove item');
      }
    });
  };

  const handleSaveForLater = (cartItemId: string) => {
    startTransition(async () => {
      const result = await saveForLaterAction(cartItemId);
      if (result.success) {
        toast.success('Item saved for later');
      } else {
        toast.error(result.message || 'Failed to save for later');
      }
    });
  };

  const handleMoveToCart = (savedItemId: string) => {
    startTransition(async () => {
      const result = await moveToCartAction(savedItemId);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  };

  const handleRemoveSavedItem = (savedItemId: string) => {
    startTransition(async () => {
      const result = await removeSavedForLaterItemAction(savedItemId);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  };

  if (cartItems.length === 0 && savedForLaterItems.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className='bg-slate-50 min-h-[70vh] dark:bg-slate-900'>
      <div className='container-wide py-8 sm:py-12'>
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
            {cartItems.length > 0 && (
              <p className='text-slate-600 dark:text-slate-400 ml-12'>
                {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
              </p>
            )}
          </div>
          {cartItems.length > 0 && (
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
                    Are you sure you want to remove all items from your cart?
                    This action cannot be undone.
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
          )}
        </div>

        {cartItems.length > 0 && subtotal > 0 && subtotal - discount < 50 && (
          <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 dark:bg-blue-950 dark:border-blue-900'>
            <p className='text-sm text-blue-800 dark:text-blue-200'>
              <span className='font-semibold'>Almost there!</span> Add $
              {(50 - (subtotal - discount)).toFixed(2)} more to get free
              shipping!
            </p>
          </div>
        )}

        {cartItems.length > 0 && subtotal - discount >= 50 && (
          <div className='bg-green-50 border border-green-200 rounded-lg p-4 mb-8 dark:bg-green-950 dark:border-green-900'>
            <p className='text-sm text-green-800 dark:text-green-200 font-medium'>
              🎉 You&apos;ve qualified for free shipping!
            </p>
          </div>
        )}

        {cartItems.length > 0 ? (
          <div className='grid lg:grid-cols-3 gap-8'>
            <div className='lg:col-span-2 space-y-6'>
              <Card>
                <CardHeader className='border-b'>
                  <CardTitle className='flex items-center gap-2'>
                    <ShoppingCart className='h-5 w-5' />
                    Cart Items
                  </CardTitle>
                </CardHeader>
                <CardContent className='p-0'>
                  <ul className='divide-y dark:divide-slate-800'>
                    {cartItems.map((item) => (
                      <CartItem
                        key={item.id}
                        item={item}
                        onUpdateQuantity={handleUpdateQuantity}
                        onRemove={handleRemoveItem}
                        onSaveForLater={handleSaveForLater}
                        isPending={isPending}
                      />
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2 text-base'>
                    <Tag className='h-4 w-4' />
                    Have a Coupon?
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  {appliedCoupon ? (
                    (() => {
                      const isCouponValid =
                        appliedCoupon.isActive &&
                        (!appliedCoupon.expiresAt ||
                          new Date(appliedCoupon.expiresAt) > new Date());

                      return (
                        <div
                          className={cn(
                            'flex items-center justify-between p-4 rounded-lg border',
                            isCouponValid
                              ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-900'
                              : 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-900'
                          )}
                        >
                          <div className='flex items-center gap-3'>
                            <div
                              className={cn(
                                'h-10 w-10 rounded-full flex items-center justify-center',
                                isCouponValid
                                  ? 'bg-green-100 dark:bg-green-900'
                                  : 'bg-red-100 dark:bg-red-900'
                              )}
                            >
                              <Tag
                                className={cn(
                                  'h-5 w-5',
                                  isCouponValid
                                    ? 'text-green-600 dark:text-green-400'
                                    : 'text-red-600 dark:text-red-400'
                                )}
                              />
                            </div>
                            <div>
                              <p
                                className={cn(
                                  'font-bold uppercase tracking-wider',
                                  isCouponValid
                                    ? 'text-green-900 dark:text-green-100'
                                    : 'text-red-900 dark:text-red-100'
                                )}
                              >
                                {appliedCoupon.code}
                              </p>
                              <p
                                className={cn(
                                  'text-xs',
                                  isCouponValid
                                    ? 'text-green-700 dark:text-green-300'
                                    : 'text-red-700 dark:text-red-300'
                                )}
                              >
                                {isCouponValid
                                  ? appliedCoupon.type === 'PERCENTAGE'
                                    ? `${appliedCoupon.discount}% discount applied`
                                    : `$${appliedCoupon.discount.toFixed(2)} discount applied`
                                  : 'Coupon found but is currently expired or inactive'}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={handleRemoveCoupon}
                            disabled={isApplyingCoupon}
                            className={cn(
                              'hover:bg-opacity-10',
                              isCouponValid
                                ? 'text-green-600 hover:text-green-700 hover:bg-green-100'
                                : 'text-red-600 hover:text-red-700 hover:bg-red-100'
                            )}
                          >
                            <X className='h-4 w-4 mr-2' />
                            Remove
                          </Button>
                        </div>
                      );
                    })()
                  ) : (
                    <CouponInput
                      onApplyCoupon={handleApplyCoupon}
                      isApplying={isApplyingCoupon}
                    />
                  )}
                </CardContent>
              </Card>
            </div>
            <div className='lg:col-span-1'>
              <CartSummary
                subtotal={subtotal}
                discount={discount}
                shipping={shipping}
                taxes={taxes}
                total={total}
              />
            </div>
          </div>
        ) : null}

        {savedForLaterItems.length > 0 && (
          <div className='mt-12'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-2xl font-bold tracking-tight dark:text-white'>
                Saved for Later
              </h2>
              <Badge variant='secondary'>
                {savedForLaterItems.length} items
              </Badge>
            </div>
            <Card>
              <CardContent className='px-4'>
                <ul className='divide-y dark:divide-slate-800'>
                  {savedForLaterItems.map((item) => (
                    <SavedItem
                      key={item.id}
                      item={item}
                      onMoveToCart={handleMoveToCart}
                      onRemove={handleRemoveSavedItem}
                      isPending={isPending}
                    />
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
