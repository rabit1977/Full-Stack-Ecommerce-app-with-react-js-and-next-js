'use client';

import {
  clearCartAction,
  moveToCartAction,
  removeCartItemAction,
  removeSavedForLaterItemAction,
  saveForLaterAction,
  updateCartItemQuantityAction,
} from '@/actions/cart-actions';
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

// Mock coupon data - replace with API call
const VALID_COUPONS = {
  SAVE10: { discount: 0.1, type: 'percentage', description: '10% off' },
  SAVE20: { discount: 0.2, type: 'percentage', description: '20% off' },
  FLAT15: { discount: 15, type: 'fixed', description: '$15 off' },
  WELCOME: {
    discount: 0.15,
    type: 'percentage',
    description: '15% off for new customers',
  },
} as const;

function EmptyCart() {
  const router = useRouter();

  return (
    <div className='container mx-auto px-4'>
      <div className='flex flex-col items-center py-30 min-h-[calc(100lvh-440px)] text-center space-y-6'>
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

function CouponInput({
  onApplyCoupon,
}: {
  onApplyCoupon: (code: string) => void;
}) {
  const [couponCode, setCouponCode] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  const handleApply = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    setIsApplying(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    onApplyCoupon(couponCode.toUpperCase());
    setIsApplying(false);
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

interface CartClientProps {
  cartItems: CartItemWithProduct[];
  savedForLaterItems: CartItemWithProduct[];
}

export function CartClient({ cartItems, savedForLaterItems }: CartClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const { subtotal, taxes, shipping, discount, total, itemCount } =
    useMemo(() => {
      const subtotal = cartItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );

      let discount = 0;
      if (
        appliedCoupon &&
        VALID_COUPONS[appliedCoupon as keyof typeof VALID_COUPONS]
      ) {
        const coupon =
          VALID_COUPONS[appliedCoupon as keyof typeof VALID_COUPONS];
        if (coupon.type === 'percentage') {
          discount = subtotal * coupon.discount;
        } else {
          discount = coupon.discount;
        }
      }

      const discountedSubtotal = subtotal - discount;
      const shipping = discountedSubtotal > 50 ? 0 : 5.0; // Free shipping over $50
      const taxes = discountedSubtotal * 0.08; // 8% tax
      const total = discountedSubtotal + shipping + taxes;
      const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

      return { subtotal, taxes, shipping, discount, total, itemCount };
    }, [cartItems, appliedCoupon]);

  const handleApplyCoupon = (code: string) => {
    if (VALID_COUPONS[code as keyof typeof VALID_COUPONS]) {
      setAppliedCoupon(code);
      const coupon = VALID_COUPONS[code as keyof typeof VALID_COUPONS];
      toast.success(
        <div className='flex items-center gap-2'>
          <Check className='h-4 w-4' />
          <span>Coupon applied! You saved {coupon.description}</span>
        </div>
      );
    } else {
      toast.error('Invalid coupon code');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    toast.success('Coupon removed');
  };

  const handleClearCart = () => {
    startTransition(async () => {
      const result = await clearCartAction();
      if (result.success) {
        setAppliedCoupon(null);
        toast.success('Cart cleared successfully');
        router.refresh();
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
        router.refresh();
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
        router.refresh();
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
            router.refresh();
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
        router.refresh();
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
        router.refresh();
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
      <div className='container mx-auto px-4 py-12'>
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
                    <div className='flex items-center justify-between p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-900 rounded-lg'>
                      <div className='flex items-center gap-3'>
                        <div className='h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center'>
                          <Check className='h-5 w-5 text-green-600 dark:text-green-400' />
                        </div>
                        <div>
                          <p className='font-semibold text-green-800 dark:text-green-200'>
                            {appliedCoupon}
                          </p>
                          <p className='text-sm text-green-600 dark:text-green-400'>
                            {
                              VALID_COUPONS[
                                appliedCoupon as keyof typeof VALID_COUPONS
                              ].description
                            }
                          </p>
                        </div>
                      </div>
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={handleRemoveCoupon}
                        className='text-green-600 hover:text-green-700 hover:bg-green-100 dark:text-green-400 dark:hover:bg-green-900'
                      >
                        <X className='h-4 w-4' />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <CouponInput onApplyCoupon={handleApplyCoupon} />
                      <div className='text-xs text-slate-500 dark:text-slate-400'>
                        Try: SAVE10, SAVE20, FLAT15, WELCOME
                      </div>
                    </>
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
