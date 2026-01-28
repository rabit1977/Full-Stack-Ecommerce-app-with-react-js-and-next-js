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
    <div className='container-wide min-h-[calc(100vh-200px)] flex items-center justify-center p-4'>
      <div className='max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-700'>
        <div className='relative mx-auto w-40 h-40 flex items-center justify-center'>
          <div className='absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-20 duration-1000' />
          <div className='absolute inset-0 bg-primary/10 rounded-full animate-pulse duration-2000' />
          <div className='relative z-10 w-28 h-28 bg-gradient-to-br from-background to-secondary rounded-full flex items-center justify-center ring-1 ring-border shadow-2xl'>
            <ShoppingCart className='h-12 w-12 text-primary' />
          </div>
          
          {/* Decorative floating bubbles */}
          <div className='absolute top-2 right-2 h-4 w-4 bg-blue-400 rounded-full animate-bounce delay-100 opacity-60' />
          <div className='absolute bottom-4 left-4 h-3 w-3 bg-purple-400 rounded-full animate-bounce delay-300 opacity-60' />
          <div className='absolute top-1/2 left-0 h-2 w-2 bg-emerald-400 rounded-full animate-pulse delay-500 opacity-60' />
        </div>
        
        <div className='space-y-4'>
          <h1 className='text-4xl font-black tracking-tight text-foreground'>Your cart is empty</h1>
          <p className='text-muted-foreground text-lg leading-relaxed max-w-sm mx-auto'>
            Looks like you haven&apos;t added any items yet. 
            <br />
            Our latest collection is waiting for you!
          </p>
        </div>

        <div className='flex flex-col sm:flex-row gap-4 justify-center pt-4'>
          <Button 
            size='lg' 
            onClick={() => router.push('/products')} 
            className='btn-premium h-14 px-10 rounded-full text-lg font-bold hover:shadow-primary/40'
          >
            <Package className='h-5 w-5 mr-2' />
            Start Shopping
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
      <div className='relative flex-1 group'>
        <Tag className='absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground group-focus-within:text-primary transition-colors' />
        <Input
          placeholder='Enter code'
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleApply()}
          className='pl-8 sm:pl-10 h-9 sm:h-11 text-sm bg-background/50 border-transparent focus:border-primary/20 hover:bg-background/80 transition-all rounded-lg sm:rounded-xl focus:ring-2 focus:ring-primary/20'
          disabled={isApplying}
        />
      </div>
      <Button
        onClick={handleApply}
        disabled={isApplying || !couponCode.trim()}
        className='h-9 sm:h-11 px-4 sm:px-6 rounded-lg sm:rounded-xl text-sm font-bold bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20'
      >
        {isApplying ? <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : 'Apply'}
      </Button>
    </div>
  );
}

