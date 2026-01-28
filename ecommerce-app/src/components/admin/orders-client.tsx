'use client';

import { OrdersDataTable } from '@/components/admin/orders-data-table';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Order } from '@/generated/prisma/browser';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/utils/formatters';
import { CheckCircle, Clock, DollarSign, ShoppingBag, TrendingUp, Truck, XCircle } from 'lucide-react';
import { useMemo, useState } from 'react';

/**
 * Orders list skeleton
 */
export function OrdersListSkeleton() {
  return (
    <div className='space-y-6 pb-20'>
      <div className='space-y-2'>
        <Skeleton className='h-8 w-48' />
        <Skeleton className='h-4 w-64' />
      </div>
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4'>
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className='h-24 sm:h-32 w-full rounded-2xl skeleton-enhanced' />
        ))}
      </div>
      <Skeleton className='h-96 w-full rounded-2xl skeleton-enhanced' />
    </div>
  );
}

/**
 * Order statistics component - Mobile optimized
 */
function OrderStats({ orders }: { orders: Order[] }) {
  const stats = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter((o) => o.status === 'Pending').length;
    const processing = orders.filter((o) => o.status === 'Processing').length;
    const cancelled = orders.filter((o) => o.status === 'Cancelled').length;
    const revenue = orders
      .filter((o) => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + o.total, 0);
    const avgOrderValue = total > 0 ? revenue / total : 0;

    return {
      total,
      pending,
      processing,
      cancelled,
      revenue,
      avgOrderValue,
    };
  }, [orders]);

  const statItems = [
    { 
      label: 'Orders', 
      value: stats.total, 
      icon: ShoppingBag, 
      color: 'text-blue-500', 
      bg: 'bg-blue-500/10', 
      border: 'border-blue-500/20' 
    },
    { 
      label: 'Pending', 
      value: stats.pending + stats.processing, 
      icon: Clock, 
      color: 'text-amber-500', 
      bg: 'bg-amber-500/10', 
      border: 'border-amber-500/20' 
    },
    { 
      label: 'Revenue', 
      value: formatPrice(stats.revenue), 
      icon: DollarSign, 
      color: 'text-emerald-500', 
      bg: 'bg-emerald-500/10', 
      border: 'border-emerald-500/20' 
    },
    { 
      label: 'AOV', 
      value: formatPrice(stats.avgOrderValue), 
      icon: TrendingUp, 
      color: 'text-violet-500', 
      bg: 'bg-violet-500/10', 
      border: 'border-violet-500/20' 
    },
  ];

  return (
    <div className='grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5'>
      {statItems.map((stat, i) => (
        <div 
          key={i} 
          className={cn(
            'glass-card p-4 sm:p-6 rounded-2xl sm:rounded-3xl',
            'flex flex-col justify-between flex-row-reverse',
            'hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300',
            'relative overflow-hidden group border',
            stat.border
          )}
        >
          <div className='flex flex justify-between items-start mb-2'>
            <div className={cn(
              'p-2 sm:p-3 rounded-xl sm:rounded-2xl',
              stat.bg, stat.color,
              'ring-1 ring-inset ring-white/10',
              'group-hover:scale-110 transition-transform'
            )}>
              <stat.icon className='h-4 w-4 sm:h-6 sm:w-6' />
            </div>
          </div>
          <div>
            <h3 className='text-lg xs:text-xl sm:text-2xl font-black tracking-tight text-foreground'>
              {stat.value}
            </h3>
            <p className='text-[10px] text-center xs:text-left sm:text-sm font-bold text-muted-foreground uppercase tracking-wider mt-0.5 sm:mt-1'>
              {stat.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Orders Client component - Mobile optimized
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

  const tabs = [
    { id: 'all', label: 'All', mobileLabel: 'All', count: orders.length, icon: ShoppingBag },
    { id: 'pending', label: 'Pending', mobileLabel: 'Pending', count: statusCounts.pending, icon: Clock },
    { id: 'shipped', label: 'Shipped', mobileLabel: 'Ship', count: statusCounts.shipped, icon: Truck },
    { id: 'delivered', label: 'Delivered', mobileLabel: 'Done', count: statusCounts.delivered, icon: CheckCircle },
    { id: 'cancelled', label: 'Cancelled', mobileLabel: 'Cancel', count: statusCounts.cancelled, icon: XCircle },
  ];

  return (
    <div className='space-y-6 sm:space-y-8 pb-20'>
      {/* Header */}
      <div className='space-y-1'>
        <h1 className='text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-foreground flex items-center gap-2 sm:gap-3 flex-wrap'>
          Orders
          <span className='inline-flex items-center justify-center px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-primary/10 text-primary text-xs font-bold ring-1 ring-inset ring-primary/20'>
            {orders.length}
          </span>
        </h1>
        <p className='text-sm sm:text-lg text-muted-foreground font-medium'>
          Manage and track customer orders
        </p>
      </div>

      {/* Statistics */}
      <OrderStats orders={orders} />

      {/* Orders Table with Tabs */}
      <div className='glass-card rounded-2xl sm:rounded-[2.5rem] overflow-hidden shadow-xl shadow-black/5 border border-border/60'>
        <div className='p-4 sm:p-6 lg:p-8'>
          <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
            {/* Mobile-optimized tabs with horizontal scroll */}
            <div className='-mx-4 sm:mx-0 px-4 sm:px-0 overflow-x-auto scrollbar-none'>
              <TabsList className='w-max sm:w-full inline-flex sm:grid sm:grid-cols-5 p-1 h-auto bg-muted/50 rounded-xl sm:rounded-2xl gap-1'>
                {tabs.map((tab) => (
                  <TabsTrigger 
                    key={tab.id} 
                    value={tab.id}
                    className={cn(
                      'rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-2.5',
                      'data-[state=active]:bg-white dark:data-[state=active]:bg-secondary',
                      'data-[state=active]:shadow-sm transition-all duration-200',
                      'flex items-center gap-1.5 sm:gap-2 whitespace-nowrap'
                    )}
                  >
                    <tab.icon className='h-3.5 w-3.5 sm:h-4 sm:w-4' />
                    <span className='text-xs sm:text-sm font-semibold'>
                      <span className='hidden sm:inline'>{tab.label}</span>
                      <span className='sm:hidden'>{tab.mobileLabel}</span>
                    </span>
                    <span className={cn(
                      'px-1.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold',
                      activeTab === tab.id 
                        ? 'bg-primary/10 text-primary' 
                        : 'bg-secondary text-muted-foreground'
                    )}>
                      {tab.count}
                    </span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <TabsContent value={activeTab} className='mt-4 sm:mt-8 focus-visible:outline-none'>
              <OrdersDataTable orders={filteredOrders} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
