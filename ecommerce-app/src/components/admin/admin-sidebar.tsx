'use client';

import { cn } from '@/lib/utils';
import { LayoutDashboard, Package, ShoppingCart, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/users', label: 'Customers', icon: Users },
];

/**
 * Desktop Sidebar - visible on large screens
 */
export const AdminSidebar = () => {
  const pathname = usePathname();

  return (
    <aside className='hidden lg:block w-64 flex-shrink-0 sticky top-0 h-screen overflow-y-auto border-r bg-white dark:border-slate-800 dark:bg-slate-900'>
      <div className='flex h-full flex-col p-4'>
        <div className='mb-6 flex items-center gap-2 p-2'>
          <Package className='h-8 w-8 text-slate-900 dark:text-white' />
          <h1 className='text-xl font-bold dark:text-white'>Admin Panel</h1>
        </div>
        <nav className='flex flex-col gap-2'>
          {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white',
                  isActive &&
                    'bg-slate-100 font-semibold text-slate-900 dark:bg-slate-800 dark:text-white'
                )}
              >
                <link.icon className='h-5 w-5' />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

/**
 * Bottom Navigation Tabs - visible on mobile/tablet
 */
export const AdminBottomNav = () => {
  const pathname = usePathname();

  return (
    <nav className='lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t dark:bg-slate-900 dark:border-slate-800 shadow-lg'>
      <div className='grid grid-cols-4 h-16'>
        {navLinks.map((link) => {
          const isActive = pathname.startsWith(link.href);
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 text-xs transition-colors',
                isActive
                  ? 'text-slate-900 dark:text-white font-semibold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              )}
            >
              <Icon
                className={cn(
                  'h-5 w-5',
                  isActive && 'text-blue-600 dark:text-blue-400'
                )}
              />
              <span
                className={cn(
                  'truncate max-w-full px-1',
                  isActive && 'text-blue-600 dark:text-blue-400'
                )}
              >
                {link.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};