import { Coupon, User } from '@/generated/prisma/browser';

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
    <div className='min-h-[80vh] bg-slate-50/50 dark:bg-slate-950/50 '>
      <div className='container mx-auto px-3 sm:px-6 pt-4 sm:pt-8 pb-2 sm:pb-10'>
        {/* Header - Row layout with center alignment */}
        <div className='flex items-center justify-between gap-4 mb-6 sm:mb-10'>
          <div className='flex items-center gap-2 sm:gap-4'>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => router.push('/products')}
              className='h-9 w-9 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-800 shrink-0'
            >
              <ArrowLeft className='h-5 w-5' />
            </Button>
            <div>
              <h1 className='text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-foreground'>
                Shopping Cart
              </h1>
              {cartItems.length > 0 && (
                <p className='text-xs sm:text-sm text-muted-foreground font-medium'>
                  {itemCount} {itemCount === 1 ? 'item' : 'items'}
                </p>
              )}
            </div>
          </div>
          
          {cartItems.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant='outline' 
                  size='sm' 
                  disabled={isPending} 
                  className='rounded-full h-9 px-3 sm:px-4 border-border/60 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-all shrink-0'
                >
                  <Trash2 className='h-4 w-4 sm:mr-2' />
                  <span className='hidden sm:inline'>Clear Cart</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className='max-w-[90vw] sm:max-w-md rounded-2xl'>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear Cart</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to remove all items from your cart?
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className='flex-col sm:flex-row gap-2'>
                  <AlertDialogCancel className='w-full sm:w-auto rounded-xl'>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleClearCart} 
                    className='w-full sm:w-auto bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl'
                  >
                    Clear Cart
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        {cartItems.length > 0 && subtotal > 0 && subtotal - discount < 50 && (
          <div className='bg-blue-50/50 backdrop-blur-md border border-blue-200/50 rounded-2xl p-4 mb-8 dark:bg-blue-950/30 dark:border-blue-900/50 animate-in fade-in slide-in-from-top-4 duration-500'>
             <div className="flex items-center gap-3">
               <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-xl text-blue-600 dark:text-blue-400">
                  <Package className="h-5 w-5" />
               </div>
               <p className='text-sm text-blue-800 dark:text-blue-200'>
                  <span className='font-bold block text-base'>Almost there!</span> 
                  Add <span className="font-bold">${(50 - (subtotal - discount)).toFixed(2)}</span> more to get free
                  shipping!
               </p>
             </div>
             <div className="mt-3 h-2 w-full bg-blue-100 dark:bg-blue-900/30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${Math.min(100, ((subtotal - discount) / 50) * 100)}%` }}
                />
             </div>
          </div>
        )}

        {cartItems.length > 0 && subtotal - discount >= 50 && (
          <div className='bg-emerald-50/50 backdrop-blur-md border border-emerald-200/50 rounded-2xl p-4 mb-8 dark:bg-emerald-950/30 dark:border-emerald-900/50 animate-in fade-in slide-in-from-top-4 duration-500'>
            <div className="flex items-center gap-3">
               <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl text-emerald-600 dark:text-emerald-400">
                  <Check className="h-5 w-5" />
               </div>
               <p className='text-sm text-emerald-800 dark:text-emerald-200 font-medium'>
                 <span className='font-bold block text-base'>Congratulations!</span>
                 You&apos;ve qualified for <span className="underline decoration-wavy">free shipping</span> on this order!
               </p>
            </div>
          </div>
        )}

        {cartItems.length > 0 ? (
          <div className='grid lg:grid-cols-12 gap-4 sm:gap-8'>
            <div className='lg:col-span-8 flex flex-col gap-4 sm:gap-8'>
              <div className='glass-card rounded-2xl sm:rounded-3xl overflow-hidden flex-1 flex flex-col'>
                <div className='p-3 sm:p-6 border-b border-border/50 bg-secondary/10'>
                  <h2 className='text-base sm:text-xl font-bold flex items-center gap-2'>
                    <ShoppingCart className='h-4 w-4 sm:h-5 sm:w-5 text-primary' />
                    Cart Items
                  </h2>
                </div>
                <div className='p-0 flex-1'>
                  <ul className='divide-y divide-border/50'>
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
                </div>
              </div>

              <div className='glass-card rounded-2xl sm:rounded-3xl overflow-hidden'>
                <div className='p-3 sm:p-6 border-b border-border/50 bg-secondary/10'>
                  <h2 className='text-base sm:text-xl font-bold flex items-center gap-2'>
                    <Tag className='h-4 w-4 sm:h-5 sm:w-5 text-primary' />
                    Discount Code
                  </h2>
                </div>
                <div className='p-3 sm:p-6'>
                  {appliedCoupon ? (
                    (() => {
                      const isCouponValid =
                        appliedCoupon.isActive &&
                        (!appliedCoupon.expiresAt ||
                          new Date(appliedCoupon.expiresAt) > new Date());

                      return (
                        <div
                          className={cn(
                            'flex items-center justify-between p-3 sm:p-4 rounded-xl sm:rounded-2xl border transition-all duration-300',
                            isCouponValid
                              ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900'
                              : 'bg-red-50/50 dark:bg-red-950/30 border-red-200 dark:border-red-900'
                          )}
                        >
                          <div className='flex items-center gap-2 sm:gap-4 min-w-0'>
                            <div
                              className={cn(
                                'h-9 w-9 sm:h-12 sm:w-12 shrink-0 rounded-lg sm:rounded-xl flex items-center justify-center',
                                isCouponValid
                                  ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400'
                                  : 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400'
                              )}
                            >
                              <Tag className='h-4 w-4 sm:h-6 sm:w-6' />
                            </div>
                            <div className='min-w-0'>
                              <p
                                className={cn(
                                  'font-black uppercase tracking-widest text-sm sm:text-lg truncate',
                                  isCouponValid
                                    ? 'text-emerald-900 dark:text-emerald-100'
                                    : 'text-red-900 dark:text-red-100'
                                )}
                              >
                                {appliedCoupon.code}
                              </p>
                              <p
                                className={cn(
                                  'text-[10px] sm:text-xs font-medium mt-0.5',
                                  isCouponValid
                                    ? 'text-emerald-700 dark:text-emerald-300'
                                    : 'text-red-700 dark:text-red-300'
                                )}
                              >
                                {isCouponValid
                                  ? appliedCoupon.type === 'PERCENTAGE'
                                    ? `${appliedCoupon.discount}% off`
                                    : `$${appliedCoupon.discount.toFixed(2)} off`
                                  : 'Expired or inactive'}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={handleRemoveCoupon}
                            disabled={isApplyingCoupon}
                            className={cn(
                              'h-8 w-8 sm:h-10 sm:w-auto sm:px-4 rounded-full sm:rounded-xl shrink-0',
                              isCouponValid
                                ? 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-100'
                                : 'text-red-600 hover:text-red-700 hover:bg-red-100'
                            )}
                          >
                            <X className='h-4 w-4 sm:mr-2' />
                            <span className='hidden sm:inline font-bold'>Remove</span>
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
                </div>
              </div>
            </div>
            <div className='lg:col-span-4 lg:h-full'>
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
          <div className='mt-16 pt-10 border-t border-border/40'>
            <div className='flex items-center justify-between mb-8'>
              <h2 className='text-3xl font-black tracking-tight dark:text-white'>
                Saved for Later
              </h2>
              <Badge variant='secondary' className="text-sm px-3 py-1 bg-secondary text-secondary-foreground">
                {savedForLaterItems.length} items
              </Badge>
            </div>
            <div className='glass-card rounded-3xl overflow-hidden'>
              <div className='p-0'>
                <ul className='divide-y divide-border/50'>
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
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
