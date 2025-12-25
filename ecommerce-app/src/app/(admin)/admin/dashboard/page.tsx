'use client';

import { DashboardCard } from '@/components/admin/dashboard-card';
import { OrdersCountCard } from '@/components/admin/orders-count-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { staggerContainer, staggerItem } from '@/lib/constants/animations';
import { initialProducts } from '@/lib/constants/products';
import { initialUsers } from '@/lib/constants/users';
import { useAppSelector } from '@/lib/store/hooks';
import { motion } from 'framer-motion';
import {
  Activity,
  DollarSign,
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
} from 'lucide-react';
import { Suspense, useMemo } from 'react';

/**
 * Dashboard skeleton loader
 */
function DashboardSkeleton() {
  return (
    <div className='space-y-8'>
      <Skeleton className='h-8 w-48' />
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <Skeleton className='h-4 w-24' />
              <Skeleton className='h-5 w-5 rounded' />
            </CardHeader>
            <CardContent>
              <Skeleton className='h-8 w-16 mb-2' />
              <Skeleton className='h-3 w-32' />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <Skeleton className='h-80' />
        <Skeleton className='h-80' />
      </div>
    </div>
  );
}

/**
 * Dashboard content component
 */
function DashboardContent() {
  const { orders } = useAppSelector((state) => state.orders);
  const { cart } = useAppSelector((state) => state.cart);

  // Calculate dashboard stats
  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const activeOrders = orders.filter(
      (o) => o.status === 'Pending' || o.status === 'Processing'
    ).length;

    return {
      products: initialProducts.length,
      users: initialUsers.length,
      orders: orders.length,
      revenue: totalRevenue,
      activeOrders,
      cartItems: cart.reduce((sum, item) => sum + item.quantity, 0),
    };
  }, [orders, cart]);

  // Calculate trends (mock data - replace with actual historical data)
  const trends = useMemo(
    () => ({
      products: { value: 12, isPositive: true },
      users: { value: 8, isPositive: true },
      orders: { value: 15, isPositive: true },
      revenue: { value: 23, isPositive: true },
    }),
    []
  );

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className='space-y-8'
    >
      {/* Header */}
      <motion.div variants={staggerItem}>
        <h1 className='text-3xl font-bold tracking-tight dark:text-white'>
          Dashboard
        </h1>
        <p className='text-slate-600 dark:text-slate-400 mt-2'>
          Overview of your store&apos;s performance
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        variants={staggerItem}
        className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6'
      >
        <DashboardCard
          title='Total Products'
          value={stats.products}
          icon={Package}
          description='Active products'
          trend={trends.products}
        />

        <DashboardCard
          title='Total Users'
          value={stats.users}
          icon={Users}
          description='Registered customers'
          trend={trends.users}
        />

        <OrdersCountCard />

        <DashboardCard
          title='Total Revenue'
          value={`$${stats.revenue.toLocaleString()}`}
          icon={DollarSign}
          description='All time revenue'
          trend={trends.revenue}
        />
      </motion.div>

      {/* Secondary Stats */}
      <motion.div 
        variants={staggerItem}
        className='grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-6'
      >
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium text-slate-600 dark:text-slate-400'>
              Active Orders
            </CardTitle>
            <Activity className='h-5 w-5 text-slate-400' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold dark:text-white'>
              {stats.activeOrders}
            </div>
            <p className='text-xs text-slate-500 dark:text-slate-400 mt-1'>
              Pending or processing
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium text-slate-600 dark:text-slate-400'>
              Average Order Value
            </CardTitle>
            <TrendingUp className='h-5 w-5 text-slate-400' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold dark:text-white'>
              $
              {stats.orders > 0
                ? (stats.revenue / stats.orders).toFixed(2)
                : '0.00'}
            </div>
            <p className='text-xs text-slate-500 dark:text-slate-400 mt-1'>
              Per order
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium text-slate-600 dark:text-slate-400'>
              Cart Items
            </CardTitle>
            <ShoppingCart className='h-5 w-5 text-slate-400' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold dark:text-white'>
              {stats.cartItems}
            </div>
            <p className='text-xs text-slate-500 dark:text-slate-400 mt-1'>
              Items in carts
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Activity Section - Placeholder */}
      <motion.div 
        variants={staggerItem}
        className='grid grid-cols-1 lg:grid-cols-2 gap-6'
      >
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {orders.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  className='flex items-center justify-between py-2 border-b dark:border-slate-800 last:border-0'
                >
                  <div>
                    <p className='font-medium text-sm dark:text-white'>
                      Order #{order.id.slice(0, 8)}
                    </p>
                    <p className='text-xs text-slate-500 dark:text-slate-400'>
                      {new Date(order.date).toLocaleDateString()}
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
                </div>
              ))}
              {orders.length === 0 && (
                <p className='text-sm text-slate-500 dark:text-slate-400 text-center py-4'>
                  No orders yet
                </p>
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
              {initialProducts
                .filter((p) => p.stock < 10)
                .slice(0, 5)
                .map((product) => (
                  <div
                    key={product.id}
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
                  </div>
                ))}
              {initialProducts.filter((p) => p.stock < 10).length === 0 && (
                <p className='text-sm text-slate-500 dark:text-slate-400 text-center py-4'>
                  All products in stock
                </p>
              )}
            </div>
          </CardContent>
        </Card>
    </motion.div>
      </motion.div>
  );
}

/**
 * Dashboard page with Suspense boundary
 */
export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}
