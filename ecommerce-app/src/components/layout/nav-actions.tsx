'use client';

import { Button, buttonVariants } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { logout } from '@/lib/store/thunks/authThunks';
import { setTheme } from '@/lib/store/slices/uiSlice';
import { cn } from '@/lib/utils';
import {
  Heart,
  Moon,
  Sun,
  User,
  ShoppingCart,
  LayoutDashboard,
  LogOut,
  UserCircle,
  Package,
} from 'lucide-react';
import Link from 'next/link';
import { useCallback, useMemo } from 'react';

/**
 * Navigation actions component with theme toggle, cart, wishlist, and user menu
 * 
 * Features:
 * - Theme toggle with smooth transitions
 * - Cart and wishlist with badge counters
 * - User dropdown menu with role-based links
 * - Optimized re-renders with memoization
 * - Accessible markup
 */
export const NavActions = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);
  const cart = useAppSelector((state) => state.cart.cart);
  const wishlist = useAppSelector((state) => state.wishlist.itemIds);
  const theme = useAppSelector((state) => state.ui.theme);

  // Memoized cart item count
  const cartItemCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // Memoized wishlist count
  const wishlistCount = useMemo(() => wishlist?.length || 0, [wishlist]);

  // Get user's first name
  const firstName = useMemo(() => {
    return user?.name.split(' ')[0] || 'User';
  }, [user]);

  // Handle theme toggle
  const handleThemeToggle = useCallback(() => {
    dispatch(setTheme(theme === 'light' ? 'dark' : 'light'));
  }, [dispatch, theme]);

  // Handle logout
  const handleLogout = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

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
          'relative bg-slate-900 hover:bg-slate-700 text-white'
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

      {/* Shopping Cart */}
      <Link
        href='/cart'
        aria-label={`View shopping cart (${cartItemCount} items)`}
        className={cn(
          buttonVariants({ variant: 'ghost', size: 'icon' }),
          'relative bg-slate-900 hover:bg-slate-700 text-white'
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

      {/* User Menu */}
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='gap-2 px-2 sm:px-3'>
              <span className='hidden sm:inline text-sm font-medium'>
                Hi, {firstName}
              </span>
              <User className='h-5 w-5' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-56'>
            <DropdownMenuLabel className='font-normal'>
              <div className='flex flex-col gap-1'>
                <p className='text-sm font-medium'>{user.name}</p>
                <p className='text-xs text-muted-foreground'>
                  {user.email || `${user.role || 'customer'}`}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href='/account' className='cursor-pointer'>
                <UserCircle className='mr-2 h-4 w-4' />
                My Account
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href='/orders' className='cursor-pointer'>
                <Package className='mr-2 h-4 w-4' />
                My Orders
              </Link>
            </DropdownMenuItem>
            {user.role === 'admin' && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href='/admin/dashboard' className='cursor-pointer'>
                    <LayoutDashboard className='mr-2 h-4 w-4' />
                    Admin Dashboard
                  </Link>
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className='cursor-pointer text-red-600 dark:text-red-400'>
              <LogOut className='mr-2 h-4 w-4' />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button asChild size='sm' className='px-3 sm:px-4 ml-2  *:'>
          <Link href='/auth'>
            <User className='h-4 w-4' />
            <span className='hidden sm:inline'>Login</span>
          </Link>
        </Button>
      )}
    </div>
  );
};