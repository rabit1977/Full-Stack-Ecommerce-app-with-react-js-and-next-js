'use client';

import { DashboardCard } from '@/components/admin/dashboard-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Activity,
    DollarSign,
    Package,
    ShoppingCart,
    TrendingUp,
    Users,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

/**
 * Dashboard skeleton loader with proper animations
 */
export function DashboardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className='space-y-8'
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Skeleton className='h-8 w-48' />
        <Skeleton className='h-4 w-64 mt-2' />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'
      >
        {[1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + i * 0.1 }}
          >
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <Skeleton className='h-4 w-24' />
                <Skeleton className='h-5 w-5 rounded' />
              </CardHeader>
              <CardContent>
                <Skeleton className='h-8 w-16 mb-2' />
                <Skeleton className='h-3 w-32' />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className='grid grid-cols-1 lg:grid-cols-2 gap-6'
      >
        <Skeleton className='h-80 rounded-lg' />
        <Skeleton className='h-80 rounded-lg' />
      </motion.div>
    </motion.div>
  );
}

// Define types for the data we actually need
type DashboardUser = {
  id: string;
  name: string | null;
  email: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type DashboardOrder = {
  id: string;
  userId: string;
  total: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

type DashboardProduct = {
  id: string;
  title: string;
  category: string;
  stock: number;
  createdAt: Date;
};

type DashboardContentProps = {
  products: DashboardProduct[];
  users: DashboardUser[];
  orders: DashboardOrder[];
  cartItemsCount?: number;
};

/**
 * Calculate percentage change between two values
 */
function calculateTrend(current: number, previous: number) {
  if (previous === 0) {
    return current > 0 ? { value: 100, isPositive: true } : { value: 0, isPositive: true };
  }
  const percentChange = ((current - previous) / previous) * 100;
  return {
    value: Math.abs(Math.round(percentChange)),
    isPositive: percentChange >= 0,
  };
}

/**
 * Dashboard content component with smooth entry animation
 */
export default function DashboardClient({
  products,
  users,
  orders,
  cartItemsCount = 0,
}: DashboardContentProps) {
  const [isReady, setIsReady] = useState(false);

  // Delay mounting to ensure smooth transition
  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Calculate dashboard stats with dynamic trends
  const stats = useMemo(() => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    // Current period (last 30 days)
    const recentOrders = orders.filter(
      (o) => new Date(o.createdAt) >= thirtyDaysAgo
    );
    const recentRevenue = recentOrders.reduce((sum, order) => sum + order.total, 0);
    const recentUsers = users.filter(
      (u) => new Date(u.createdAt) >= thirtyDaysAgo
    );

    // Previous period (30-60 days ago)
    const previousOrders = orders.filter(
      (o) => new Date(o.createdAt) >= sixtyDaysAgo && new Date(o.createdAt) < thirtyDaysAgo
    );
    const previousRevenue = previousOrders.reduce((sum, order) => sum + order.total, 0);
    const previousUsers = users.filter(
      (u) => new Date(u.createdAt) >= sixtyDaysAgo && new Date(u.createdAt) < thirtyDaysAgo
    );

    // Total stats
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const activeOrders = orders.filter(
      (o) => o.status === 'Pending' || o.status === 'Processing'
    ).length;
    const total = orders.length;
    const pending = orders.filter((o) => o.status === 'Pending').length;
    const processing = orders.filter((o) => o.status === 'Processing').length;

    // Calculate trends
    const productTrend = calculateTrend(products.length, Math.max(1, products.length - 5));
    const userTrend = calculateTrend(recentUsers.length, previousUsers.length);
    const orderTrend = calculateTrend(recentOrders.length, previousOrders.length);
    const revenueTrend = calculateTrend(recentRevenue, previousRevenue);

    return {
      products: products.length,
      users: users.length,
      orders: total,
      revenue: totalRevenue,
      activeOrders,
      cartItems: cartItemsCount,
      total,
      pending,
      processing,
      description:
        pending > 0
          ? `${pending} pending, ${processing} processing`
          : `${processing} processing`,
      trends: {
        products: productTrend,
        users: userTrend,
        orders: orderTrend,
        revenue: revenueTrend,
      },
    };
  }, [orders, cartItemsCount, products, users]);

  if (!isReady) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className='space-y-8'
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h1 className='text-3xl font-bold tracking-tight dark:text-white'>
          Dashboard
        </h1>
        <p className='text-slate-600 dark:text-slate-400 mt-2'>
          Overview of your store&apos;s performance
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className='grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6'
      >
        {[
          {
            title: 'Total Products',
            value: stats.products,
            icon: Package,
            description: 'Active products',
            trend: stats.trends.products,
          },
          {
            title: 'Total Users',
            value: stats.users,
            icon: Users,
            description: 'Registered customers',
            trend: stats.trends.users,
          },
          {
            title: 'Total Orders',
            value: stats.total,
            icon: Package,
            description: stats.description,
            trend: stats.trends.orders,
          },
          {
            title: 'Total Revenue',
            value: `$${stats.revenue.toLocaleString()}`,
            icon: DollarSign,
            description: 'All time revenue',
            trend: stats.trends.revenue,
          },
          {
            title: 'Active Orders',
            value: stats.activeOrders,
            icon: Activity,
            description: 'pending or processing',
          },
          {
            title: 'Average Order Value',
            value: stats.orders > 0 ? `$${(stats.revenue / stats.orders).toFixed(2)}` : '$0.00',
            icon: TrendingUp,
            description: 'per order',
          },
          {
            title: 'Cart Items',
            value: stats.cartItems,
            icon: ShoppingCart,
            description: 'items in carts',
          },
        ].map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.05 }}
          >
            <DashboardCard {...card} />
          </motion.div>
        ))}
      </motion.div>

      {/* Recent Activity Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className='grid grid-cols-1 lg:grid-cols-2 gap-6'
      >
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <AnimatePresence mode='popLayout'>
                {orders.slice(0, 5).map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.05 }}
                    className='flex items-center justify-between py-2 border-b dark:border-slate-800 last:border-0'
                  >
                    <div>
                      <p className='font-medium text-sm dark:text-white'>
                        Order #{order.id.slice(0, 8)}
                      </p>
                      <p className='text-xs text-slate-500 dark:text-slate-400'>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className='text-right'>
                      <p className='font-semibold text-sm dark:text-white'>
                        ${order?.total?.toFixed(2)}
                      </p>
                      <p className='text-xs text-slate-500 dark:text-slate-400'>
                        {order.status}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {orders.length === 0 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className='text-sm text-slate-500 dark:text-slate-400 text-center py-4'
                >
                  No orders yet
                </motion.p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Low Stock Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <AnimatePresence mode='popLayout'>
                {products
                  .filter((p) => p.stock < 10)
                  .slice(0, 3)
                  .map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.05 }}
                      className='flex items-center justify-between py-2 border-b dark:border-slate-800 last:border-0'
                    >
                      <div className='flex-1 min-w-0'>
                        <p className='font-medium text-sm dark:text-white truncate'>
                          {product.title}
                        </p>
                        <p className='text-xs text-slate-500 dark:text-slate-400'>
                          {product.category}
                        </p>
                      </div>
                      <div className='text-right ml-4'>
                        <p
                          className={`font-semibold text-sm ${
                            product.stock === 0
                              ? 'text-red-600 dark:text-red-400'
                              : product.stock < 5
                                ? 'text-orange-600 dark:text-orange-400'
                                : 'text-yellow-600 dark:text-yellow-400'
                          }`}
                        >
                          {product.stock} left
                        </p>
                      </div>
                    </motion.div>
                  ))}
              </AnimatePresence>
              {products.filter((p) => p.stock < 10).length === 0 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className='text-sm text-slate-500 dark:text-slate-400 text-center py-4'
                >
                  All products in stock
                </motion.p>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}