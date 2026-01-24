'use client';

import { OrdersDataTable } from '@/components/admin/orders-data-table';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Order } from '@/generated/prisma/client';
import { formatPrice } from '@/lib/utils/formatters';
import { CheckCircle, Clock, DollarSign, ShoppingBag, TrendingUp, Truck, XCircle } from 'lucide-react';
import { useMemo, useState } from 'react';

/**
 * Orders list skeleton
 */
export function OrdersListSkeleton() {
  return (
    <div className='space-y-8 pb-20'>
      <div className='space-y-2'>
        <Skeleton className='h-8 w-48' />
        <Skeleton className='h-4 w-64' />
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-4 gap-4'>
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className='h-32 w-full rounded-2xl skeleton-enhanced' />
        ))}
      </div>
      <Skeleton className='h-96 w-full rounded-3xl skeleton-enhanced' />
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
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100'>
      {[
        { 
          label: 'Total Orders', 
          value: stats.total, 
          icon: ShoppingBag, 
          color: 'text-blue-500', 
          bg: 'bg-blue-500/10', 
          border: 'border-blue-500/20' 
        },
        { 
          label: 'Pending', 
          value: stats.pending + stats.processing, 
          subValue: `${stats.pending} new`, 
          icon: Clock, 
          color: 'text-amber-500', 
          bg: 'bg-amber-500/10', 
          border: 'border-amber-500/20' 
        },
        { 
          label: 'Total Revenue', 
          value: formatPrice(stats.revenue), 
          icon: DollarSign, 
          color: 'text-emerald-500', 
          bg: 'bg-emerald-500/10', 
          border: 'border-emerald-500/20' 
        },
        { 
          label: 'Avg Order Value', 
          value: formatPrice(stats.avgOrderValue), 
          icon: TrendingUp, 
          color: 'text-violet-500', 
          bg: 'bg-violet-500/10', 
          border: 'border-violet-500/20' 
        },
      ].map((stat, i) => (
        <div key={i} className={`glass-card p-6 rounded-3xl flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group border ${stat.border}`}>
            <div className={`flex justify-between items-start mb-2`}>
                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} ring-1 ring-inset ring-white/10 group-hover:scale-110 transition-transform`}>
                    <stat.icon className='h-6 w-6' />
                </div>
            </div>
            <div>
                <h3 className='text-3xl font-black mt-2 tracking-tight text-foreground'>{stat.value}</h3>
                <div className="flex items-center justify-between mt-1">
                  <p className='text-sm font-bold text-muted-foreground uppercase tracking-wider'>{stat.label}</p>
                  {stat.subValue && <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{stat.subValue}</span>}
                </div>
            </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Orders Client component
 */
export default function OrdersClient({ orders }: { orders: Order[] }) {
  const [activeTab, setActiveTab] = useState('all');

  // Filter orders based on active tab
  const filteredOrders = useMemo(() => {
    switch (activeTab) {
      case 'pending':
        return orders.filter(
          (o) => o.status === 'Pending' || o.status === 'Processing',
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
        (o) => o.status === 'Pending' || o.status === 'Processing',
      ).length,
      shipped: orders.filter((o) => o.status === 'Shipped').length,
      delivered: orders.filter((o) => o.status === 'Delivered').length,
      cancelled: orders.filter((o) => o.status === 'Cancelled').length,
    }),
    [orders],
  );

  return (
    <div className='space-y-8 pb-20'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-500'>
        <div className='space-y-1'>
          <h1 className='text-3xl sm:text-4xl font-black tracking-tight text-foreground flex items-center gap-3'>
            Orders
            <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold ring-1 ring-inset ring-primary/20">
               {orders.length}
            </span>
          </h1>
          <p className='text-lg text-muted-foreground font-medium'>
             Manage and track customer orders
          </p>
        </div>
      </div>

      {/* Statistics */}
      <OrderStats orders={orders} />

      {/* Orders Table with Tabs */}
      <div className='glass-card rounded-[2.5rem] overflow-hidden shadow-xl shadow-black/5 border border-border/60 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200'>
        <div className="p-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className='w-full justify-start p-1 h-auto bg-muted/50 rounded-2xl overflow-x-auto flex-nowrap'>
                {[
                    { id: 'all', label: 'All Orders', count: orders.length, icon: ShoppingBag },
                    { id: 'pending', label: 'Pending', count: statusCounts.pending, icon: Clock },
                    { id: 'shipped', label: 'Shipped', count: statusCounts.shipped, icon: Truck },
                    { id: 'delivered', label: 'Delivered', count: statusCounts.delivered, icon: CheckCircle },
                    { id: 'cancelled', label: 'Cancelled', count: statusCounts.cancelled, icon: XCircle },
                ].map((tab) => (
                    <TabsTrigger 
                        key={tab.id} 
                        value={tab.id}
                        className='rounded-xl px-4 py-2.5 data-[state=active]:bg-white dark:data-[state=active]:bg-secondary data-[state=active]:shadow-sm transition-all duration-200 flex items-center gap-2 min-w-max'
                    >
                        <tab.icon className="h-4 w-4" />
                        <span className="font-semibold">{tab.label}</span>
                        <span className='ml-1.5 px-1.5 py-0.5 rounded-full bg-secondary text-[10px] font-bold'>
                            {tab.count}
                        </span>
                    </TabsTrigger>
                ))}
                </TabsList>

                <TabsContent value={activeTab} className='mt-8 focus-visible:outline-none'>
                    <OrdersDataTable orders={filteredOrders} />
                </TabsContent>
            </Tabs>
        </div>
      </div>
    </div>
  );
}
