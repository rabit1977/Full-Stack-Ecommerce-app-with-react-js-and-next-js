'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
    UserCircle,
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

  // Get user initials for avatar
  const userInitials = useMemo(() => {
    if (!user?.name) return 'U';
    return user.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
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
        <Skeleton className='h-8 w-8 rounded-full' />
        <Skeleton className='h-8 w-8 rounded-full' />
        <Skeleton className='h-8 w-8 rounded-full' />
        <Skeleton className='hidden sm:block h-8 w-24 rounded-md' />
      </div>
    );
  }

  return (
    <div className='flex items-center gap-0.5 sm:gap-1'>
      {/* Animated Theme Toggle */}
      <Button
        variant='ghost'
        size='icon'
        onClick={handleThemeToggle}
        disabled={isPending}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        className='relative h-9 w-9 sm:h-10 sm:w-10 rounded-full hover:bg-accent overflow-hidden'
      >
        <AnimatePresence mode='wait' initial={false}>
          {isDark ? (
            <motion.div
              key='moon'
              initial={{ y: -20, opacity: 0, rotate: -90 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              exit={{ y: 20, opacity: 0, rotate: 90 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
            >
              <Moon className='h-5 w-5' />
            </motion.div>
          ) : (
            <motion.div
              key='sun'
              initial={{ y: -20, opacity: 0, rotate: 90 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              exit={{ y: 20, opacity: 0, rotate: -90 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
            >
              <Sun className='h-5 w-5' />
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
          'relative h-9 w-9 sm:h-10 sm:w-10 rounded-full hover:bg-primary/10 hover:text-primary transition-colors',
        )}
      >
        <Heart className='h-5 w-5' />
        <AnimatePresence>
          {wishlistCount > 0 && (
            <motion.div
              key='wishlist-badge'
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className='absolute -right-1 -top-1'
            >
              <Badge
                variant='default'
                className='h-5 w-5 sm:h-5 sm:w-5 p-0 flex items-center justify-center text-[10px] font-bold bg-red-500 text-white border-2 border-background shadow-sm'
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
          'relative h-9 w-9 sm:h-10 sm:w-10 rounded-full hover:bg-primary/10 hover:text-primary transition-colors',
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
              className='absolute -right-1 -top-1'
            >
              <Badge
                variant='default'
                className='h-5 w-5 sm:h-5 sm:w-5 p-0 flex items-center justify-center text-[10px] font-bold bg-primary text-primary-foreground border-2 border-background shadow-sm'
              >
                {cartItemCount > 99 ? '99+' : cartItemCount}
              </Badge>
            </motion.div>
          )}
        </AnimatePresence>
      </Link>

      {/* User Menu */}
      {user ? (
        <HoverCard openDelay={200} closeDelay={100}>
          <HoverCardTrigger asChild>
            <Button variant='ghost' className='h-9 sm:h-10 gap-2 px-1.5 sm:px-3 rounded-full hover:bg-accent'>
              <span className='hidden md:inline text-sm font-medium'>
                {firstName}
              </span>
              <Avatar className='h-7 w-7 sm:h-8 sm:w-8 border border-border transition-transform group-hover:scale-105'>
                <AvatarImage 
                  src={user.image ? (user.image.startsWith('http') || user.image.startsWith('/') ? user.image : `/${user.image}`) : undefined} 
                  alt={user.name || 'User'} 
                  className="object-cover"
                />
                <AvatarFallback className='text-xs font-bold bg-primary text-primary-foreground'>
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </HoverCardTrigger>
          <HoverCardContent align='end' className='w-56 p-0' sideOffset={8}>
            <div className='p-4 border-b border-border'>
              <p className='text-sm font-medium'>{user.name}</p>
              <p className='text-xs text-muted-foreground truncate'>
                {user.email}
              </p>
            </div>
            <div className='p-2'>
              <Link
                href='/account'
                className='flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-accent transition-colors'
              >
                <UserCircle className='h-4 w-4' />
                <span>My Account</span>
              </Link>
              <Link
                href='/orders'
                className='flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-accent transition-colors'
              >
                <Package className='h-4 w-4' />
                <span>My Orders</span>
              </Link>
              <Separator className='my-2' />
              <Link
                href='/admin/dashboard'
                className='flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-accent transition-colors'
              >
                <LayoutDashboard className='h-4 w-4' />
                <span>Admin Dashboard</span>
              </Link>
            </div>
            <div className='p-2 border-t border-border'>
              <button
                onClick={handleLogout}
                className='flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-destructive/10 text-destructive transition-colors w-full text-left'
              >
                <LogOut className='h-4 w-4' />
                <span>Logout</span>
              </button>
            </div>
          </HoverCardContent>
        </HoverCard>
      ) : (
        <Button asChild size='sm' className='h-8 sm:h-10 px-2 sm:px-4 ml-1 rounded-full'>
          <Link href='/auth'>
            <User className='h-4 w-4 sm:mr-2' />
            <span className='hidden sm:inline'>Login</span>
          </Link>
        </Button>
      )}
    </div>
  );
};
