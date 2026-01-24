'use client';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart3, Percent, Plus, Ticket } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';
import { CouponWithStats, CouponsDataTable } from './coupons-data-table';

export function CouponsListSkeleton() {
  return (
    <div className='space-y-8 pb-20'>
      <div className='flex items-center justify-between'>
        <div className='space-y-2'>
          <Skeleton className='h-10 w-48' />
          <Skeleton className='h-5 w-64' />
        </div>
        <Skeleton className='h-12 w-36 rounded-full' />
      </div>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
         {[1, 2, 3].map((i) => (
            <Skeleton key={i} className='h-32 w-full rounded-3xl skeleton-enhanced' />
         ))}
      </div>
      <Skeleton className='h-96 w-full rounded-[2.5rem] skeleton-enhanced' />
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

  return (
    <div className='space-y-8 pb-20'>
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-500'>
        <div className='space-y-1'>
          <h1 className='text-3xl sm:text-4xl font-black tracking-tight text-foreground flex items-center gap-3'>
            Coupons
            <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold ring-1 ring-inset ring-primary/20">
               {stats.total}
            </span>
          </h1>
          <p className='text-lg text-muted-foreground font-medium'>
            Manage discount codes and promotional offers
          </p>
        </div>
        <Button asChild size="lg" className="rounded-full font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all btn-premium">
          <Link href="/admin/coupons/new">
            <Plus className="mr-2 h-5 w-5" />
            New Coupon
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className='grid gap-5 md:grid-cols-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100'>
        {[
            { label: 'Total Coupons', value: stats.total, icon: Ticket, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
            { label: 'Active Promotions', value: stats.active, icon: Ticket, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
            { label: 'Total Redemptions', value: stats.totalUsage, icon: BarChart3, color: 'text-violet-500', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
        ].map((stat, i) => (
             <div key={i} className={`glass-card p-6 rounded-3xl flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group border ${stat.border}`}>
                <div className='flex justify-between items-start mb-2'>
                    <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} ring-1 ring-inset ring-white/10 group-hover:scale-110 transition-transform`}>
                       <stat.icon className='h-6 w-6' />
                    </div>
                </div>
                <div>
                   <h3 className='text-3xl font-black mt-2 tracking-tight text-foreground'>{stat.value}</h3>
                   <p className='text-sm font-bold text-muted-foreground uppercase tracking-wider mt-1'>{stat.label}</p>
                </div>
             </div>
        ))}
      </div>

      <div className='glass-card rounded-[2.5rem] overflow-hidden shadow-xl shadow-black/5 border border-border/60 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200'>
        <div className="p-8 border-b border-border/50 bg-secondary/5 backdrop-blur-sm flex items-center justify-between">
            <h2 className='text-xl font-bold flex items-center gap-3'>
              <Percent className="h-5 w-5 text-primary" />
              All Coupons
            </h2>
         </div>
         <div className='p-8 pt-0'>
            {coupons.length > 0 ? (
                <div className="mt-8">
                  <CouponsDataTable coupons={coupons} />
                </div>
            ) : (
                <div className='text-center py-20 text-muted-foreground'>
                  <div className='w-20 h-20 mx-auto rounded-full bg-secondary flex items-center justify-center mb-6'>
                     <Ticket className='h-10 w-10 text-muted-foreground/50' />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">No coupons found</h3>
                  <p className="mt-2 text-muted-foreground">Create your first discount code to get started.</p>
                </div>
            )}
         </div>
      </div>
    </div>
  );
}
