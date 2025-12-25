'use client';

import { OrdersDataTable } from '@/components/admin/orders-data-table';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppSelector } from '@/lib/store/hooks';
import { Order } from '@/lib/types';
import { formatPrice } from '@/lib/utils/formatters';
import { Clock, DollarSign, ShoppingBag, TrendingUp } from 'lucide-react';
import { Suspense, useMemo, useState } from 'react';

/**
 * Orders list skeleton
 */
function OrdersListSkeleton() {
  return (
    <div className='space-y-8'>
      <div className='space-y-2'>
        <Skeleton className='h-8 w-48' />
        <Skeleton className='h-4 w-64' />
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-4 gap-4'>
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className='pt-6'>
              <Skeleton className='h-16 w-full' />
            </CardContent>
          </Card>
        ))}
      </div>
      <Skeleton className='h-96 w-full' />
    </div>
  );
}

/**
 * Order statistics component
 */
function OrderStats({ orders }: { orders: Order[] }) {
  const stats = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter((o) => o.status === 'Pending').length;
    const processing = orders.filter((o) => o.status === 'Processing').length;
    const shipped = orders.filter((o) => o.status === 'Shipped').length;
    const delivered = orders.filter((o) => o.status === 'Delivered').length;
    const cancelled = orders.filter((o) => o.status === 'Cancelled').length;
    const revenue = orders
      .filter((o) => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + o.total, 0);
    const avgOrderValue = total > 0 ? revenue / total : 0;

    return {
      total,
      pending,
      processing,
      shipped,
      delivered,
      cancelled,
      revenue,
      avgOrderValue,
    };
  }, [orders]);

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
      <Card>
        <CardContent className='pt-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-slate-600 dark:text-slate-400'>
                Total Orders
              </p>
              <p className='text-3xl font-bold dark:text-white mt-2'>
                {stats.total}
              </p>
            </div>
            <ShoppingBag className='h-10 w-10 text-slate-400' />
          </div>
          <p className='text-xs text-slate-500 dark:text-slate-400 mt-2'>
            All time orders
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className='pt-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-slate-600 dark:text-slate-400'>
                Pending
              </p>
              <p className='text-3xl font-bold text-yellow-600 dark:text-yellow-400 mt-2'>
                {stats.pending + stats.processing}
              </p>
            </div>
            <Clock className='h-10 w-10 text-yellow-400' />
          </div>
          <p className='text-xs text-slate-500 dark:text-slate-400 mt-2'>
            Needs attention
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className='pt-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-slate-600 dark:text-slate-400'>
                Revenue
              </p>
              <p className='text-2xl font-bold dark:text-white mt-2'>
                {formatPrice(stats.revenue)}
              </p>
            </div>
            <DollarSign className='h-10 w-10 text-green-400' />
          </div>
          <p className='text-xs text-slate-500 dark:text-slate-400 mt-2'>
            Total revenue
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className='pt-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-slate-600 dark:text-slate-400'>
                Avg Order Value
              </p>
              <p className='text-2xl font-bold dark:text-white mt-2'>
                {formatPrice(stats.avgOrderValue)}
              </p>
            </div>
            <TrendingUp className='h-10 w-10 text-blue-400' />
          </div>
          <p className='text-xs text-slate-500 dark:text-slate-400 mt-2'>
            Per order
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Orders content component
 */
function OrdersContent() {
  const { orders } = useAppSelector((state) => state.orders);
  const [activeTab, setActiveTab] = useState('all');

  // Filter orders based on active tab
  const filteredOrders = useMemo(() => {
    switch (activeTab) {
      case 'pending':
        return orders.filter(
          (o) => o.status === 'Pending' || o.status === 'Processing'
        );
      case 'shipped':
        return orders.filter((o) => o.status === 'Shipped');
      case 'delivered':
        return orders.filter((o) => o.status === 'Delivered');
      case 'cancelled':
        return orders.filter((o) => o.status === 'Cancelled');
      default:
        return orders;
    }
  }, [orders, activeTab]);

  const statusCounts = useMemo(
    () => ({
      pending: orders.filter(
        (o) => o.status === 'Pending' || o.status === 'Processing'
      ).length,
      shipped: orders.filter((o) => o.status === 'Shipped').length,
      delivered: orders.filter((o) => o.status === 'Delivered').length,
      cancelled: orders.filter((o) => o.status === 'Cancelled').length,
    }),
    [orders]
  );

  return (
    <div className='space-y-8'>
      {/* Header */}
      <div className='space-y-1'>
        <div className='flex items-center gap-2'>
          <ShoppingBag className='h-6 w-6 text-slate-600 dark:text-slate-400' />
          <h1 className='text-3xl font-bold tracking-tight dark:text-white'>
            Orders
          </h1>
        </div>
        <p className='text-slate-600 dark:text-slate-400'>
          Manage and track customer orders ({orders.length} total)
        </p>
      </div>

      {/* Statistics */}
      <OrderStats orders={orders} />

      {/* Orders Table with Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className='grid w-full grid-cols-5'>
          <TabsTrigger value='all'>
            All <span className='ml-2 text-xs'>({orders.length})</span>
          </TabsTrigger>
          <TabsTrigger value='pending'>
            Pending{' '}
            <span className='ml-2 text-xs'>({statusCounts.pending})</span>
          </TabsTrigger>
          <TabsTrigger value='shipped'>
            Shipped{' '}
            <span className='ml-2 text-xs'>({statusCounts.shipped})</span>
          </TabsTrigger>
          <TabsTrigger value='delivered'>
            Delivered{' '}
            <span className='ml-2 text-xs'>({statusCounts.delivered})</span>
          </TabsTrigger>
          <TabsTrigger value='cancelled'>
            Cancelled{' '}
            <span className='ml-2 text-xs'>({statusCounts.cancelled})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className='mt-6'>
          <OrdersDataTable orders={filteredOrders} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

/**
 * Admin orders page with Suspense boundary
 */
export default function AdminOrdersPage() {
  return (
    <Suspense fallback={<OrdersListSkeleton />}>
      <OrdersContent />
    </Suspense>
  );
}
