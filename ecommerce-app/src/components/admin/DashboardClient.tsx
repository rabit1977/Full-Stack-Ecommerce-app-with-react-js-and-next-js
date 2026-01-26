'use client';

import { DashboardCard } from '@/components/admin/dashboard-card';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity,
  Calendar,
  DollarSign,
  Eye,
  Package,
  ShoppingCart,
  Sparkles,
  TrendingUp,
  Users
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

/**
 * Dashboard skeleton loader with smooth animations
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
        className='space-y-2'
      >
        <Skeleton className='h-10 w-56 skeleton-enhanced' />
        <Skeleton className='h-5 w-80 skeleton-enhanced' />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6'
      >
        {[1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + i * 0.08 }}
          >
            <div className='stat-card'>
              <div className='flex items-start justify-between'>
                <Skeleton className='h-4 w-24 skeleton-enhanced' />
                <Skeleton className='h-10 w-10 rounded-xl skeleton-enhanced' />
              </div>
              <Skeleton className='h-9 w-20 mt-4 skeleton-enhanced' />
              <Skeleton className='h-4 w-32 mt-2 skeleton-enhanced' />
            </div>
          </motion.div>
        ))}
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className='grid grid-cols-1 lg:grid-cols-2 gap-6'
      >
        <Skeleton className='h-96 rounded-2xl skeleton-enhanced' />
        <Skeleton className='h-96 rounded-2xl skeleton-enhanced' />
      </motion.div>
    </motion.div>
  );
}

// Types
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
 * Get status styling
 */
function getStatusClass(status: string) {
  const statusMap: Record<string, string> = {
    'Pending': 'status-pending',
    'Processing': 'status-processing',
    'Shipped': 'status-shipped',
    'Delivered': 'status-delivered',
    'Cancelled': 'status-cancelled',
  };
  return statusMap[status] || 'bg-muted text-muted-foreground';
}

/**
 * Dashboard content component with premium design
 */
