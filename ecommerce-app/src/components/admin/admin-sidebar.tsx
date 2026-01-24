'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
    ChevronRight,
    Home,
    LayoutDashboard,
    Package,
    Settings,
    ShoppingCart,
    Ticket,
    Users,
    Zap
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, description: 'Overview & stats' },
  { href: '/admin/products', label: 'Products', icon: Package, description: 'Manage catalog' },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart, description: 'Track orders' },
  { href: '/admin/users', label: 'Customers', icon: Users, description: 'User management' },
  { href: '/admin/coupons', label: 'Coupons', icon: Ticket, description: 'Discounts & promos' },
];

const quickLinks = [
  { href: '/', label: 'View Store', icon: Home },
];

/**
 * Premium Desktop Sidebar - visible on large screens
 */
export const AdminSidebar = () => {
  const pathname = usePathname();

  return (
    <aside className='hidden lg:flex w-72 shrink-0 sticky top-0 h-screen flex-col admin-sidebar border-r'>
      <div className='flex h-full flex-col'>
        {/* Logo Section */}
        <div className='p-6 border-b border-border/50'>
          <Link href='/admin/dashboard' className='flex items-center gap-3 group'>
            <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/25 group-hover:shadow-primary/40 transition-shadow'>
              <Zap className='h-5 w-5 text-white' />
            </div>
            <div>
              <h1 className='text-lg font-bold tracking-tight'>Electro Admin</h1>
              <p className='text-xs text-muted-foreground'>Store Management</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className='flex-1 overflow-y-auto py-6 px-4'>
          <div className='space-y-1.5'>
            {navLinks.map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  {/* Active Indicator */}
                  {isActive && (
                    <motion.div
                      layoutId='activeNavIndicator'
                      className='absolute inset-0 rounded-xl bg-primary'
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  
                  <span className='relative z-10 flex items-center gap-3 w-full'>
                    <link.icon className={cn(
                      'h-5 w-5 transition-transform group-hover:scale-110',
                      isActive ? 'text-primary-foreground' : ''
                    )} />
                    <div className='flex-1'>
                      <span className='block'>{link.label}</span>
                      <span className={cn(
                        'text-xs transition-colors',
                        isActive ? 'text-primary-foreground/70' : 'text-muted-foreground'
                      )}>
                        {link.description}
                      </span>
                    </div>
                    <ChevronRight className={cn(
                      'h-4 w-4 opacity-0 -translate-x-2 transition-all',
                      isActive && 'opacity-100 translate-x-0'
                    )} />
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Divider */}
          <div className='my-6 border-t border-border/50' />

          {/* Quick Links */}
          <div className='space-y-1'>
            <p className='px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3'>
              Quick Links
            </p>
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className='flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors'
              >
                <link.icon className='h-4 w-4' />
                <span>{link.label}</span>
              </Link>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className='p-4 border-t border-border/50 space-y-2'>
          <Link
            href='/admin/settings'
            className='flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors'
          >
            <Settings className='h-4 w-4' />
            <span>Settings</span>
          </Link>
        </div>
      </div>
    </aside>
  );
};

/**
 * Premium Bottom Navigation - visible on mobile/tablet
 */
export const AdminBottomNav = () => {
  const pathname = usePathname();

  return (
    <nav className='lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-t border-border/50 shadow-lg'>
      <div className='grid grid-cols-5 h-16 max-w-md mx-auto'>
        {navLinks.map((link) => {
          const isActive = pathname.startsWith(link.href);
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'relative flex flex-col items-center justify-center gap-1 text-xs transition-all duration-200',
                isActive
                  ? 'text-primary font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {/* Active Background */}
              {isActive && (
                <motion.div
                  layoutId='activeBottomNav'
                  className='absolute inset-x-2 top-1 bottom-1 rounded-xl bg-primary/10 dark:bg-primary/20'
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              
              <div className='relative z-10 flex flex-col items-center justify-center gap-0.5'>
                <Icon
                  className={cn(
                    'h-5 w-5 transition-all',
                    isActive && 'scale-110'
                  )}
                />
                <span
                  className={cn(
                    'truncate max-w-[60px] transition-all',
                    isActive && 'font-medium'
                  )}
                >
                  {link.label}
                </span>
              </div>
              
              {/* Active Dot Indicator */}
              {isActive && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className='absolute -top-0.5 w-1.5 h-1.5 rounded-full bg-primary'
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
