'use client';

import { useRouter } from 'next/navigation';
import { Heart, ShoppingCart, User, Package, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppSelector } from '@/lib/store/hooks';
import { formatPrice } from '@/lib/utils/formatters';
import AuthGuard from '@/components/auth/auth-guard';
import { useMemo } from 'react';

const AccountPage = () => {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.user);
  const { orders } = useAppSelector((state) => state.orders);
  const { cart } = useAppSelector((state) => state.cart);
  const { itemIds: wishlist } = useAppSelector((state) => state.wishlist);

  // Calculate stats
  const stats = useMemo(() => ({
    totalOrders: orders.length,
    totalSpent: orders.reduce((sum, order) => sum + order.total, 0),
    cartItems: cart.reduce((sum, item) => sum + item.quantity, 0),
    wishlistItems: wishlist.length,
  }), [orders, cart, wishlist]);

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return (
    <AuthGuard>
      <div className="bg-slate-50 min-h-[70vh] dark:bg-slate-900">
        <div className="container mx-auto px-4 py-12">
          {/* Profile Header */}
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg">
              {user?.name ? (
                <span className="text-3xl font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              ) : (
                <User className="h-10 w-10" />
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight dark:text-white">
                {user?.name || 'User'}
              </h1>
              <p className="text-slate-600 dark:text-slate-300 mt-1">
                {user?.email || 'Loading...'}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 capitalize">
                  {user?.role || 'User'}
                </span>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Account Statistics */}
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Total Orders Card */}
                <button
                  onClick={() => handleNavigate('/orders')}
                  className="bg-white rounded-lg p-6 shadow-sm dark:bg-slate-800 border dark:border-slate-700 hover:shadow-md transition-shadow text-left group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        Total Orders
                      </p>
                      <p className="text-3xl font-bold mt-2 dark:text-white">
                        {stats.totalOrders}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
                    Click to view all orders
                  </p>
                </button>

                {/* Total Spent Card */}
                <div className="bg-white rounded-lg p-6 shadow-sm dark:bg-slate-800 border dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        Total Spent
                      </p>
                      <p className="text-3xl font-bold mt-2 dark:text-white">
                        {formatPrice(stats.totalSpent)}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <span className="text-2xl">💰</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
                    Lifetime purchases
                  </p>
                </div>

                {/* Cart Items Card */}
                <button
                  onClick={() => handleNavigate('/cart')}
                  className="bg-white rounded-lg p-6 shadow-sm dark:bg-slate-800 border dark:border-slate-700 hover:shadow-md transition-shadow text-left group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        Cart Items
                      </p>
                      <p className="text-3xl font-bold mt-2 dark:text-white">
                        {stats.cartItems}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <ShoppingCart className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
                    Click to view cart
                  </p>
                </button>

                {/* Wishlist Items Card */}
                <button
                  onClick={() => handleNavigate('/wishlist')}
                  className="bg-white rounded-lg p-6 shadow-sm dark:bg-slate-800 border dark:border-slate-700 hover:shadow-md transition-shadow text-left group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        Wishlist
                      </p>
                      <p className="text-3xl font-bold mt-2 dark:text-white">
                        {stats.wishlistItems}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Heart className="h-6 w-6 text-pink-600 dark:text-pink-400" />
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
                    Click to view wishlist
                  </p>
                </button>
              </div>

              {/* Account Details */}
              <div className="bg-white rounded-lg p-6 shadow-sm dark:bg-slate-800 border dark:border-slate-700">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold dark:text-white">
                    Account Information
                  </h2>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                      Full Name
                    </p>
                    <p className="font-medium dark:text-white">
                      {user?.name || 'Not set'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                      Email Address
                    </p>
                    <p className="font-medium dark:text-white break-all">
                      {user?.email || 'Not set'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                      Account Type
                    </p>
                    <p className="font-medium dark:text-white capitalize">
                      {user?.role || 'User'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                      Member Since
                    </p>
                    <p className="font-medium dark:text-white">
                      January 2024
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white rounded-lg p-6 shadow-sm dark:bg-slate-800 border dark:border-slate-700">
                <h3 className="text-lg font-semibold dark:text-white mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start hover:bg-slate-50 dark:hover:bg-slate-900"
                    onClick={() => handleNavigate('/orders')}
                  >
                    <Package className="h-4 w-4 mr-2" />
                    View My Orders
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start hover:bg-slate-50 dark:hover:bg-slate-900"
                    onClick={() => handleNavigate('/wishlist')}
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    View Wishlist
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start hover:bg-slate-50 dark:hover:bg-slate-900"
                    onClick={() => handleNavigate('/cart')}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    View Cart
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start hover:bg-slate-50 dark:hover:bg-slate-900"
                    onClick={() => handleNavigate('/products')}
                  >
                    <Package className="h-4 w-4 mr-2" />
                    Browse Products
                  </Button>
                </div>
              </div>

              {/* Shopping Summary */}
              {stats.totalOrders > 0 && (
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-6 shadow-lg text-white">
                  <h3 className="text-lg font-semibold mb-4">
                    Shopping Summary
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-3 border-b border-white/20">
                      <span className="text-blue-100">Total Orders</span>
                      <span className="text-2xl font-bold">{stats.totalOrders}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-100">Total Spent</span>
                      <span className="text-2xl font-bold">
                        {formatPrice(stats.totalSpent)}
                      </span>
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