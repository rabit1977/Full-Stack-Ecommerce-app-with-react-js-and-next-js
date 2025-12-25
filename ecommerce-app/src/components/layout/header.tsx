'use client';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
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
import { useCallback, useState } from 'react';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
   * Close mobile menu
   */
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className='sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:bg-slate-950 dark:supports-[backdrop-filter]:bg-slate-900/80 dark:border-slate-800'
      role='banner'
    >
      <div className='container mx-auto flex h-20 items-center justify-between gap-4 px-4'>
        {/* Logo */}
        <Link
          href='/'
          className='flex flex-shrink-0 items-center gap-2 group'
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
                        'mb-0.5 inline-block h-4 w-4  hover:text-foreground group flex-shrink-0 items-center justify-center',
                        isActive
                          ? 'text-foreground'
                          : 'text-muted-foreground group-hover:text-foreground'
                      )}
                    />
                  )}
                  {link.label}
                </div>

                {isActive && (
                  <span className='absolute -bottom-[10px] left-0 right-0 h-0.5 bg-primary' />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Nav Actions (Cart, Theme, etc.) */}
        <div className='flex items-center'>
          <NavActions />

          {/* Mobile Menu Button */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant='ghost'
                size='icon'
                className='lg:hidden'
                aria-label='Open menu'
              >
                <Menu className='h-5 w-5' />
              </Button>
            </SheetTrigger>
            <div>
              <SheetContent side='right' className='w-[280px] sm:w-[350px] '>
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>

                {/* Mobile Navigation Links */}
                <nav
                  className='mt-8 flex flex-col gap-4'
                  aria-label='Mobile navigation'
                >
                  {navLinks.map((link) => {
                    const isActive = isActiveLink(link.href);
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={closeMobileMenu}
                        className={cn(
                          'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ',
                          isActive
                            ? 'bg-primary/10 text-primary'
                            : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                        )}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </nav>
              </SheetContent>
            </div>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export { Header };