export default function DashboardClient({
  products,
  users,
  orders,
  cartItemsCount = 0,
}: DashboardContentProps) {
  const [isReady, setIsReady] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 50);
    setCurrentTime(new Date());
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
      recentOrdersCount: recentOrders.length,
      recentRevenue,
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

  if (!isReady) return <DashboardSkeleton />;

  const greeting = currentTime 
    ? currentTime.getHours() < 12 
      ? 'Good morning' 
      : currentTime.getHours() < 18 
        ? 'Good afternoon' 
        : 'Good evening'
    : 'Welcome';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className='space-y-8'
    >
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'
      >
        <div className='space-y-1'>
          <div className='flex items-center gap-3'>
            <h1 className='text-xl sm:text-2xl md:text-3xl font-bold tracking-tight'>
              {greeting}! <Sparkles className='inline h-5 w-5 text-amber-500' />
            </h1>
          </div>
          <p className='text-muted-foreground text-xs sm:text-sm'>
            Here&apos;s what&apos;s happening with your store today
          </p>
        </div>
        <div className='flex items-center gap-2 text-xs sm:text-sm text-muted-foreground'>
          <Calendar className='h-4 w-4' />
          <span>{currentTime?.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</span>
        </div>
      </motion.div>

      {/* Quick Stats Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className='relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 dark:from-primary/20 dark:via-primary/10 dark:to-accent/15 p-6 border border-primary/10'
      >
        <div className='absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2' />
        <div className='relative flex flex-wrap gap-6 sm:gap-12 justify-between'>
          <div className='space-y-1'>
            <p className='text-sm text-muted-foreground font-medium'>Today&apos;s Revenue</p>
            <p className='text-xl  sm:text-2xl md:text-3xl font-bold'>${stats.recentRevenue.toLocaleString()}</p>
          </div>
          <div className='space-y-1'>
            <p className='text-sm text-muted-foreground font-medium'>New Orders</p>
            <p className='text-xl sm:text-2xl md:text-3xl font-bold'>{stats.recentOrdersCount}</p>
          </div>
          <div className='space-y-1'>
            <p className='text-sm text-muted-foreground font-medium'>Active Users</p>
            <p className='text-xl sm:text-2xl md:text-3xl font-bold'>{stats.users}</p>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className='grid xs:grid-cols-2 2xl:grid-cols-4 gap-4 sm:gap-6'
      >
        {([
          {
            title: 'Total Revenue',
            value: `$${stats.revenue.toLocaleString()}`,
            icon: DollarSign,
            description: 'All time earnings',
            trend: stats.trends.revenue,
            color: 'emerald' as const,
            href: '/admin/orders',
          },
          {
            title: 'Total Products',
            value: stats.products,
            icon: Package,
            description: 'Active in catalog',
            trend: stats.trends.products,
            color: 'violet' as const,
            href: '/admin/products',
          },
          {
            title: 'Total Orders',
            value: stats.total,
            icon: ShoppingCart,
            description: stats.description,
            trend: stats.trends.orders,
            color: 'blue' as const,
            href: '/admin/orders',
          },
          {
            title: 'Total Customers',
            value: stats.users,
            icon: Users,
            description: 'Registered users',
            trend: stats.trends.users,
            color: 'amber' as const,
            href: '/admin/users',
          },
        ]).map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.05 }}
          >
            <Link href={card.href} className='block'>
              <DashboardCard {...card} />
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Secondary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className='grid grid-cols-2 md:grid-cols-3 gap-4'
      >
        <div className='stat-card flex items-center gap-4 flex-row-reverse justify-between'>
          <div className='w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center'>
            <Activity className='h-6 w-6 text-blue-600 dark:text-blue-400' />
          </div>
          <div>
            <p className='text-sm text-muted-foreground'>Active Orders</p>
            <p className='text-2xl font-bold'>{stats.activeOrders}</p>
          </div>
        </div>
        <div className='stat-card flex items-center gap-4 flex-row-reverse justify-between'>
          <div className='w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-950/50 flex items-center justify-center'>
            <TrendingUp className='h-6 w-6 text-purple-600 dark:text-purple-400' />
          </div>
          <div>
            <p className='text-sm text-muted-foreground'>Avg. Order Value</p>
            <p className='text-2xl font-bold'>
              {stats.orders > 0 ? `$${(stats.revenue / stats.orders).toFixed(0)}` : '$0'}
            </p>
          </div>
        </div>
        <div className='stat-card col-span-2 flex md:col-span-1 gap-4 flex-row-reverse justify-between'>
          <div className='w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center'>
            <Eye className='h-6 w-6 text-amber-600 dark:text-amber-400' />
          </div>
          <div>
            <p className='text-sm text-muted-foreground'>Cart Items</p>
            <p className='text-2xl font-bold'>{stats.cartItems}</p>
          </div>
        </div>
      </motion.div>

      {/* Recent Activity Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className='grid grid-cols-1 xl:grid-cols-2 gap-6'
      >
        {/* Recent Orders */}
        <Card className='card-premium'>
          <CardHeader className='pb-4'>
            <div className='flex items-center justify-between'>
              <CardTitle className='text-lg font-semibold'>Recent Orders</CardTitle>
              <Link 
                href='/admin/orders' 
                className='text-sm text-primary hover:text-primary/80 font-medium transition-colors'
              >
                View all
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className='space-y-1'>
              <AnimatePresence mode='popLayout'>
                {orders.slice(0, 5).map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.05 }}
                    className='flex items-center justify-between py-3 px-4 -mx-4 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer group'
                  >
                    <div className='flex flex-2 items-center gap-3'>
                      <div className='w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center'>
                        <ShoppingCart className='h-4 w-4 text-primary' />
                      </div>
                      <div>
                        <p className='font-medium text-sm group-hover:text-primary transition-colors'>
                          Order #{order.id.slice(0, 8)}
                        </p>
                        <p className='text-xs text-muted-foreground'>
                          {new Date(order.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                    <div className='flex flex-1 items-center gap-1 sm:gap-3'>
                    <div className='text-right flex flex-col sm:flex-row flex-1 items-center justify-end gap-1 sm:gap-3'>
                      <Badge variant='secondary' className={`text-xs flex-1  min-w-12           ${getStatusClass(order.status)}`}>
                        {order.status}
                      </Badge>
                      <span className='font-semibold text-xs min-w-12 flex justify-end '>
                        ${order?.total?.toFixed(2)}
                      </span>
                    </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {orders.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className='text-center py-12'
                >
                  <ShoppingCart className='h-12 w-12 mx-auto text-muted-foreground/30 mb-3' />
                  <p className='text-sm text-muted-foreground'>No orders yet</p>
                  <p className='text-xs text-muted-foreground/70 mt-1'>
                    Orders will appear here when customers start buying
                  </p>
                </motion.div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Products */}
        <Card className='card-premium'>
          <CardHeader className='pb-4'>
            <div className='flex items-center justify-between'>
              <CardTitle className='text-lg font-semibold'>Stock Alerts</CardTitle>
              <Link 
                href='/admin/products' 
                className='text-sm text-primary hover:text-primary/80 font-medium transition-colors'
              >
                Manage inventory
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className='space-y-1'>
              <AnimatePresence mode='popLayout'>
                {products
                  .filter((p) => p.stock < 10)
                  .slice(0, 5)
                  .map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.05 }}
                      className='flex items-center justify-between py-3 px-4 -mx-4 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer group'
                    >
                      <div className='flex items-center gap-3 flex-1 min-w-0'>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          product.stock === 0 
                            ? 'bg-red-100 dark:bg-red-950/50' 
                            : product.stock < 5 
                              ? 'bg-amber-100 dark:bg-amber-950/50'
                              : 'bg-yellow-100 dark:bg-yellow-950/50'
                        }`}>
                          <Package className={`h-4 w-4 ${
                            product.stock === 0 
                              ? 'text-red-600 dark:text-red-400' 
                              : product.stock < 5 
                                ? 'text-amber-600 dark:text-amber-400'
                                : 'text-yellow-600 dark:text-yellow-400'
                          }`} />
                        </div>
                        <div className='flex-1 min-w-0'>
                          <p className='font-medium text-sm truncate group-hover:text-primary transition-colors'>
                            {product.title}
                          </p>
                          <p className='text-xs text-muted-foreground'>
                            {product.category}
                          </p>
                        </div>
                      </div>
                      <div className='text-right ml-4'>
                        <Badge 
                          variant='secondary' 
                          className={`text-xs font-semibold ${
                            product.stock === 0 
                              ? 'badge-error' 
                              : product.stock < 5 
                                ? 'badge-warning'
                                : 'badge-info'
                          }`}
                        >
                          {product.stock === 0 ? 'Out of stock' : `${product.stock} left`}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
              </AnimatePresence>
              {products.filter((p) => p.stock < 10).length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className='text-center py-12'
                >
                  <div className='w-16 h-16 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center mb-3'>
                    <Package className='h-8 w-8 text-emerald-600 dark:text-emerald-400' />
                  </div>
                  <p className='text-sm font-medium text-emerald-600 dark:text-emerald-400'>
                    All products well stocked!
                  </p>
                  <p className='text-xs text-muted-foreground mt-1'>
                    Your inventory is looking healthy
                  </p>
                </motion.div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className='grid grid-cols-2 sm:grid-cols-4 gap-4'
      >
        {[
          { label: 'Add Product', href: '/admin/products/new', icon: Package, color: 'bg-violet-100 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400' },
          { label: 'View Orders', href: '/admin/orders', icon: ShoppingCart, color: 'bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400' },
          { label: 'Manage Users', href: '/admin/users', icon: Users, color: 'bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400' },
          { label: 'Coupons', href: '/admin/coupons', icon: Sparkles, color: 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400' },
        ].map((action, _index) => (
          <Link
            key={action.label}
            href={action.href}
            className='group stat-card flex flex-col items-center justify-center py-6 gap-3 hover:border-primary/30'
          >
            <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
              <action.icon className='h-5 w-5' />
            </div>
            <span className='text-sm font-medium group-hover:text-primary transition-colors'>
              {action.label}
            </span>
          </Link>
        ))}
      </motion.div>
    </motion.div>
  );
}