'use client';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Ticket } from 'lucide-react';
import Link from 'next/link';
import { CouponsDataTable } from './coupons-data-table';

export function CouponsListSkeleton() {
  return (
    <div className='space-y-8'>
      <div className='flex items-center justify-between'>
        <div className='space-y-2'>
          <Skeleton className='h-8 w-48' />
          <Skeleton className='h-4 w-64' />
        </div>
        <Skeleton className='h-10 w-32' />
      </div>
      <Skeleton className='h-96 w-full' />
    </div>
  );
}

export default function CouponsClient({ coupons }: { coupons: any[] }) {
  return (
    <div className='space-y-8'>
      <div className='flex items-center justify-between'>
        <div className='space-y-1'>
          <div className='flex items-center gap-2'>
            <Ticket className='h-6 w-6 text-slate-600 dark:text-slate-400' />
            <h1 className='text-3xl font-bold tracking-tight'>Coupons</h1>
          </div>
          <p className='text-slate-600 dark:text-slate-400'>
            Manage discount codes and promotional offers
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/coupons/new">
            <Plus className="mr-2 h-4 w-4" />
            New Coupon
          </Link>
        </Button>
      </div>

      <CouponsDataTable coupons={coupons} />
    </div>
  );
}
