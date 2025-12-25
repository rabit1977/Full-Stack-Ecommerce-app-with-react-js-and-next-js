// components/ui/product-card-skeleton.tsx
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const ProductCardSkeleton = () => {
  return (
    <div className='w-full'>
      <div className='group relative w-full overflow-hidden rounded-2xl border bg-white shadow-md transition-shadow hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 **animate-pulse**'>
        {/* Image Skeleton */}
        <Skeleton className='h-48 w-full rounded-b-none' />

        {/* Buttons Skeleton */}
        <div className='absolute right-2 top-2 flex gap-2'>
          <Skeleton className='h-8 w-8 rounded-full' />
          <Skeleton className='h-8 w-8 rounded-full' />
        </div>

        <div className='p-4'>
          {/* Brand Skeleton */}
          <Skeleton className='h-3 w-1/3 mb-1' />
          {/* Title Skeleton */}
          <Skeleton className='h-5 w-2/3 mb-2' />
          <div className='mt-2 flex items-center justify-between'>
            {/* Price Skeleton */}
            <Skeleton className='h-6 w-1/4' />
            {/* Rating and Reviews Skeleton */}
            <div className='flex items-center gap-1'>
              <Skeleton className='h-4 w-16' />
              <Skeleton className='h-3 w-8' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { ProductCardSkeleton };