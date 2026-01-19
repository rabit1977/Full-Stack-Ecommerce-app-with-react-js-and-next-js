'use client';

import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import {
  Heart,
  LayoutDashboard,
  LogOut,
  Moon,
  Package,
  ShoppingCart,
  Sun,
  User,
  UserCircle,
} from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';

interface NavActionsProps {
  initialWishlistCount: number;
  initialCartItemCount: number;
}

export const NavActions = ({
  initialWishlistCount,
  initialCartItemCount,
}: NavActionsProps) => {
  const [hasMounted, setHasMounted] = useState(false);
  const { data: session } = useSession();
  const user = session?.user;
  const [wishlistCount, setWishlistCount] = useState(initialWishlistCount);
  const [cartItemCount, setCartItemCount] = useState(initialCartItemCount);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    setWishlistCount(initialWishlistCount);
  }, [initialWishlistCount]);

  useEffect(() => {
    setCartItemCount(initialCartItemCount);
  }, [initialCartItemCount]);

  // Get user's first name
  const firstName = useMemo(() => {
    return user?.name?.split(' ')[0] || 'User';
  }, [user]);

  // Handle theme toggle
  const handleThemeToggle = useCallback(() => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  }, [setTheme, theme]);

  // Handle logout
  const handleLogout = useCallback(() => {
    signOut();
  }, []);

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
          'relative  hover:bg-slate-100 hover:text-slate-950 dark:hover:text-slate-100 dark:text-slate-100 text-slate-900',
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
              'relative  hover:bg-slate-100 hover:text-slate-950 dark:hover:text-slate-100 dark:text-slate-100 text-slate-900',
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
        {/* <CartHoverPopup cartItemCount={cartItemCount} /> */}
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
                {user.email || 'User'}
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

              {/* {user.role === 'ADMIN' && ( */}
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
              {/* )} */}
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
