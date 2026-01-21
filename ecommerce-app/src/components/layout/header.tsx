'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
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
  { href: '/contact', label: 'User Care', icon: Headset },
  { href: '/services', label: 'Services', icon: Briefcase },
];

interface HeaderProps {
  isMenuOpen: boolean;
  toggleMobileMenu: () => void;
  initialWishlistCount: number;
  initialCartItemCount: number;
}

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
const Header = ({
  isMenuOpen,
  toggleMobileMenu,
  initialWishlistCount,
  initialCartItemCount,
}: HeaderProps) => {
  const pathname = usePathname();

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

  return (
    <header
      className='sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/80 dark:bg-slate-1000/95 dark:supports-[backdrop-filter]:bg-slate-950/80 dark:border-slate-800 transition-all duration-300'
      role='banner'
    >
      <div className='container-wide flex h-16 sm:h-20 items-center justify-between gap-1 sm:gap-4'>
        {/* Logo */}
        <Link
          href='/'
          className='flex shrink-0 items-center gap-1.5 sm:gap-2 group'
          aria-label='Electro home page'
        >
          <div className='w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300'>
            <Zap className='h-4 w-4 sm:h-5 sm:w-5 text-primary' />
          </div>
          <span className='text-lg sm:text-xl font-bold tracking-tight text-foreground'>
            <span className='hidden xs:inline'>Electro</span>
          </span>
        </Link>

        {/* Search Bar - Hidden on very small screens, shown from sm up */}
        <div className='hidden sm:block flex-1 max-w-sm lg:max-w-md mx-2 sm:mx-4 transition-all duration-300'>
          <SearchBar />
        </div>

        {/* Desktop Navigation - Shown from lg up */}
        <nav
          className='hidden lg:flex items-center gap-1 xl:gap-2'
          aria-label='Main navigation'
        >
          {navLinks.map((link) => {
            const isActive = isActiveLink(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-3 py-2 text-sm font-medium transition-all rounded-md relative group/link',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50',
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <div className='flex items-center gap-2'>
                  {link.icon && (
                    <link.icon
                      className={cn(
                        'h-4 w-4 transition-colors',
                        isActive
                          ? 'text-primary'
                          : 'text-muted-foreground group-hover/link:text-foreground',
                      )}
                    />
                  )}
                  <span>{link.label}</span>
                </div>
                {isActive && (
                  <motion.span
                    layoutId='activeNav'
                    className='absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full'
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Nav Actions (Cart, Theme, etc.) */}
        <div className='flex items-center gap-0.5 sm:gap-1'>
          <NavActions
            initialWishlistCount={initialWishlistCount}
            initialCartItemCount={initialCartItemCount}
          />

          {/* Mobile Menu Button */}
          <Button
            variant='ghost'
            size='icon'
            className='lg:hidden h-9 w-9 sm:h-10 sm:w-10 ml-0.5 sm:ml-1'
            onClick={toggleMobileMenu}
            aria-label='Open menu'
            aria-expanded={isMenuOpen}
          >
            <Menu className='h-5 w-5' />
          </Button>
        </div>
      </div>
      
      {/* Mobile Search Bar - Visible only on mobile screens below sm */}
      <div className='sm:hidden px-4 pb-3 pt-0'>
        <SearchBar />
      </div>
    </header>
  );
};


export { Header };

