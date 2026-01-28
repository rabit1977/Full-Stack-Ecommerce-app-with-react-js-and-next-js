'use client';

import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity,
  BarChart,
  ChevronRight,
  Home,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  Moon,
  Package,
  RotateCcw,
  Settings,
  ShoppingCart,
  Star,
  Sun,
  Ticket,
  Users,
  Zap
} from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { UserAvatar } from '../shared/user-avatar';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';


const navLinks = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, description: 'Overview & stats' },
  { href: '/admin/products', label: 'Products', icon: Package, description: 'Manage catalog' },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart, description: 'Track orders' },
  { href: '/admin/users', label: 'Customers', icon: Users, description: 'User management' },
  { href: '/admin/coupons', label: 'Coupons', icon: Ticket, description: 'Discounts & promos' },
  { href: '/admin/questions', label: 'Q&A', icon: MessageCircle, description: 'Manage questions' },
  { href: '/admin/reviews', label: 'Reviews', icon: Star, description: 'User feedback' },
  { href: '/admin/returns', label: 'Returns', icon: RotateCcw, description: 'Requests & refunds' },
  { href: '/admin/activity', label: 'Activity', icon: Activity, description: 'Audit logs' },
];

const quickLinks = [
  { href: '/', label: 'View Store', icon: Home },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart },
];

/**
 * Premium Theme Toggle for Admin
 */
