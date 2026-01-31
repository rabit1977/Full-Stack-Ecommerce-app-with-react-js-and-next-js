'use client';

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useOnClickOutside } from '@/lib/hooks/useOnClickOutside';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Briefcase,
    Headphones,
    Heart,
    Home,
    Info,
    Laptop,
    LayoutDashboard,
    LogOut,
    Mail,
    MapPin,
    Monitor,
    Moon,
    Package,
    ShoppingBag,
    Smartphone,
    Sun,
    User,
    UserCircle,
    X,
    Zap
} from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { startTransition, useCallback, useEffect, useRef } from 'react';
import { SearchBar } from './search-bar';

interface NavLinkProps {
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

const NavLink = ({
  href,
  icon: Icon,
  children,
  isActive,
  onClick,
  className,
}: NavLinkProps) => (
  <Link
    href={href}
    onClick={onClick}
    className={cn(
      'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200',
      isActive
        ? 'bg-primary/10 text-primary'
        : 'text-muted-foreground hover:bg-muted hover:text-foreground',
      className
    )}
  >
    {Icon && <Icon className={cn('h-5 w-5 shrink-0', isActive ? 'text-primary' : 'text-muted-foreground')} />}
    <span>{children}</span>
    {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
  </Link>
);

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES = [
  { href: '/products?category=Laptops', icon: Laptop, label: 'Laptops & Computers' },
  { href: '/products?category=Phones', icon: Smartphone, label: 'Phones & Tablets' },
  { href: '/products?category=Audio', icon: Headphones, label: 'Audio & Headphones' },
  { href: '/products?category=TVs', icon: Monitor, label: 'TVs & Displays' },
] as const;

export function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { data: session, status } = useSession();
  const user = session?.user;
  const menuRef = useRef<HTMLDivElement>(null);
  const previousOpenState = useRef(isOpen);

  // Close menu on path change
  useEffect(() => {
    if (previousOpenState.current && isOpen) {
      startTransition(() => onClose());
    }
    previousOpenState.current = isOpen;
  }, [pathname, isOpen, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      if (scrollY) window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [isOpen]);

  const handleLogout = useCallback(async () => {
    startTransition(() => onClose());
    await signOut({ callbackUrl: '/' });
  }, [onClose]);

  useOnClickOutside(menuRef, onClose);

  const isActiveLink = useCallback(
    (href: string) => {
      if (href === '/' && pathname === '/') return true;
      if (href !== '/' && pathname.startsWith(href)) return true;
      return false;
    },
    [pathname]
  );

  const userInitials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '';

  return (
    <AnimatePresence mode='wait'>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className='fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden'
            onClick={onClose}
            aria-hidden='true'
          />

          <motion.aside
            ref={menuRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className='fixed top-0 right-0 z-50 h-full w-[85%] max-w-sm bg-background shadow-2xl lg:hidden flex flex-col'
          >
            {/* Header */}
            <div className='flex items-center justify-between px-6 py-5 border-b shrink-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
              <Link href="/" onClick={onClose} className='flex items-center gap-3 group'>
                <div className='relative w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center shadow-md shadow-primary/20'>
                  <Zap className='h-5 w-5 text-white' fill="currentColor" />
                </div>
                <span className='font-bold text-lg tracking-tight'>Electro<span className="text-primary">.</span></span>
              </Link>
              <div className="flex items-center gap-2">
                 <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="h-8 w-8 rounded-full hover:bg-muted"
                 >
                    <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                 </Button>
                 <Button
                    variant='ghost'
                    size='icon'
                    onClick={onClose}
                    className='h-8 w-8 rounded-full hover:bg-muted'
                 >
                    <X className='h-5 w-5' />
                 </Button>
              </div>
            </div>

            {/* Mobile Search - Integrated into sidebar */}
            <div className="px-6 pt-6 pb-2">
               <div className="relative">
                  <SearchBar />
               </div>
            </div>

            <ScrollArea className='flex-1 py-6 px-4'>
              <div className='flex flex-col gap-6'>
                {/* User Profile Card */}
                {status === 'loading' ? (
                   <div className="bg-muted/30 rounded-2xl p-4 border border-border/50 space-y-4">
                      <div className="flex items-center gap-3">
                         <div className='h-12 w-12 rounded-full skeleton-enhanced' />
                         <div className='flex-1 space-y-2'>
                            <div className='h-4 w-24 skeleton-enhanced rounded' />
                            <div className='h-3 w-32 skeleton-enhanced rounded' />
                         </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                         <div className="h-9 w-full skeleton-enhanced rounded-md" />
                         <div className="h-9 w-full skeleton-enhanced rounded-md" />
                      </div>
                   </div>
                ) : user ? (
                   <div className="bg-muted/30 rounded-2xl p-4 border border-border/50">
                      <div className="flex items-center gap-3 mb-3">
                         <Avatar className='h-12 w-12 border-2 border-background shadow-sm'>
                            <AvatarImage src={user.image || undefined} />
                            <AvatarFallback className='bg-primary/10 text-primary font-bold'>
                               {userInitials}
                            </AvatarFallback>
                         </Avatar>
                         <div className='flex-1 min-w-0'>
                            <p className='font-semibold truncate leading-tight'>{user.name}</p>
                            <p className='text-xs text-muted-foreground truncate'>{user.email}</p>
                         </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 mt-2">
                         <Button asChild variant="outline" size="sm" className="w-full justify-start h-9 text-xs">
                            <Link href="/account" onClick={onClose}>
                               <UserCircle className="mr-2 h-3.5 w-3.5" />
                               Account
                            </Link>
                         </Button>
                         <Button asChild variant="outline" size="sm" className="w-full justify-start h-9 text-xs">
                            <Link href="/orders" onClick={onClose}>
                               <Package className="mr-2 h-3.5 w-3.5" />
                               Orders
                            </Link>
                         </Button>
                      </div>
                   </div>
                ) : (
                  <div className='bg-primary/5 rounded-2xl p-6 text-center space-y-3 border border-primary/10'>
                    <div className='w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto text-primary'>
                      <User className='h-6 w-6' />
                    </div>
                    <div>
                      <h3 className='font-bold text-foreground'>Welcome Guest</h3>
                      <p className='text-xs text-muted-foreground mt-1'>Sign in to access your account & orders</p>
                    </div>
                    <Button asChild className='w-full rounded-xl shadow-lg shadow-primary/20'>
                      <Link href='/auth/signin' onClick={onClose}>
                        Login / Register
                      </Link>
                    </Button>
                  </div>
                )}

                {/* Main Navigation */}
                <div className='space-y-1'>
                  <NavLink href='/' icon={Home} isActive={isActiveLink('/')} onClick={onClose}>
                    Home
                  </NavLink>
                  <NavLink href='/products' icon={ShoppingBag} isActive={isActiveLink('/products') && !pathname.includes('category')} onClick={onClose}>
                    Shop All Products
                  </NavLink>
                  
                  {/* Categories Accordion */}
                  <Accordion type="single" collapsible className="w-full border-none">
                     <AccordionItem value="categories" className="border-none">
                        <AccordionTrigger className="py-3 px-4 rounded-xl hover:bg-muted text-sm font-medium hover:no-underline text-muted-foreground">
                           <div className="flex items-center gap-3">
                              <Package className="h-5 w-5" />
                              <span>Categories</span>
                           </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-0 pt-1 px-2">
                           {CATEGORIES.map((cat) => (
                              <Link 
                                 key={cat.href}
                                 href={cat.href}
                                 onClick={onClose}
                                 className="flex items-center gap-3 py-2.5 px-4 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors ml-4"
                              >
                                 <cat.icon className="h-4 w-4" />
                                 {cat.label}
                              </Link>
                           ))}
                        </AccordionContent>
                     </AccordionItem>
                  </Accordion>
                </div>

                <Separator className="bg-border/50" />

                {/* Account & Support */}
                <div className='space-y-1'>
                  <p className='px-4 text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider'>
                     Account & Support
                  </p>
                  
                  {status === 'loading' ? (
                     <div className='space-y-1 px-4'>
                        {[1, 2, 3].map(i => (
                           <div key={i} className='h-10 w-full skeleton-enhanced rounded-xl' />
                        ))}
                     </div>
                  ) : user ? (
                    <>
                      <NavLink href='/wishlist' icon={Heart} isActive={isActiveLink('/wishlist')} onClick={onClose}>
                        My Wishlist
                      </NavLink>
                      <NavLink href='/account/addresses' icon={MapPin} isActive={isActiveLink('/account/addresses')} onClick={onClose}>
                        My Addresses
                      </NavLink>
                      
                      {user.role === 'ADMIN' && (
                        <NavLink href='/admin' icon={LayoutDashboard} isActive={isActiveLink('/admin')} onClick={onClose} className="text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-950/30">
                          Admin Dashboard
                        </NavLink>
                      )}
                    </>
                  ) : null}

                  <NavLink href='/services' icon={Briefcase} isActive={isActiveLink('/services')} onClick={onClose}>
                    Services
                  </NavLink>
                  <NavLink href='/about' icon={Info} isActive={isActiveLink('/about')} onClick={onClose}>
                    About Us
                  </NavLink>
                  <NavLink href='/contact' icon={Mail} isActive={isActiveLink('/contact')} onClick={onClose}>
                    Contact Support
                  </NavLink>
                </div>
              </div>
            </ScrollArea>

            {/* Footer */}
            {user && (
               <div className='p-4 border-t bg-muted/20'>
                  <Button 
                     variant="outline" 
                     className='w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20 h-11'
                     onClick={handleLogout}
                  >
                     <LogOut className='mr-2 h-4 w-4' />
                     Log Out
                  </Button>
               </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
