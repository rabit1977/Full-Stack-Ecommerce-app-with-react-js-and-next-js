import { getCartAction } from '@/actions/cart-actions';
import { getMyOrdersAction } from '@/actions/order-actions';
import { getWishlistAction } from '@/actions/wishlist-actions';
import { auth } from '@/auth';
import { AccountStats } from '@/components/account/AccountStats';
import AuthGuard from '@/components/auth/auth-guard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatPrice } from '@/lib/utils/formatters';
import {
  Calendar,
  Heart,
  Mail,
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
    totalSpent: orders.reduce((sum, order) => sum + order.total, 0),
    cartItemsCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
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
      <div className='min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16'>
          {/* Profile Header */}
          <header className='mb-8 sm:mb-12'>
            <div className='flex flex-col sm:flex-row items-start sm:items-center gap-6'>
              {/* Avatar */}
              <div className='relative group'>
                <div className='w-20 h-20 sm:w-24 sm:h-24 bg-linear-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white shadow-lg ring-4 ring-white dark:ring-slate-800 transition-transform group-hover:scale-105'>
                  <span className='text-3xl sm:text-4xl font-bold'>
                    {userInitials}
                  </span>
                </div>
                <div className='absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-4 border-white dark:border-slate-800 flex items-center justify-center'>
                  <div className='w-2 h-2 bg-white rounded-full animate-pulse' />
                </div>
              </div>

              {/* User Info */}
              <div className='flex-1'>
                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
                  <div>
                    <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight bg-linear-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-2'>
                      {user?.name || 'Welcome'}
                    </h1>
                    <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 text-sm sm:text-base text-slate-600 dark:text-slate-400'>
                      <div className='flex items-center gap-2'>
                        <Mail className='h-4 w-4 shrink-0' />
                        <span className='truncate'>
                          {user?.email || 'user@example.com'}
                        </span>
                      </div>
                      <Separator
                        orientation='vertical'
                        className='hidden sm:block h-4'
                      />
                      <div className='flex items-center gap-2'>
                        <Calendar className='h-4 w-4 shrink-0' />
                        <span>Member since {memberSince}</span>
                      </div>
                    </div>
                  </div>

                  {/* Edit Profile Button - Desktop */}
                  <Link href='/account/edit' className='hidden sm:block'>
                    <Button
                      size='lg'
                      className='gap-2 shadow-md hover:shadow-lg transition-shadow'
                    >
                      <Settings className='h-4 w-4' />
                      Edit Profile
                    </Button>
                  </Link>
                </div>

                {/* Role Badge */}
                <div className='flex items-center gap-2 mt-4'>
                  <Badge
                    variant='secondary'
                    className='text-sm px-3 py-1 bg-linear-to-r from-blue-100 to-purple-100 dark:from-blue-950 dark:to-purple-950 border-blue-200 dark:border-blue-800'
                  >
                    <Shield className='h-3 w-3 mr-1.5' />
                    <span className='capitalize font-medium'>
                      {user?.role || 'User'}
                    </span>
                  </Badge>
                  {stats.totalOrders > 0 && (
                    <Badge variant='outline' className='text-sm px-3 py-1'>
                      <TrendingUp className='h-3 w-3 mr-1.5' />
                      {stats.totalOrders}{' '}
                      {stats.totalOrders === 1 ? 'Order' : 'Orders'}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Edit Profile Button - Mobile */}
            <Link href='/account/edit' className='block sm:hidden mt-6'>
              <Button size='lg' className='w-full gap-2'>
                <Settings className='h-4 w-4' />
                Edit Profile
              </Button>
            </Link>
          </header>

          {/* Main Content Grid */}
          <div className='grid lg:grid-cols-3 gap-6 lg:gap-8'>
            {/* Left Column - Main Content */}
            <div className='lg:col-span-2 space-y-6'>
              {/* Account Statistics */}
              <AccountStats
                totalOrders={stats.totalOrders}
                totalSpent={stats.totalSpent}
                cartItems={stats.cartItemsCount}
                wishlistItems={stats.wishlistItemsCount}
              />

              {/* Account Details Card */}
              <Card className='shadow-sm hover:shadow-md transition-shadow'>
                <CardHeader className='pb-4'>
                  <div className='flex items-center justify-between'>
                    <CardTitle className='text-xl sm:text-2xl font-bold'>
                      Account Information
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className='grid sm:grid-cols-2 gap-6'>
                    {/* Full Name */}
                    <div className='space-y-2'>
                      <p className='text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider'>
                        Full Name
                      </p>
                      <p className='text-base font-medium text-slate-900 dark:text-slate-100'>
                        {user?.name || 'Not set'}
                      </p>
                    </div>

                    {/* Email */}
                    <div className='space-y-2'>
                      <p className='text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider'>
                        Email Address
                      </p>
                      <p className='text-base font-medium text-slate-900 dark:text-slate-100 break-all'>
                        {user?.email || 'Not set'}
                      </p>
                    </div>

                    {/* Account Type */}
                    <div className='space-y-2'>
                      <p className='text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider'>
                        Account Type
                      </p>
                      <p className='text-base font-medium text-slate-900 dark:text-slate-100 capitalize'>
                        {user?.role || 'User'}
                      </p>
                    </div>

                    {/* Member Since */}
                    <div className='space-y-2'>
                      <p className='text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider'>
                        Member Since
                      </p>
                      <p className='text-base font-medium text-slate-900 dark:text-slate-100'>
                        {memberSince}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Sidebar */}
            <div className='space-y-6'>
              {/* Quick Actions Card */}
              <Card className='shadow-sm hover:shadow-md transition-shadow'>
                <CardHeader className='pb-4'>
                  <CardTitle className='text-lg sm:text-xl font-bold'>
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <nav className='space-y-2' aria-label='Quick navigation'>
                    <Link href='/orders' className='block'>
                      <Button
                        variant='ghost'
                        className='w-full justify-start h-auto py-3 px-4 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'
                      >
                        <Package className='h-5 w-5 mr-3 text-blue-600 dark:text-blue-400' />
                        <span className='font-medium'>My Orders</span>
                      </Button>
                    </Link>

                    <Link href='/wishlist' className='block'>
                      <Button
                        variant='ghost'
                        className='w-full justify-start h-auto py-3 px-4 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'
                      >
                        <Heart className='h-5 w-5 mr-3 text-red-600 dark:text-red-400' />
                        <span className='font-medium'>Wishlist</span>
                      </Button>
                    </Link>

                    <Link href='/cart' className='block'>
                      <Button
                        variant='ghost'
                        className='w-full justify-start h-auto py-3 px-4 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'
                      >
                        <ShoppingCart className='h-5 w-5 mr-3 text-green-600 dark:text-green-400' />
                        <span className='font-medium'>Shopping Cart</span>
                      </Button>
                    </Link>

                    <Separator className='my-2' />

                    <Link href='/products' className='block'>
                      <Button
                        variant='ghost'
                        className='w-full justify-start h-auto py-3 px-4 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'
                      >
                        <Package className='h-5 w-5 mr-3 text-purple-600 dark:text-purple-400' />
                        <span className='font-medium'>Browse Products</span>
                      </Button>
                    </Link>
                  </nav>
                </CardContent>
              </Card>

              {/* Shopping Summary Card */}
              {stats.totalOrders > 0 && (
                <Card className='overflow-hidden shadow-lg border-0'>
                  <div className='bg-linear-to-br from-blue-500 via-purple-500 to-pink-500 p-6 text-white'>
                    <h3 className='text-lg sm:text-xl font-bold mb-4 flex items-center gap-2'>
                      <TrendingUp className='h-5 w-5' />
                      Shopping Summary
                    </h3>
                    <div className='space-y-4'>
                      <div className='flex justify-between items-center pb-4 border-b border-white/20'>
                        <span className='text-blue-100 font-medium'>
                          Total Orders
                        </span>
                        <span className='text-3xl font-bold tabular-nums'>
                          {stats.totalOrders}
                        </span>
                      </div>
                      <div className='flex justify-between items-center'>
                        <span className='text-blue-100 font-medium'>
                          Total Spent
                        </span>
                        <span className='text-3xl font-bold tabular-nums'>
                          {formatPrice(stats.totalSpent)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
};

export default AccountPage;
