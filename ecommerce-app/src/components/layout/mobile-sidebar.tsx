'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { setIsMenuOpen } from '@/lib/store/slices/uiSlice';
import { logout } from '@/lib/store/thunks/authThunks';
import { useOnClickOutside } from '@/lib/hooks/useOnClickOutside';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  LogOut, 
  User, 
  X, 
  Home, 
  Package, 
  Info, 
  Mail,
  UserCircle,
  ShoppingBag
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useMemo, useRef } from 'react';

interface NavLinkProps {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  onClick: () => void;
  isActive?: boolean;
}

/**
 * Navigation link component with icon and active state
 */
const NavLink = ({ href, icon: Icon, children, onClick, isActive }: NavLinkProps) => (
  <Link
    href={href}
    onClick={onClick}
    className={cn(
      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-base font-medium transition-colors',
      isActive
        ? 'bg-primary text-primary-foreground'
        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
    )}
  >
    <Icon className='h-5 w-5 flex-shrink-0' />
    <span>{children}</span>
  </Link>
);

/**
 * Mobile sidebar component with slide-in animation
 * 
 * Features:
 * - Smooth slide-in animation with Framer Motion
 * - Click outside to close
 * - Active link highlighting
 * - User profile section
 * - Proper logout handling
 * - Accessibility attributes
 */
const MobileSidebar = () => {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const user = useAppSelector((state) => state.user.user);
  const isMenuOpen = useAppSelector((state) => state.ui.isMenuOpen);
  const menuRef = useRef<HTMLDivElement>(null);

  /**
   * Close menu handler
   */
  const closeMenu = useCallback(() => {
    dispatch(setIsMenuOpen(false));
  }, [dispatch]);

  /**
   * Handle logout with proper cleanup
   */
  const handleLogout = useCallback(() => {
    dispatch(logout());
    closeMenu();
  }, [dispatch, closeMenu]);

  /**
   * Click outside handler
   */
  useOnClickOutside(menuRef, closeMenu);

  /**
   * Navigation links configuration
   */
  const navLinks = useMemo(() => [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/products', icon: Package, label: 'All Products' },
    { href: '/about', icon: Info, label: 'About Us' },
    { href: '/contact', icon: Mail, label: 'Contact Us' },
  ], []);

  /**
   * Check if link is active
   */
  const isActiveLink = useCallback((href: string): boolean => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  }, [pathname]);

  /**
   * Get user initials for avatar
   */
  const userInitials = useMemo(() => {
    if (!user?.name) return '';
    return user.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }, [user]);

  return (
    <AnimatePresence>
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className='fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden'
            onClick={closeMenu}
            aria-hidden='true'
          />

          {/* Sidebar */}
          <motion.div
            ref={menuRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className='fixed top-0 right-0 z-50 h-full w-[85%] max-w-sm bg-background shadow-2xl lg:hidden'
            role='dialog'
            aria-modal='true'
            aria-label='Mobile navigation menu'
          >
            <div className='flex h-full flex-col'>
              {/* Header */}
              <div className='flex items-center justify-between border-b px-6 py-4'>
                <h2 className='text-lg font-semibold'>Menu</h2>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={closeMenu}
                  aria-label='Close menu'
                >
                  <X className='h-5 w-5' />
                </Button>
              </div>

              {/* Scrollable Content */}
              <div className='flex-1 overflow-y-auto'>
                <div className='flex flex-col gap-6 p-6'>
                  {/* User Section */}
                  {user ? (
                    <div className='rounded-lg border bg-card p-4'>
                      <div className='flex items-center gap-3'>
                        <div className='flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold'>
                          {userInitials || <User className='h-6 w-6' />}
                        </div>
                        <div className='min-w-0 flex-1'>
                          <p className='truncate font-semibold'>{user.name}</p>
                          <p className='truncate text-sm text-muted-foreground'>
                            {user.email || user.role || 'Customer'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Button asChild size='lg' className='w-full gap-2'>
                      <Link href='/auth' onClick={closeMenu}>
                        <User className='h-4 w-4' />
                        Login / Sign Up
                      </Link>
                    </Button>
                  )}

                  <Separator />

                  {/* Navigation Links */}
                  <nav className='flex flex-col gap-1' aria-label='Main navigation'>
                    {navLinks.map((link) => (
                      <NavLink
                        key={link.href}
                        href={link.href}
                        icon={link.icon}
                        onClick={closeMenu}
                        isActive={isActiveLink(link.href)}
                      >
                        {link.label}
                      </NavLink>
                    ))}
                  </nav>

                  {/* User Links */}
                  {user && (
                    <>
                      <Separator />
                      <nav className='flex flex-col gap-1' aria-label='User menu'>
                        <NavLink
                          href='/account'
                          icon={UserCircle}
                          onClick={closeMenu}
                          isActive={isActiveLink('/account')}
                        >
                          My Account
                        </NavLink>
                        <NavLink
                          href='/orders'
                          icon={ShoppingBag}
                          onClick={closeMenu}
                          isActive={isActiveLink('/orders')}
                        >
                          My Orders
                        </NavLink>
                      </nav>
                    </>
                  )}
                </div>
              </div>

              {/* Footer (Logout) */}
              {user && (
                <div className='border-t p-6'>
                  <Button
                    variant='outline'
                    className='w-full gap-2 text-destructive hover:bg-destructive hover:text-destructive-foreground'
                    onClick={handleLogout}
                  >
                    <LogOut className='h-4 w-4' />
                    Logout
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export { MobileSidebar };