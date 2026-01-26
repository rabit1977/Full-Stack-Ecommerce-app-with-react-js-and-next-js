'use client';

import { UserAvatar } from '@/components/shared/user-avatar';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Heart,
  LayoutDashboard,
  LogOut,
  Moon,
  Package,
  ShoppingCart,
  Sun,
  User,
  UserCircle
} from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState, useTransition } from 'react';

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
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [isPending, startTransition] = useTransition();

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

  // Handle theme toggle with transition
  const handleThemeToggle = useCallback(() => {
    startTransition(() => {
      setTheme(theme === 'light' ? 'dark' : 'light');
    });
  }, [setTheme, theme]);

  // Handle logout
  const handleLogout = useCallback(() => {
    signOut();
  }, []);

  const isDark = resolvedTheme === 'dark';

  // Render a skeleton loader until the component has mounted on the client
  if (!hasMounted) {
    return (
      <div className='flex items-center gap-1 sm:gap-2'>
        <Skeleton className='h-10 w-10 rounded-full' />
        <Skeleton className='h-10 w-10 rounded-full' />
        <Skeleton className='h-10 w-10 rounded-full' />
        <Skeleton className='hidden sm:block h-10 w-24 rounded-full' />
      </div>
    );
  }

  return (
    <div className='flex items-center gap-1 sm:gap-2'>
      {/* Animated Theme Toggle */}
      <Button
        variant='ghost'
        size='icon'
        onClick={handleThemeToggle}
        disabled={isPending}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        className='relative h-10 w-10 rounded-full hover:bg-muted/50 dark:hover:bg-muted/20 data-[state=open]:bg-muted/50 overflow-hidden'
      >
        <AnimatePresence mode='wait' initial={false}>
          {isDark ? (
            <motion.div
              key='moon'
              initial={{ scale: 0.5, opacity: 0, rotate: 90 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.5, opacity: 0, rotate: -90 }}
              transition={{ duration: 0.2 }}
            >
              <Moon className='h-5 w-5 text-indigo-400' />
            </motion.div>
          ) : (
            <motion.div
              key='sun'
              initial={{ scale: 0.5, opacity: 0, rotate: -90 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.5, opacity: 0, rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              <Sun className='h-5 w-5 text-amber-500' />
            </motion.div>
          )}
        </AnimatePresence>
        <span className='sr-only'>Toggle theme</span>
      </Button>

      {/* Wishlist */}
      <Link
        href='/wishlist'
        aria-label={`View wishlist (${wishlistCount} items)`}
        className={cn(
          buttonVariants({ variant: 'ghost', size: 'icon' }),
          'relative h-10 w-10 rounded-full hover:bg-rose-500/10 hover:text-rose-500 transition-colors',
        )}
      >
        <Heart className={cn('h-5 w-5 transition-colors', wishlistCount > 0 ? 'fill-rose-500 text-rose-500' : '')} />
        <AnimatePresence>
          {wishlistCount > 0 && (
            <motion.div
              key='wishlist-badge'
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className='absolute -right-0.5 -top-0.5'
            >
              <Badge
                variant='default'
                className='h-4 min-w-4 px-1 rounded-full flex items-center justify-center text-[10px] font-bold bg-rose-500 text-white border-2 border-background shadow-xs'
              >
                {wishlistCount > 99 ? '99+' : wishlistCount}
              </Badge>
            </motion.div>
          )}
        </AnimatePresence>
      </Link>

      {/* Shopping Cart */}
      <Link
        href='/cart'
        aria-label={`View shopping cart (${cartItemCount} items)`}
        className={cn(
          buttonVariants({ variant: 'ghost', size: 'icon' }),
          'relative h-10 w-10 rounded-full hover:bg-emerald-500/10 hover:text-emerald-500 transition-colors',
        )}
      >
        <ShoppingCart className='h-5 w-5' />
        <AnimatePresence>
          {cartItemCount > 0 && (
            <motion.div
              key='cart-badge'
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className='absolute -right-0.5 -top-0.5'
            >
              <Badge
                variant='default'
                className='h-4 min-w-4 px-1 rounded-full flex items-center justify-center text-[10px] font-bold bg-emerald-500 text-white border-2 border-background shadow-xs'
              >
                {cartItemCount > 99 ? '99+' : cartItemCount}
              </Badge>
            </motion.div>
          )}
        </AnimatePresence>
      </Link>

      {/* User Menu */}
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-10 gap-2 pl-2 pr-3 rounded-full hover:bg-muted/50 dark:hover:bg-muted/20 data-[state=open]:bg-muted/50 ml-1'>
              <UserAvatar 
                user={user}
                className='h-8 w-8 border-2 border-background shadow-sm transition-transform group-hover:scale-105'
                fallbackClassName='text-xs font-bold bg-gradient-to-br from-primary to-violet-600 text-white'
              />
              <span className='hidden md:inline text-sm font-semibold truncate max-w-[100px]'>
                {firstName}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='w-56 p-2 rounded-2xl glass-card border-border/50 shadow-xl z-[100]' align='end' sideOffset={10}>
             <DropdownMenuLabel className="font-normal p-2">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-bold leading-none">{user.name}</p>
                  <p className="text-xs leading-none text-muted-foreground truncate">{user.email}</p>
                </div>
              </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border/50" />
            <DropdownMenuGroup>
                <DropdownMenuItem asChild className="rounded-xl cursor-pointer focus:bg-muted/50">
                  <Link href='/account' className='flex items-center gap-2'>
                    <UserCircle className='h-4 w-4 mr-2 text-muted-foreground' />
                    <span>My Account</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="rounded-xl cursor-pointer focus:bg-muted/50">
                  <Link href='/orders' className='flex items-center gap-2'>
                    <Package className='h-4 w-4 mr-2 text-muted-foreground' />
                    <span>My Orders</span>
                  </Link>
                </DropdownMenuItem>
                 <DropdownMenuItem asChild className="rounded-xl cursor-pointer focus:bg-muted/50">
                  <Link href='/wishlist' className='flex items-center gap-2'>
                    <Heart className='h-4 w-4 mr-2 text-muted-foreground' />
                    <span>Wishlist</span>
                  </Link>
                </DropdownMenuItem>
                {user.role === 'ADMIN' && (
                  <DropdownMenuItem asChild className="rounded-xl cursor-pointer focus:bg-primary/10 focus:text-primary">
                    <Link href='/admin/dashboard' className='flex items-center gap-2'>
                      <LayoutDashboard className='h-4 w-4 mr-2 text-primary' />
                      <span className="font-semibold text-primary">Admin Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                )}
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-border/50" />
            <DropdownMenuItem 
                onClick={handleLogout}
                className="rounded-xl cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
            >
              <LogOut className='h-4 w-4 mr-2' />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button asChild size='sm' className='h-10 px-5 ml-2 rounded-full font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all btn-premium'>
          <Link href='/auth'>
            <User className='h-4 w-4 mr-2' />
            <span>Login</span>
          </Link>
        </Button>
      )}
    </div>
  );
};
