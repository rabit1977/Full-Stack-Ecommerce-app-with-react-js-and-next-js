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
import { useCallback, useEffect, useState } from 'react';
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
  { href: '/contact', label: 'Support', icon: Headset },
  { href: '/services', label: 'Services', icon: Briefcase },
];

interface HeaderProps {
  isMenuOpen: boolean;
  toggleMobileMenu: () => void;
  initialWishlistCount: number;
  initialCartItemCount: number;
}

/**
 * Premium Header with scroll effects, glass morphism, and smooth animations
 */
const Header = ({
  isMenuOpen,
  toggleMobileMenu,
  initialWishlistCount,
  initialCartItemCount,
}: HeaderProps) => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        isScrolled
          ? 'bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-sm'
          : 'bg-background/80 backdrop-blur-sm border-b border-transparent'
      )}
      role='banner'
    >
      <div className='container-wide flex h-16 sm:h-18 lg:h-20 items-center justify-between gap-2 sm:gap-4'>
        {/* Logo */}
        <Link
          href='/'
          className='flex shrink-0 items-center gap-2 sm:gap-2.5 group'
          aria-label='Electro home page'
        >
          <div className='w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/25 group-hover:shadow-primary/40 transition-all duration-300 group-hover:scale-105'>
            <Zap className='h-5 w-5 sm:h-5 sm:w-5 text-white' />
          </div>
          <div className='hidden xs:block'>
            <span className='text-lg sm:text-xl font-bold tracking-tight text-foreground'>
              Electro
            </span>
            <span className='hidden sm:block text-[10px] text-muted-foreground font-medium -mt-0.5'>
              Premium Tech
            </span>
          </div>
        </Link>

        {/* Search Bar - Hidden on very small screens, shown from sm up */}
        <div className='hidden sm:block flex-1 max-w-sm lg:max-w-md xl:max-w-lg mx-4 transition-all duration-300'>
          <SearchBar />
        </div>

        {/* Desktop Navigation - Shown from lg up */}
        <nav
          className='hidden lg:flex items-center'
          aria-label='Main navigation'
        >
          <div className='flex items-center p-1 bg-muted/50 dark:bg-muted/20 border border-white/10 backdrop-blur-md rounded-full'>
            {navLinks.map((link) => {
              const isActive = isActiveLink(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'relative px-5 py-2 text-sm font-medium transition-all rounded-full duration-300',
                    isActive
                      ? 'text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-white/50 dark:hover:bg-white/5',
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {isActive && (
                    <motion.span
                      layoutId='activeNavPill'
                      className='absolute inset-0 bg-primary/90 rounded-full shadow-lg shadow-primary/25 ring-1 ring-white/10'
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      style={{ borderRadius: 9999 }}
                    />
                  )}
                  <span className='relative z-10 flex items-center gap-2'>
                    {link.icon && (
                      <link.icon className={cn('h-4 w-4', isActive ? 'text-white' : 'text-current')} />
                    )}
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Nav Actions (Cart, Theme, etc.) */}
        <div className='flex items-center gap-1 sm:gap-2'>
          <NavActions
            initialWishlistCount={initialWishlistCount}
            initialCartItemCount={initialCartItemCount}
          />

          {/* Mobile Menu Button */}
          <Button
            variant='ghost'
            size='icon'
            className={cn(
              'lg:hidden h-10 w-10 rounded-xl transition-all duration-200',
              isMenuOpen && 'bg-primary text-primary-foreground'
            )}
            onClick={toggleMobileMenu}
            aria-label='Open menu'
            aria-expanded={isMenuOpen}
          >
            <Menu className='h-5 w-5' />
          </Button>
        </div>
      </div>
      
      {/* Mobile Search Bar - Visible only on mobile screens below sm */}
      <motion.div 
        className='sm:hidden px-4 pb-3'
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <SearchBar />
      </motion.div>
    </header>
  );
};


export { Header };

