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
      setIsScrolled(window.scrollY > 10);
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
        'sticky top-0 z-50 w-full transition-all duration-500 ease-in-out',
        isScrolled
          ? 'bg-background/80 backdrop-blur-xl border-b border-border/40 shadow-sm py-2 sm:py-3'
          : 'bg-transparent border-b border-transparent py-4 sm:py-5'
      )}
      role='banner'
    >
      <div className='container-wide flex items-center justify-between gap-2 sm:gap-4'>
        {/* Logo */}
        <Link
          href='/'
          className='flex shrink-0 items-center gap-3 group'
          aria-label='Electro home page'
        >
          <div className='relative w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center shadow-lg shadow-primary/25 group-hover:shadow-primary/40 group-hover:scale-105 transition-all duration-300'>
            <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <Zap className='h-6 w-6 text-white' fill="currentColor" />
          </div>
          <div className='hidden xs:block'>
            <span className='text-xl font-black tracking-tight text-foreground leading-none block'>
              Electro<span className="text-primary">.</span>
            </span>
            <span className='text-[11px] text-muted-foreground font-bold tracking-widest uppercase'>
              Premium Store
            </span>
          </div>
        </Link>

        {/* Search Bar - Hidden on very small screens, shown from sm up */}
        <div className='hidden md:block flex-1 max-w-sm lg:max-w-md xl:max-w-xl mx-8 transition-all duration-300'>
           <div className={cn(
               "transition-all duration-300",
               isScrolled ? "scale-100 opacity-100" : "scale-105"
           )}>
             <SearchBar />
           </div>
        </div>

        {/* Desktop Navigation - Shown from lg up */}
        <nav
          className='hidden lg:flex items-center mx-4'
          aria-label='Main navigation'
        >
          <div className='flex items-center gap-1 p-1.5 bg-secondary/50 dark:bg-secondary/20 border border-white/10 backdrop-blur-md rounded-full shadow-inner'>
            {navLinks.map((link) => {
              const isActive = isActiveLink(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'relative px-4 py-2 text-sm font-bold transition-all rounded-full duration-300',
                    isActive
                      ? 'text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-background/80',
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {isActive && (
                    <motion.span
                      layoutId='activeNavPill'
                      className='absolute inset-0 bg-gradient-to-r from-primary to-violet-600 rounded-full shadow-md shadow-primary/20'
                      transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                      style={{ borderRadius: 9999 }}
                    />
                  )}
                  <span className='relative z-10 flex items-center gap-2'>
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
      

    </header>
  );
};


export { Header };

