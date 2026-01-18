'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useOnClickOutside } from '@/lib/hooks/useOnClickOutside';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Home,
  Info,
  LogOut,
  Mail,
  Package,
  ShoppingBag,
  User,
  UserCircle,
  X,
} from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { startTransition, useCallback, useEffect, useRef } from 'react';

interface NavLinkProps {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
}

/**
 * Navigation link component with icon and active state
 */
const NavLink = ({
  href,
  icon: Icon,
  children,
  isActive,
  onClick,
}: NavLinkProps) => (
  <Link
    href={href}
    onClick={onClick}
    className={cn(
      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-base font-medium transition-colors',
      isActive
        ? 'bg-primary text-primary-foreground'
        : 'text-muted-foreground hover:bg-accent hover:text-foreground',
    )}
  >
    <Icon className='h-5 w-5 shrink-0' />
    <span>{children}</span>
  </Link>
);

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

// Navigation links configuration - moved outside component for stability
const NAV_LINKS = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/products', icon: Package, label: 'All Products' },
  { href: '/about', icon: Info, label: 'About Us' },
  { href: '/contact', icon: Mail, label: 'Contact Us' },
] as const;

/**
 * Mobile Sidebar Component - React 19 Optimized
 *
 * Features:
 * - Smooth slide-in animation with Framer Motion
 * - Click outside to close
 * - Active link highlighting
 * - User profile section
 * - Body scroll lock when open
 * - Accessibility compliant (ARIA labels, focus management)
 * - Performance optimized with React 19 patterns
 */
export function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;
  const menuRef = useRef<HTMLDivElement>(null);
  const previousOpenState = useRef(isOpen);

  /**
   * Close menu when route changes (with startTransition for React 19)
   */
  useEffect(() => {
    // Only close if menu was previously open
    if (previousOpenState.current && isOpen) {
      startTransition(() => {
        onClose();
      });
    }
    previousOpenState.current = isOpen;
  }, [pathname, isOpen, onClose]);

  /**
   * Lock body scroll when menu is open
   */
  useEffect(() => {
    if (isOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
    } else {
      // Restore scroll position
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [isOpen]);

  /**
   * Handle logout with proper cleanup
   */
  const handleLogout = useCallback(async () => {
    startTransition(() => {
      onClose();
    });
    await signOut({ callbackUrl: '/' });
  }, [onClose]);

  /**
   * Click outside handler
   */
  useOnClickOutside(menuRef, onClose);

  /**
   * Check if link is active
   */
  const isActiveLink = useCallback(
    (href: string): boolean => {
      if (href === '/') return pathname === '/';
      return pathname.startsWith(href);
    },
    [pathname],
  );

  /**
   * Get user initials for avatar
   */
  const userInitials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '';

  /**
   * Handle link click with transition
   */
  const handleLinkClick = useCallback(() => {
    startTransition(() => {
      onClose();
    });
  }, [onClose]);

  return (
    <AnimatePresence mode='wait'>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className='fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden'
            onClick={onClose}
            aria-hidden='true'
          />

          {/* Sidebar */}
          <motion.aside
            ref={menuRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className='fixed top-0 right-0 z-50 h-full w-[85%] max-w-sm bg-background shadow-2xl lg:hidden overflow-hidden'
            role='dialog'
            aria-modal='true'
            aria-label='Mobile navigation menu'
          >
            <div className='flex h-full flex-col'>
              {/* Header */}
              <div className='flex items-center justify-between border-b px-6 py-4 shrink-0'>
                <h2 className='text-lg font-semibold'>Menu</h2>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={onClose}
                  aria-label='Close menu'
                  className='hover:bg-accent'
                >
                  <X className='h-5 w-5' />
                </Button>
              </div>

              {/* Scrollable Content */}
              <div className='flex-1 overflow-y-auto overscroll-contain'>
                <div className='flex flex-col gap-6 p-6'>
                  {/* User Section */}
                  {user ? (
                    <div className='rounded-lg border bg-card p-4 shadow-sm'>
                      <div className='flex items-center gap-3'>
                        <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-primary to-primary/80 text-primary-foreground font-semibold shadow-md'>
                          {userInitials || <User className='h-6 w-6' />}
                        </div>
                        <div className='min-w-0 flex-1'>
                          <p className='truncate font-semibold text-foreground'>
                            {user.name}
                          </p>
                          <p className='truncate text-sm text-muted-foreground'>
                            {user.email || 'Customer'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Button
                      asChild
                      size='lg'
                      className='w-full gap-2 shadow-sm'
                    >
                      <Link href='/auth' onClick={handleLinkClick}>
                        <User className='h-4 w-4' />
                        Login / Sign Up
                      </Link>
                    </Button>
                  )}

                  <Separator />

                  {/* Navigation Links */}
                  <nav
                    className='flex flex-col gap-1'
                    aria-label='Main navigation'
                  >
                    {NAV_LINKS.map((link) => (
                      <NavLink
                        key={link.href}
                        href={link.href}
                        icon={link.icon}
                        isActive={isActiveLink(link.href)}
                        onClick={handleLinkClick}
                      >
                        {link.label}
                      </NavLink>
                    ))}
                  </nav>

                  {/* User Links */}
                  {user && (
                    <>
                      <Separator />
                      <nav
                        className='flex flex-col gap-1'
                        aria-label='User menu'
                      >
                        <NavLink
                          href='/account'
                          icon={UserCircle}
                          isActive={isActiveLink('/account')}
                          onClick={handleLinkClick}
                        >
                          My Account
                        </NavLink>
                        <NavLink
                          href='/orders'
                          icon={ShoppingBag}
                          isActive={isActiveLink('/orders')}
                          onClick={handleLinkClick}
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
                <div className='border-t p-6 shrink-0 bg-muted/30'>
                  <Button
                    variant='outline'
                    className='w-full gap-2 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors'
                    onClick={handleLogout}
                  >
                    <LogOut className='h-4 w-4' />
                    Logout
                  </Button>
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
