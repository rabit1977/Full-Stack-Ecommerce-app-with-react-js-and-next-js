'use client';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { BarChart3, Percent, Plus, Ticket } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';
import { CouponWithStats, CouponsDataTable } from './coupons-data-table';

export function CouponsListSkeleton() {
  return (
    <div className='space-y-6 pb-20'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div className='space-y-2'>
          <Skeleton className='h-8 w-36' />
          <Skeleton className='h-4 w-48' />
        </div>
        <Skeleton className='h-10 w-full sm:w-32 rounded-xl' />
      </div>
      <div className='grid grid-cols-3 gap-3 sm:gap-6'>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className='h-24 sm:h-32 w-full rounded-2xl skeleton-enhanced' />
        ))}
      </div>
      <Skeleton className='h-96 w-full rounded-2xl skeleton-enhanced' />
    </div>
  );
}

export default function CouponsClient({ coupons }: { coupons: CouponWithStats[] }) {
  const stats = useMemo(() => {
    const total = coupons.length;
    const active = coupons.filter(c => c.isActive && (!c.expiresAt || new Date(c.expiresAt) > new Date())).length;
    const totalUsage = coupons.reduce((acc, c) => acc + (c._count?.orders || 0), 0);
    return { total, active, totalUsage };
  }, [coupons]);

  const statItems = [
    { 
      label: 'Total', 
      fullLabel: 'Total Coupons', 
      value: stats.total, 
      icon: Ticket, 
      color: 'text-blue-500', 
      bg: 'bg-blue-500/10', 
      border: 'border-blue-500/20' 
    },
    { 
      label: 'Active', 
      fullLabel: 'Active Promos', 
      value: stats.active, 
      icon: Ticket, 
      color: 'text-emerald-500', 
      bg: 'bg-emerald-500/10', 
      border: 'border-emerald-500/20' 
    },
    { 
      label: 'Used', 
      fullLabel: 'Redemptions', 
      value: stats.totalUsage, 
      icon: BarChart3, 
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
            Coupons
            <span className='inline-flex items-center justify-center px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-primary/10 text-primary text-xs font-bold ring-1 ring-inset ring-primary/20'>
              {stats.total}
            </span>
          </h1>
          <p className='text-sm sm:text-lg text-muted-foreground font-medium'>
            Manage discount codes
          </p>
        </div>
        <Button 
          asChild 
          size='default'
          className='w-full sm:w-auto rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all btn-premium'
        >
          <Link href='/admin/coupons/new'>
            <Plus className='mr-2 h-4 w-4 sm:h-5 sm:w-5' />
            New Coupon
          </Link>
        </Button>
      </div>

      {/* Stats Cards - 3 columns even on mobile */}
      <div className='grid grid-cols-3 gap-2 sm:gap-5'>
        {statItems.map((stat, i) => (
          <div 
            key={i} 
            className={cn(
              'glass-card p-3 sm:p-6 rounded-xl sm:rounded-3xl',
              'flex flex-col justify-between',
              'hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300',
              'relative overflow-hidden group border',
              stat.border
            )}
          >
            <div className='flex justify-between items-start mb-1 sm:mb-2'>
              <div className={cn(
                'p-1.5 sm:p-3 rounded-lg sm:rounded-2xl',
                stat.bg, stat.color,
                'ring-1 ring-inset ring-white/10',
                'group-hover:scale-110 transition-transform'
              )}>
                <stat.icon className='h-3.5 w-3.5 sm:h-6 sm:w-6' />
              </div>
            </div>
            <div>
              <h3 className='text-lg sm:text-3xl font-black tracking-tight text-foreground'>
                {stat.value}
              </h3>
              <p className='text-[9px] sm:text-sm font-bold text-muted-foreground uppercase tracking-wider mt-0.5'>
                <span className='sm:hidden'>{stat.label}</span>
                <span className='hidden sm:inline'>{stat.fullLabel}</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Coupons List */}
      <div className='glass-card rounded-2xl sm:rounded-[2.5rem] overflow-hidden shadow-xl shadow-black/5 border border-border/60'>
        <div className='p-4 sm:p-8 border-b border-border/50 bg-secondary/5 backdrop-blur-sm'>
          <h2 className='text-base sm:text-xl font-bold flex items-center gap-2 sm:gap-3'>
            <Percent className='h-4 w-4 sm:h-5 sm:w-5 text-primary' />
            All Coupons
          </h2>
        </div>
        <div className='p-4 sm:p-8 pt-4 sm:pt-6'>
          {coupons.length > 0 ? (
            <CouponsDataTable coupons={coupons} />
          ) : (
            <div className='text-center py-12 sm:py-20 text-muted-foreground'>
              <div className='w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-secondary flex items-center justify-center mb-4 sm:mb-6'>
                <Ticket className='h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground/50' />
              </div>
              <h3 className='text-lg sm:text-xl font-bold text-foreground'>No coupons found</h3>
              <p className='mt-2 text-sm sm:text-base text-muted-foreground'>
                Create your first discount code to get started.
              </p>
              <Button asChild className='mt-4 rounded-xl'>
                <Link href='/admin/coupons/new'>
                  <Plus className='mr-2 h-4 w-4' />
                  Create Coupon
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
