'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Heart, Home, Menu, Search, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface MobileBottomNavProps {
  onMenuClick: () => void;
  wishlistCount?: number;
  cartCount?: number;
}

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/products', icon: Search, label: 'Browse' },
  { href: '/wishlist', icon: Heart, label: 'Wishlist', showBadge: true },
  { href: '/cart', icon: ShoppingCart, label: 'Cart', showBadge: true },
];

/**
 * Mobile Bottom Navigation Bar
 * Shows on mobile devices with wishlist quick access
 */
export function MobileBottomNav({ 
  onMenuClick, 
  wishlistCount = 0, 
  cartCount = 0 
}: MobileBottomNavProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <nav 
      className='fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-lg border-t border-border lg:hidden'
      aria-label='Mobile navigation'
    >
      <div className='flex items-center justify-around h-16 px-2'>
        {navItems.map((item) => {
          const active = isActive(item.href);
          const badgeCount = item.href === '/wishlist' ? wishlistCount : item.href === '/cart' ? cartCount : 0;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative flex flex-col items-center justify-center gap-1 py-2 px-4 rounded-xl transition-all duration-200',
                active 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {active && (
                <motion.div
                  layoutId='mobileNavActive'
                  className='absolute inset-0 bg-primary/10 rounded-xl'
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <div className='relative z-10'>
                <item.icon className={cn('h-5 w-5', active && 'scale-110')} />
                {item.showBadge && badgeCount > 0 && (
                  <span className='absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center'>
                    {badgeCount > 9 ? '9+' : badgeCount}
                  </span>
                )}
              </div>
              <span className={cn(
                'text-[10px] font-medium z-10',
                active && 'font-semibold'
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
        
        {/* Menu Button */}
        <button
          onClick={onMenuClick}
          className='flex flex-col items-center justify-center gap-1 py-2 px-4 rounded-xl text-muted-foreground hover:text-foreground transition-colors'
          aria-label='Open menu'
        >
          <Menu className='h-5 w-5' />
          <span className='text-[10px] font-medium'>Menu</span>
        </button>
      </div>
      
      {/* Safe area spacer for iOS */}
      <div className='h-[env(safe-area-inset-bottom)]' />
    </nav>
  );
}