const AdminThemeToggle = () => {
    const { setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) {
        return <div className="w-8 h-8 rounded-lg bg-muted/20 animate-pulse" />;
    }

    const isDark = resolvedTheme === 'dark';

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="w-8 h-8 rounded-full bg-background/50 hover:bg-background border border-border/50 shadow-sm"
        >
            <AnimatePresence mode="wait" initial={false}>
                {isDark ? (
                    <motion.div
                        key="moon"
                        initial={{ scale: 0.5, opacity: 0, rotate: 90 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        exit={{ scale: 0.5, opacity: 0, rotate: -90 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Moon className="h-4 w-4 text-indigo-400" />
                    </motion.div>
                ) : (
                    <motion.div
                        key="sun"
                        initial={{ scale: 0.5, opacity: 0, rotate: -90 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        exit={{ scale: 0.5, opacity: 0, rotate: 90 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Sun className="h-4 w-4 text-amber-500" />
                    </motion.div>
                )}
            </AnimatePresence>
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
};

/**
 * Premium Desktop Sidebar - visible on large screens
 */
export const AdminSidebar = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <aside className='hidden lg:flex w-72 shrink-0 sticky top-0 h-screen flex-col bg-background/60 backdrop-blur-xl border-r border-border/40 z-40'>
      <div className='flex h-full flex-col'>
        {/* Logo Section */}
        <div className='p-8 pb-6'>
          <Link href='/admin/dashboard' className='flex items-center gap-3 group'>
            <div className='relative w-11 h-11 rounded-full bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center shadow-lg shadow-primary/25 group-hover:shadow-primary/40 group-hover:scale-105 transition-all duration-300'>
              <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <Zap className='h-6 w-6 text-white' fill="currentColor" />
            </div>
            <div>
              <h1 className='text-xl font-black tracking-tight text-foreground'>Electro<span className="text-primary">Admin</span></h1>
              <p className='text-xs font-semibold text-muted-foreground tracking-wide'>STORE MANAGER</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className='flex-1 overflow-y-auto px-4 py-4 space-y-8 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent'>
          <div className='space-y-2'>
            <p className='px-4 text-xs font-bold text-muted-foreground/70 uppercase tracking-widest mb-3 ml-1'>
               Main Menu
            </p>
            {navLinks.map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'group relative flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium transition-all duration-300',
                    isActive
                      ? 'text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]'
                      : 'text-muted-foreground hover:bg-white/50 dark:hover:bg-white/5 hover:text-foreground hover:translate-x-1'
                  )}
                >
                  {/* Active Background with Motion */}
                  {isActive && (
                    <motion.div
                      layoutId='activeNavSidebar'
                      className='absolute inset-0 rounded-xl bg-gradient-to-r from-primary to-violet-600'
                      transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                    />
                  )}
                  
                  <span className='relative z-10 flex items-center gap-3.5 w-full'>
                    <div className={cn(
                        "p-1 rounded-full transition-all duration-300", 
                        !isActive && "bg-secondary/50 group-hover:bg-white dark:group-hover:bg-white/10"
                    )}>
                        <link.icon className={cn(
                          'h-5 w-5 transition-transform duration-300',
                          isActive ? 'text-primary-foreground' : 'group-hover:scale-110'
                        )} />
                    </div>
                    
                    <div className='flex-1 flex flex-col justify-center'>
                      <span className={cn('block leading-none', isActive ? 'font-bold' : 'font-semibold')}>{link.label}</span>
                      {isActive && (
                         <motion.span 
                           initial={{ opacity: 0, height: 0 }} 
                           animate={{ opacity: 1, height: 'auto' }}
                           className='text-[10px] text-white/80 font-medium mt-1'
                         >
                           {link.description}
                         </motion.span>
                      )}
                    </div>
                    <ChevronRight className={cn(
                      'h-4 w-4 transition-all duration-300',
                      isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 group-hover:opacity-50 group-hover:translate-x-0'
                    )} />
                  </span>
                </Link>
              );
            })}
          </div>
          <hr className="border border-border/50" />
          {/* Quick Links Group */}
          <div className='space-y-2'>
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className='group  flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-white/50 dark:hover:bg-white/5 hover:text-foreground transition-all duration-200'
              >
                <div className="p-1.5 rounded-full bg-secondary/50 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                   <link.icon className='h-4 w-4' />
                </div>
                <span>{link.label}</span>
              </Link>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className='p-4 m-4 mt-0 bg-secondary/30 rounded-2xl border border-border/50 backdrop-blur-sm'>
          <div className="flex items-center justify-between mb-3">
             <div className="flex items-center gap-3">
                 <UserAvatar 
                    user={user} 
                    className="h-8 w-8 ring-2 ring-white dark:ring-slate-900 border border-white/20"
                    fallbackClassName="text-xs"
                 />
                 <div className="min-w-0">
                    <p className="text-sm font-bold truncate max-w-[90px]">{user?.name || 'Admin User'}</p>
                    <p className="text-[10px] text-muted-foreground truncate font-medium uppercase tracking-wide">Administrator</p>
                 </div>
             </div>
             <AdminThemeToggle />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Link
                href='/admin/settings'
                className='flex items-center justify-center gap-2 w-full rounded-xl bg-background/50 border border-border/50 px-3 py-2 text-[10px] font-bold hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all shadow-sm'
            >
                <Settings className='h-3 w-3' />
                <span>Settings</span>
            </Link>
            <button
                onClick={() => signOut()}
                className='flex items-center justify-center gap-2 w-full rounded-xl bg-background/50 border border-border/50 px-3 py-2 text-[10px] font-bold hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-all shadow-sm'
            >
                <LogOut className='h-3 w-3' />
                <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

/**
 * Mobile Header for Admin - visible on mobile/tablet
 * Provides a place for logout/settings that isn't hidden by bottom nav
 */
export const AdminMobileHeader = () => {
    const { data: session } = useSession();
    const user = session?.user;

    return (
        <header className='lg:hidden fixed top-0 left-0 right-0 z-50 w-full bg-background border-b border-border/50 px-4 h-16 flex items-center justify-between shadow-sm'>
             <Link href='/admin/dashboard' className='flex items-center gap-2'>
                <div className='w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center shadow-md shadow-primary/20'>
                    <Zap className='h-4 w-4 text-white' fill="currentColor" />
                </div>
                <span className='font-bold text-lg tracking-tight'>Electro<span className="text-primary">Admin</span></span>
            </Link>

            <div className="flex items-center gap-3 transition-colors group">
              <Link href="/" className="flex items-center gap-1.5 sm:group-hover:bg-secondary/50 p-2 rounded-xl transition-colors">
                <Home className="h-7 w-7 rounded-full bg-secondary/20 text-muted-foreground group-hover:text-indigo-400 transition-colors dark:text-indigo-400 hover:bg-indigo-400/10  border-1 border-text-foreground p-1.5" />
                <span className="hidden sm:block text-sm font-medium text-muted-foreground group-hover:text-indigo-400 transition-colors">View Store</span>
              </Link>
              <AdminThemeToggle />
              <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 p-0 border border-border/50 bg-secondary/20 overflow-hidden">
                        <UserAvatar 
                            user={user}
                            className="h-full w-full"
                            fallbackClassName="text-[10px]"
                        />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 glass-card p-2 rounded-xl">
                    <DropdownMenuItem asChild className="rounded-lg">
                        <Link href="/admin/settings" className="w-full flex items-center cursor-pointer">
                            <Settings className="mr-2 h-4 w-4" />
                            Settings
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                        className="rounded-lg text-destructive focus:text-destructive cursor-pointer"
                        onClick={() => signOut()}
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                    </DropdownMenuItem>
                </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}

/**
 * Premium Bottom Navigation - visible on mobile/tablet
 */
export const AdminBottomNav = () => {
  const pathname = usePathname();

  return (
    <nav className='lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-2xl border-t border-border/50 shadow-2xl safe-area-pb'>
      <div className='grid grid-cols-5 h-20 items-end pb-2 max-w-md mx-auto'>
        {navLinks.map((link) => {
          const isActive = pathname.startsWith(link.href);
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'relative flex flex-col items-center justify-center h-full gap-1 text-xs transition-all duration-300',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <div className='relative z-10 flex flex-col items-center justify-center gap-1 group'>
                <div className={cn(
                    "p-1.5 rounded-xl transition-all duration-300",
                    isActive ? "bg-primary/10 -translate-y-1" : "group-hover:bg-secondary/50"
                )}>
                    <Icon
                    className={cn(
                        'h-5 w-5 transition-all',
                        isActive && 'scale-110'
                    )}
                    />
                </div>
                <span
                  className={cn(
                    'text-[10px] font-medium transition-all',
                    isActive ? 'font-bold translate-y-[-2px]' : 'scale-90 opacity-80'
                  )}
                >
                  {link.label}
                </span>
              </div>
              
              {/* Active Indicator */}
              {isActive && (
                <motion.div
                  layoutId='activeBottomIndicator'
                  className='absolute bottom-1 w-1 h-1 rounded-full bg-primary'
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
