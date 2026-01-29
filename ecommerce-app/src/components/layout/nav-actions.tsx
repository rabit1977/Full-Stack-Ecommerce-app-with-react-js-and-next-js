'use client';

import { getUnreadCountAction } from '@/actions/notification-actions';
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
  Bell,
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
  const [notificationCount, setNotificationCount] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [lastSeenAlertCount, setLastSeenAlertCount] = useState(0);
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

  // Poll for unread notifications
  useEffect(() => {
    if (!user) return;

    const fetchUnreadCount = async () => {
      try {
        const count = await getUnreadCountAction();
        setNotificationCount(count);
      } catch (error) {
        // Silently fail
      }
    };

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [user]);

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
  const totalAlerts = wishlistCount + notificationCount;
  
  // Handle menu open change
  const handleOpenChange = useCallback((open: boolean) => {
    setIsDropdownOpen(open);
    if (open) {
        // When menu opens, we acknowledge the current alerts
        setLastSeenAlertCount(totalAlerts);
    }
  }, [totalAlerts]);

  // Render a skeleton loader until the component has mounted on the client
  if (!hasMounted) {
    return (
      <div className='flex items-center gap-1 sm:gap-2'>
        <Skeleton className='h-10 w-10 rounded-full' />
        <Skeleton className='hidden sm:block h-10 w-10 rounded-full' />
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

      {/* Shopping Cart (Kept separate as it's a primary action) */}
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
        <DropdownMenu onOpenChange={handleOpenChange}>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='relative h-10 gap-2 pl-2 pr-3 rounded-full hover:bg-muted/50 dark:hover:bg-muted/20 data-[state=open]:bg-muted/50 ml-1'>
              <UserAvatar 
                user={user}
                className='h-8 w-8 border-2 border-background shadow-sm transition-transform group-hover:scale-105'
                fallbackClassName='text-xs font-bold bg-gradient-to-br from-primary to-violet-600 text-white'
              />
              <span className='hidden md:inline text-sm font-semibold truncate max-w-[100px]'>
                {firstName}
              </span>
              
              {/* Combined Alert Badge on Avatar - Hides when menu is open OR after seeing alerts */}
              <AnimatePresence>
                {totalAlerts > 0 && totalAlerts > lastSeenAlertCount && !isDropdownOpen && (
                   <motion.div
                   key='user-badge'
                   initial={{ scale: 0 }}
                   animate={{ scale: 1 }}
                   exit={{ scale: 0 }}
                   className='absolute right-0 top-0'
                 >
                   <Badge
                     variant='default'
                     className='h-4 min-w-4 px-1 rounded-full flex items-center justify-center text-[10px] font-bold bg-rose-500 text-white border-2 border-background shadow-xs ring-1 ring-white'
                   >
                     {totalAlerts > 99 ? '99+' : totalAlerts}
                   </Badge>
                 </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='w-64 p-2 rounded-2xl glass-card border-border/50 shadow-xl z-[100]' align='end' sideOffset={10}>
             <DropdownMenuLabel className="font-normal p-2">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-bold leading-none">{user.name}</p>
                  <p className="text-xs leading-none text-muted-foreground truncate">{user.email}</p>
                </div>
              </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border/50" />
            <DropdownMenuGroup>
                <DropdownMenuItem asChild className="rounded-xl cursor-pointer focus:bg-muted/50 h-10">
                  <Link href='/account' className='flex items-center gap-2 w-full'>
                    <UserCircle className='h-4 w-4 mr-2 text-muted-foreground' />
                    <span className="flex-1">My Account</span>
                  </Link>
                </DropdownMenuItem>

                {/* Notifications Item */}
                <DropdownMenuItem asChild className="rounded-xl cursor-pointer focus:bg-muted/50 h-10">
                   <Link href='/account/notifications' className='flex items-center gap-2 w-full'>
                      <Bell className={cn('h-4 w-4 mr-2 text-muted-foreground', notificationCount > 0 && "text-primary fill-primary")} />
                      <span className="flex-1">Notifications</span>
                      {notificationCount > 0 && (
                          <Badge variant="secondary" className="ml-auto h-5 px-1.5 min-w-5 justify-center bg-primary/10 text-primary hover:bg-primary/20">
                              {notificationCount}
                          </Badge>
                      )}
                   </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild className="rounded-xl cursor-pointer focus:bg-muted/50 h-10">
                  <Link href='/orders' className='flex items-center gap-2 w-full'>
                    <Package className='h-4 w-4 mr-2 text-muted-foreground' />
                    <span className="flex-1">My Orders</span>
                  </Link>
                </DropdownMenuItem>
                
                {/* Wishlist Item */}
                 <DropdownMenuItem asChild className="rounded-xl cursor-pointer focus:bg-muted/50 h-10">
                  <Link href='/wishlist' className='flex items-center gap-2 w-full'>
                    <Heart className={cn('h-4 w-4 mr-2 text-muted-foreground', wishlistCount > 0 && "text-rose-500 fill-rose-500")} />
                    <span className="flex-1">Wishlist</span>
                    {wishlistCount > 0 && (
                        <Badge variant="secondary" className="ml-auto h-5 px-1.5 min-w-5 justify-center bg-rose-500/10 text-rose-500 hover:bg-rose-500/20">
                            {wishlistCount}
                        </Badge>
                    )}
                  </Link>
                </DropdownMenuItem>
                
                {user.role === 'ADMIN' && (
                  <>
                  <DropdownMenuSeparator className="bg-border/50 my-1" />
                  <DropdownMenuItem asChild className="rounded-xl cursor-pointer focus:bg-primary/10 focus:text-primary h-10">
                    <Link href='/admin/dashboard' className='flex items-center gap-2 w-full'>
                      <LayoutDashboard className='h-4 w-4 mr-2 text-primary' />
                      <span className="font-semibold text-primary">Admin Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  </>
                )}
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-border/50" />
            <DropdownMenuItem 
                onClick={handleLogout}
                className="rounded-xl cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive h-10"
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
