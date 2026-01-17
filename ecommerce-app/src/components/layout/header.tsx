'use client';

import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { setIsMenuOpen } from '@/lib/store/slices/uiSlice';
import { cn } from '@/lib/utils';
import {
  Briefcase,
  Headset,
  Info,
  LucideIcon,
  Menu,
  Package,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback } from 'react';
import { NavActions } from './nav-actions';
import { SearchBar } from './search-bar';

interface NavLink {
  href: string;
  label: string;
  icon?: LucideIcon;
}

const navLinks: NavLink[] = [
  { href: '/products', label: 'Products', icon: Package },
  { href: '/about', label: 'About', icon: Info },
  { href: '/contact', label: 'Customer Care', icon: Headset },
  { href: '/services', label: 'Services', icon: Briefcase },
];

/**
 * Header component with sticky navigation, search, and responsive mobile menu
 *
 * Features:
 * - Sticky header with backdrop blur
 * - Active link highlighting
 * - Mobile navigation drawer
 * - Accessible markup
 * - Optimized re-renders
 */
const Header = () => {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const isMenuOpen = useAppSelector((state) => state.ui.isMenuOpen);

  /**
   * Check if link is active
   */
  const isActiveLink = useCallback(
    (href: string): boolean => {
      if (href === '/') return pathname === '/';
      return pathname.startsWith(href);
    },
    [pathname]
  );

  /**
   * Toggle mobile menu
   */
  const toggleMobileMenu = () => {
    dispatch(setIsMenuOpen(!isMenuOpen));
  };

  return (
    <header
      className='sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/80 dark:bg-slate-950 dark:supports-backdrop-filter:bg-slate-900/80 dark:border-slate-800'
      role='banner'
    >
      <div className='container mx-auto flex h-20 items-center justify-between gap-4 px-4'>
        {/* Logo */}
        <Link
          href='/'
          className='flex shrink-0 items-center gap-2 group'
          aria-label='Electro home page'
        >
          <div className='w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors'>
            <Zap className='h-5 w-5 text-primary' />
          </div>
          <span className='hidden text-xl font-bold text-foreground sm:inline'>
            Electro
          </span>
        </Link>

        {/* Search Bar */}
        <div className='flex-1 max-w-md mx-4'>
          <SearchBar />
        </div>

        {/* Desktop Navigation */}
        <nav
          className='hidden items-center gap-4 lg:flex'
          aria-label='Main navigation'
        >
          {navLinks.map((link) => {
            const isActive = isActiveLink(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors relative',
                  isActive
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                {/* Icon */}
                <div className='group flex items-center gap-2'>
                  {link.icon && (
                    <link.icon
                      className={cn(
                        'mb-0.5 inline-block h-4 w-4 hover:text-foreground group shrink-0 items-center justify-center',
                        isActive
                          ? 'text-foreground'
                          : 'text-muted-foreground group-hover:text-foreground'
                      )}
                    />
                  )}
                  {link.label}
                </div>

                {isActive && (
                  <span className='absolute -bottom-2.5 left-0 right-0 h-0.5 bg-primary' />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Nav Actions (Cart, Theme, etc.) */}
        <div className='flex items-center'>
          <NavActions />

          {/* Mobile Menu Button */}
          <Button
            variant='ghost'
            size='icon'
            className='lg:hidden'
            onClick={toggleMobileMenu}
            aria-label='Open menu'
            aria-expanded={isMenuOpen}
          >
            <Menu className='h-5 w-5' />
          </Button>
        </div>
      </div>
    </header>
  );
};

export { Header };
