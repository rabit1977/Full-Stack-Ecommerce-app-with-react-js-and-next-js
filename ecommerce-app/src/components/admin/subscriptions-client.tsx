'use client';

import { SubscriptionsDataTable } from '@/components/admin/subscriptions-data-table';
import { SubscriptionStatus } from '@/generated/prisma/client';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/utils/formatters';
import {
    Ban,
    CheckCircle,
    CreditCard,
    TrendingUp
} from 'lucide-react';
import { useMemo, useState } from 'react';

type SubscriptionWithUser = {
  id: string;
  userId: string;
  name: string;
  status: SubscriptionStatus;
  price: number;
  billingInterval: string;
  nextBillingDate: Date;
  cancelledAt: Date | null;
  cancelReason: string | null;
  user: {
    name: string | null;
    email: string | null;
    image: string | null;
  };
  createdAt: Date;
};

interface SubscriptionsClientProps {
  subscriptions: SubscriptionWithUser[];
}

export function SubscriptionsClient({ subscriptions }: SubscriptionsClientProps) {
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'CANCELLED'>('ALL');

  const stats = useMemo(() => {
    const active = subscriptions.filter(s => s.status === 'ACTIVE');
    const cancelled = subscriptions.filter(s => s.status === 'CANCELLED');
    const monthlyRevenue = active.reduce((acc, sub) => {
        // Normalize to monthly for rough estimate
        let amount = sub.price;
        if (sub.billingInterval === 'yearly') amount = sub.price / 12;
        if (sub.billingInterval === 'quarterly') amount = sub.price / 3;
        if (sub.billingInterval === 'weekly') amount = sub.price * 4;
        return acc + amount;
    }, 0);

    return {
        total: subscriptions.length,
        activeCount: active.length,
        cancelledCount: cancelled.length,
        mrr: monthlyRevenue
    };
  }, [subscriptions]);

  const filteredSubscriptions = useMemo(() => {
      if (filter === 'ALL') return subscriptions;
      return subscriptions.filter(s => s.status === filter);
  }, [subscriptions, filter]);

  const statItems = [
    { 
      label: 'Active Subscriptions', 
      value: stats.activeCount, 
      icon: CheckCircle, 
      color: 'text-emerald-500', 
      bg: 'bg-emerald-500/10', 
      border: 'border-emerald-500/20' 
    },
    { 
      label: 'Monthly Recurring Revenue', 
      value: formatPrice(stats.mrr), 
      icon: TrendingUp, 
      color: 'text-blue-500', 
      bg: 'bg-blue-500/10', 
      border: 'border-blue-500/20' 
    },
    { 
      label: 'Cancelled', 
      value: stats.cancelledCount, 
      icon: Ban, 
      color: 'text-red-500', 
      bg: 'bg-red-500/10', 
      border: 'border-red-500/20' 
    },
    { 
      label: 'Total', 
      value: stats.total, 
      icon: CreditCard, 
      color: 'text-violet-500', 
      bg: 'bg-violet-500/10', 
      border: 'border-violet-500/20' 
    },
  ];

  return (
    <div className='space-y-6 sm:space-y-8 pb-20'>
      {/* Header */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='space-y-1'>
          <h1 className='text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-foreground flex items-center gap-2 sm:gap-3 flex-wrap'>
            Subscriptions
            <span className='inline-flex items-center justify-center px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-primary/10 text-primary text-xs font-bold ring-1 ring-inset ring-primary/20'>
              {subscriptions.length}
            </span>
          </h1>
          <p className='text-sm sm:text-lg text-muted-foreground font-medium'>
            Manage recurring subscriptions and memberships
          </p>
        </div>
      </div>

       {/* Stats Grid */}
       <div className='grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5'>
        {statItems.map((stat, i) => (
          <div 
            key={i} 
            className={`glass-card p-4 sm:p-6 rounded-2xl sm:rounded-3xl flex flex-col justify-between hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group border ${stat.border}`}
          >
            <div className='flex justify-between items-start mb-2'>
              <div className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl ${stat.bg} ${stat.color} ring-1 ring-inset ring-white/10 group-hover:scale-110 transition-transform`}>
                <stat.icon className='h-4 w-4 sm:h-6 sm:w-6' />
              </div>
            </div>
            <div>
              <h3 className='text-lg sm:text-2xl font-black tracking-tight text-foreground'>
                {stat.value}
              </h3>
              <p className='text-[10px] sm:text-sm font-bold text-muted-foreground uppercase tracking-wider mt-1'>
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className='flex items-center gap-2 overflow-x-auto scrollbar-none pb-2'>
          {(['ALL', 'ACTIVE', 'CANCELLED'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                    'px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap',
                    filter === f 
                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25' 
                        : 'bg-card hover:bg-muted text-muted-foreground border border-border/50'
                )}
              >
                  {f === 'ALL' ? 'All Subscriptions' : f.charAt(0) + f.slice(1).toLowerCase()}
              </button>
          ))}
      </div>

      {/* Table */}
      <div className='glass-card rounded-2xl sm:rounded-[2.5rem] overflow-hidden shadow-xl shadow-black/5 border border-border/60'>
        <div className='p-4 sm:p-6 lg:p-8'>
             <SubscriptionsDataTable subscriptions={filteredSubscriptions} />
        </div>
      </div>
    </div>
  );
}
