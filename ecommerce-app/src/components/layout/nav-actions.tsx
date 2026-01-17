'use client';

import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { removeFromCart } from '@/lib/store/slices/cartSlice';
import { setTheme } from '@/lib/store/slices/uiSlice';
import { logout } from '@/lib/store/thunks/authThunks';
import { cn } from '@/lib/utils';
import {
  Heart,
  LayoutDashboard,
  LogOut,
  Moon,
  Package,
  ShoppingBag,
  ShoppingCart,
  Sun,
  User,
  UserCircle,
  X,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

/**
 * Cart Item Component for Hover Popup
 */
const CartPopupItem = ({ item }: { item: any }) => {
  const dispatch = useAppDispatch();

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(removeFromCart(item.cartItemId));
  };

  return (
    <div className='group flex gap-3 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg px-2 transition-colors'>
      {/* Product Image */}
      <div className='relative h-16 w-16 shrink-0 overflow-hidden rounded-md border bg-slate-100 dark:bg-slate-800'>
        <Image
          src={item.image || '/placeholder.png'}
          alt={item.title}
          fill
          className='object-cover'
        />
      </div>

      {/* Product Info */}
      <div className='flex-1 min-w-0'>
        <h4 className='text-sm font-medium line-clamp-1 dark:text-white'>
          {item.title}
        </h4>
        <p className='text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5'>
          {item.description || item.category}
        </p>
        <div className='flex items-center justify-between mt-1'>
          <span className='text-xs text-slate-600 dark:text-slate-400'>
            Qty: {item.quantity}
          </span>
          <span className='text-sm font-semibold dark:text-white'>
            ${(item.price * item.quantity).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Remove Button */}
      <Button
        variant='ghost'
        size='icon'
        className='h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity'
        onClick={handleRemove}
      >
        <X className='h-4 w-4 text-slate-500' />
      </Button>
    </div>
  );
};

/**
 * Cart Hover Popup Component
 */
const CartHoverPopup = ({ cartItemCount }: { cartItemCount: number }) => {
  const router = useRouter();
  const cart = useAppSelector((state) => state.cart.cart);

  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  if (cart.length === 0) {
    return (
      <HoverCardContent align='end' className='w-80' sideOffset={8}>
        <div className='flex flex-col items-center justify-center py-8 text-center'>
          <div className='h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4'>
            <ShoppingCart className='h-8 w-8 text-slate-400 dark:text-slate-600' />
          </div>
          <h3 className='font-semibold text-lg mb-1 dark:text-white'>
            Your cart is empty
          </h3>
          <p className='text-sm text-slate-600 dark:text-slate-400 mb-4'>
            Add items to get started
          </p>
          <Button
            size='sm'
            onClick={() => router.push('/products')}
            className='w-full'
          >
            Browse Products
          </Button>
        </div>
      </HoverCardContent>
    );
  }

  return (
    <HoverCardContent align='end' className='w-96 p-0' sideOffset={8}>
      {/* Header */}
      <div className='flex items-center justify-between p-4 border-b'>
        <div>
          <h3 className='font-semibold text-base dark:text-white'>
            Shopping Cart
          </h3>
          <p className='text-xs text-slate-500 dark:text-slate-400'>
            {cartItemCount} {cartItemCount === 1 ? 'item' : 'items'}
          </p>
        </div>
        <Badge variant='secondary' className='text-xs'>
          ${subtotal.toFixed(2)}
        </Badge>
      </div>

      {/* Cart Items - Scrollable */}
      <ScrollArea className='max-h-75'>
        <div className='px-4 divide-y dark:divide-slate-800'>
          {cart.map((item) => (
            <CartPopupItem key={item.cartItemId} item={item} />
          ))}
        </div>
      </ScrollArea>

      {/* Footer with Actions */}
      <div className='p-4 border-t bg-slate-50 dark:bg-slate-900/50'>
        <div className='flex items-center justify-between mb-3'>
          <span className='text-sm font-medium dark:text-white'>Subtotal</span>
          <span className='text-lg font-bold dark:text-white'>
            ${subtotal.toFixed(2)}
          </span>
        </div>
        <div className='space-y-2'>
          <Button
            className='w-full'
            size='sm'
            onClick={() => router.push('/checkout')}
          >
            <ShoppingBag className='h-4 w-4 mr-2' />
            Proceed to Checkout
          </Button>
          <Button
            variant='outline'
            className='w-full'
            size='sm'
            onClick={() => router.push('/cart')}
          >
            View Cart
          </Button>
        </div>
        <p className='text-xs text-center text-slate-500 dark:text-slate-400 mt-3'>
          Shipping & taxes calculated at checkout
        </p>
      </div>
    </HoverCardContent>
  );
};

/**
 * Navigation actions component with theme toggle, cart, wishlist, and user menu
 *
 * Features:
 * - Theme toggle with smooth transitions
 * - Cart hover popup with items preview
 * - Wishlist with badge counters
 * - User dropdown menu with role-based links
 * - Optimized re-renders with memoization
 * - Accessible markup
 */
