import { getCartAction } from '@/actions/cart-actions';
import { getMyOrdersAction } from '@/actions/order-actions';
import { getWishlistAction } from '@/actions/wishlist-actions';
import { auth } from '@/auth';
import { AccountStats } from '@/components/account/AccountStats';
import AuthGuard from '@/components/auth/auth-guard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils/formatters';
import {
  Calendar,
  Heart,
  Mail,
  MapPin,
  Package,
  Settings,
  Shield,
  ShoppingCart,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';

/**
 * Account Page Component
 *
 * Production-ready account dashboard with:
 * - Responsive grid layout
 * - Consistent typography scale
 * - Proper dark mode support
 * - Accessible markup
 * - Clean visual hierarchy
 */
const AccountPage = async () => {
  const session = await auth();
  const user = session?.user;

  // Fetch user data in parallel
  const [ordersResult, cartResult, wishlistResult] = await Promise.all([
    getMyOrdersAction(),
    getCartAction(),
    getWishlistAction(),
  ]);

  const orders = ordersResult.data ?? [];
  const cartItems = cartResult.items ?? [];
  const wishlist = wishlistResult.wishlist ?? [];

  // Calculate statistics
  const stats = {
    totalOrders: orders.length,
    totalSpent: orders.reduce((sum: number, order) => sum + order.total, 0),
    cartItemsCount: cartItems.reduce(
      (sum: number, item: { quantity: number }) => sum + item.quantity,
      0,
    ),
    wishlistItemsCount: wishlist.length,
  };

  // Format member since date
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'N/A';

  // Get user initials for avatar
  const userInitials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  return (
    <AuthGuard>
      <div className='min-h-screen bg-slate-50 dark:bg-slate-950/50'>
        <div className='container-wide py-10 sm:py-16'>
          {/* Profile Header */}
          <header className='mb-10 sm:mb-16 rounded-3xl p-8 sm:p-12 glass-card relative overflow-hidden'>
             <div className='absolute inset-0 bg-linear-to-r from-primary/5 via-transparent to-primary/5 opacity-50' />
             
             <div className='relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-8'>
               {/* Avatar */}
               <div className='relative group shrink-0'>
                 <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                 <Avatar className='w-28 h-28 sm:w-32 sm:h-32 rounded-3xl shadow-2xl ring-4 ring-white/50 dark:ring-white/10'>
                   <AvatarImage 
                     src={user?.image ? (user.image.startsWith('http') || user.image.startsWith('/') ? user.image : `/${user.image}`) : undefined} 
                     alt={user?.name || 'User'} 
                     className="object-cover"
                   />
                   <AvatarFallback className='text-4xl sm:text-5xl font-black bg-gradient-to-br from-primary to-violet-600 text-white'>
                     {userInitials}
                   </AvatarFallback>
                 </Avatar>
                 <div className='absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full border-[3px] border-white dark:border-slate-900 flex items-center justify-center shadow-sm'>
                   <div className='w-2.5 h-2.5 bg-white rounded-full animate-pulse' />
                 </div>
               </div>

               {/* User Info */}
               <div className='flex-1 text-center sm:text-left space-y-4 w-full'>
                 <div>
                   <h1 className='text-3xl sm:text-5xl font-black tracking-tight text-foreground mb-3'>
                     <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                        {user?.name || 'Welcome Back'}
                     </span>
                   </h1>
                   <div className='flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-6 text-muted-foreground font-medium'>
                     <div className='flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-full backdrop-blur-sm'>
                       <Mail className='h-4 w-4 text-primary' />
                       <span className='truncate max-w-[200px]'>
                         {user?.email || 'user@example.com'}
                       </span>
                     </div>
                     <div className='flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-full backdrop-blur-sm'>
                       <Calendar className='h-4 w-4 text-primary' />
                       <span>Member since {memberSince}</span>
                     </div>
                   </div>
                 </div>

                 <div className='flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2'>
                   <Badge
                     variant='secondary'
                     className='h-8 px-4 text-sm bg-primary/10 text-primary border border-primary/20'
                   >
                     <Shield className='h-3.5 w-3.5 mr-1.5' />
                     <span className='capitalize font-bold'>
                       {user?.role || 'User'}
                     </span>
                   </Badge>
                   {stats.totalOrders > 0 && (
                     <Badge variant='outline' className='h-8 px-4 text-sm border-border bg-background/50 backdrop-blur-sm'>
                       <TrendingUp className='h-3.5 w-3.5 mr-1.5' />
                       {stats.totalOrders} Orders
                     </Badge>
                   )}
                 </div>
               </div>

               {/* Edit Profile Button - Desktop */}
               <div className='hidden sm:block shrink-0'>
                 <Link href='/account/edit'>
                   <Button
                     className='h-12 px-6 rounded-xl font-bold bg-white/10 hover:bg-white/20 text-foreground border border-white/20 backdrop-blur-md shadow-lg transition-all hover:scale-105'
                   >
                     <Settings className='h-4 w-4 mr-2' />
                     Edit Profile
                   </Button>
                 </Link>
               </div>
             </div>

             {/* Edit Profile Button - Mobile */}
             <div className='mt-8 sm:hidden'>
               <Link href='/account/edit' className='block'>
                 <Button size='lg' className='w-full rounded-xl font-bold'>
                   <Settings className='h-4 w-4 mr-2' />
                   Edit Profile
                 </Button>
               </Link>
             </div>
          </header>

          {/* Main Content Grid */}
          <div className='grid lg:grid-cols-12 gap-8'>
            {/* Left Column - Main Content */}
            <div className='lg:col-span-8 space-y-8'>
              {/* Account Statistics */}
              <div className="rounded-3xl p-1 border border-border/50 bg-card/30 backdrop-blur-sm">
                 <AccountStats
                   totalOrders={stats.totalOrders}
                   totalSpent={stats.totalSpent}
                   cartItems={stats.cartItemsCount}
                   wishlistItems={stats.wishlistItemsCount}
                 />
              </div>

              {/* Account Details Card */}
              <div className='glass-card p-8 rounded-3xl'>
                  <div className='flex items-center justify-between mb-8'>
                    <h2 className='text-2xl font-bold flex items-center gap-3'>
                      <span className='w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary'>
                        <Shield className="h-5 w-5"/>
                      </span>
                      Account Information
                    </h2>
                  </div>
                  <div className='grid sm:grid-cols-2 gap-x-12 gap-y-8'>
                    {[
                      { label: 'Full Name', value: user?.name, default: 'Not set' },
                      { label: 'Email Address', value: user?.email, default: 'Not set' },
                      { label: 'Account Type', value: user?.role, default: 'User', capitalize: true },
                      { label: 'Member Since', value: memberSince },
                    ].map((item, i) => (
                      <div key={i} className='space-y-2 p-4 rounded-2xl bg-secondary/30 border border-border/50'>
                        <p className='text-xs font-bold text-muted-foreground uppercase tracking-widest'>
                          {item.label}
                        </p>
                        <p className={`text-lg font-semibold text-foreground ${item.capitalize ? 'capitalize' : ''}`}>
                          {item.value || item.default}
                        </p>
                      </div>
                    ))}
                  </div>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className='lg:col-span-4 space-y-8'>
              {/* Quick Actions Card */}
              <div className='glass-card p-6 rounded-3xl space-y-6'>
                  <h3 className='text-xl font-bold px-2'>Quick Actions</h3>
                  
                  <nav className='space-y-3' aria-label='Quick navigation'>
                    {[
                      { href: '/orders', icon: Package, label: 'My Orders', color: 'text-blue-500', bg: 'bg-blue-500/10' },
                      { href: '/wishlist', icon: Heart, label: 'Wishlist', color: 'text-rose-500', bg: 'bg-rose-500/10' },
                      { href: '/account/addresses', icon: MapPin, label: 'My Addresses', color: 'text-amber-500', bg: 'bg-amber-500/10' },
                      { href: '/cart', icon: ShoppingCart, label: 'Shopping Cart', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                      { href: '/products', icon: Package, label: 'Browse Products', color: 'text-violet-500', bg: 'bg-violet-500/10' },
                    ].map((item, idx) => (
                      <Link href={item.href} key={idx} className='block group'>
                        <div className='flex items-center p-4 rounded-2xl bg-secondary/30 border border-transparent hover:border-primary/20 hover:bg-secondary/60 transition-all duration-300'>
                           <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center ${item.color} mr-4 group-hover:scale-110 transition-transform`}>
                              <item.icon className="h-5 w-5" />
                           </div>
                           <span className='font-bold text-foreground group-hover:text-primary transition-colors'>{item.label}</span>
                        </div>
                      </Link>
                    ))}
                  </nav>
              </div>

              {/* Shopping Summary Card */}
              {stats.totalOrders > 0 && (
                <div className='rounded-3xl overflow-hidden shadow-2xl relative'>
                  <div className='absolute inset-0 bg-gradient-to-br from-primary to-violet-600' />
                  <div className="absolute inset-0 bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
                  
                  <div className='relative z-10 p-8 text-white space-y-6'>
                    <h3 className='text-xl font-bold flex items-center gap-3'>
                      <div className="p-2 bg-white/20 backdrop-blur-md rounded-lg">
                        <TrendingUp className='h-5 w-5' />
                      </div>
                      Shopping Summary
                    </h3>
                    <div className='space-y-5'>
                      <div className='flex justify-between items-center pb-5 border-b border-white/20'>
                        <span className='text-white/80 font-medium'>
                          Total Orders
                        </span>
                        <span className='text-3xl font-black tabular-nums'>
                          {stats.totalOrders}
                        </span>
                      </div>
                      <div className='flex justify-between items-center'>
                        <span className='text-white/80 font-medium'>
                          Total Spent
                        </span>
                        <span className='text-3xl font-black tabular-nums tracking-tight'>
                          {formatPrice(stats.totalSpent)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
};

export default AccountPage;