export const NavActions = () => {
  const [hasMounted, setHasMounted] = useState(false);
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.currentUser);
  const cart = useAppSelector((state) => state.cart.cart);
  const wishlist = useAppSelector((state) => state.wishlist.itemIds);
  const theme = useAppSelector((state) => state.ui.theme);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Memoized cart item count
  const cartItemCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // Memoized wishlist count
  const wishlistCount = useMemo(() => wishlist?.length || 0, [wishlist]);

  // Get user's first name
  const firstName = useMemo(() => {
    return user?.name?.split(' ')[0] || 'User';
  }, [user]);

  // Handle theme toggle
  const handleThemeToggle = useCallback(() => {
    dispatch(setTheme(theme === 'light' ? 'dark' : 'light'));
  }, [dispatch, theme]);

  // Handle logout
  const handleLogout = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  // Render a skeleton loader until the component has mounted on the client
  if (!hasMounted) {
    return (
      <div className='flex items-center gap-2'>
        <Skeleton className='h-8 w-8 rounded-full' />
        <Skeleton className='h-8 w-8 rounded-full' />
        <Skeleton className='h-8 w-8 rounded-full' />
        <Skeleton className='h-8 w-24 rounded-md' />
      </div>
    );
  }

  return (
    <div className='flex items-center gap-1'>
      {/* Theme Toggle */}
      <Button
        variant='ghost'
        size='icon'
        onClick={handleThemeToggle}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        className='relative'
      >
        <Sun className='h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
        <Moon className='absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
        <span className='sr-only'>Toggle theme</span>
      </Button>

      {/* Wishlist */}
      <Link
        href='/wishlist'
        aria-label={`View wishlist (${wishlistCount} items)`}
        className={cn(
          buttonVariants({ variant: 'ghost', size: 'icon' }),
          'relative  hover:bg-slate-100 hover:text-slate-950 dark:hover:text-slate-100 dark:text-slate-100 text-slate-900'
        )}
      >
        <Heart className='h-5 w-5' />
        {wishlistCount > 0 && (
          <Badge
            variant='default'
            className='absolute -right-1 -top-1 h-5 w-5 p-0 flex items-center justify-center text-[10px] pointer-events-none'
          >
            {wishlistCount > 99 ? '99+' : wishlistCount}
          </Badge>
        )}
      </Link>

      {/* Shopping Cart with Hover Popup */}
      <HoverCard openDelay={100} closeDelay={50}>
        <HoverCardTrigger asChild>
          <Link
            href='/cart'
            aria-label={`View shopping cart (${cartItemCount} items)`}
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'icon' }),
              'relative  hover:bg-slate-100 hover:text-slate-950 dark:hover:text-slate-100 dark:text-slate-100 text-slate-900'
            )}
          >
            <ShoppingCart className='h-5 w-5' />
            {cartItemCount > 0 && (
              <Badge
                variant='default'
                className='absolute -right-1 -top-1 h-5 w-5 p-0 flex items-center justify-center text-[10px] pointer-events-none'
              >
                {cartItemCount > 99 ? '99+' : cartItemCount}
              </Badge>
            )}
          </Link>
        </HoverCardTrigger>
        <CartHoverPopup cartItemCount={cartItemCount} />
      </HoverCard>

      {/* User Menu */}
      {user ? (
        <HoverCard openDelay={200} closeDelay={100}>
          <HoverCardTrigger asChild>
            <Button variant='ghost' className='gap-2 px-2 sm:px-3'>
              <span className='hidden sm:inline text-sm font-medium'>
                Hi, {firstName}
              </span>
              <User className='h-5 w-5' />
            </Button>
          </HoverCardTrigger>
          <HoverCardContent align='end' className='w-56 p-0' sideOffset={8}>
            {/* Header */}
            <div className='p-4 border-b'>
              <p className='text-sm font-medium dark:text-white'>{user.name}</p>
              <p className='text-xs text-slate-500 dark:text-slate-400'>
                {user.email || `${user.role || 'customer'}`}
              </p>
            </div>

            {/* Menu Items */}
            <div className='p-2'>
              <Link
                href='/account'
                className='flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer'
              >
                <UserCircle className='h-4 w-4 text-slate-600 dark:text-slate-400' />
                <span className='dark:text-white'>My Account</span>
              </Link>
              <Link
                href='/orders'
                className='flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer'
              >
                <Package className='h-4 w-4 text-slate-600 dark:text-slate-400' />
                <span className='dark:text-white'>My Orders</span>
              </Link>

              {user.role === 'ADMIN' && (
                <>
                  <Separator className='my-2' />
                  <Link
                    href='/admin/dashboard'
                    className='flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer'
                  >
                    <LayoutDashboard className='h-4 w-4 text-slate-600 dark:text-slate-400' />
                    <span className='dark:text-white'>Admin Dashboard</span>
                  </Link>
                </>
              )}
            </div>

            {/* Logout */}
            <div className='p-2 border-t'>
              <button
                onClick={handleLogout}
                className='flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors cursor-pointer w-full text-left text-red-600 dark:text-red-400'
              >
                <LogOut className='h-4 w-4' />
                <span>Logout</span>
              </button>
            </div>
          </HoverCardContent>
        </HoverCard>
      ) : (
        <Button asChild size='sm' className='px-3 sm:px-4 ml-2'>
          <Link href='/auth'>
            <User className='h-4 w-4' />
            <span className='hidden sm:inline'>Login</span>
          </Link>
        </Button>
      )}
    </div>
  );
};
