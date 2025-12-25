// app/products/[id]/ProductDetailSkeleton.tsx
import { Skeleton } from '@/components/ui/skeleton';

export const ProductDetailSkeleton = () => {
  return (
    <div className='bg-white dark:bg-slate-900 min-h-screen'>
      <div className='container mx-auto px-4 py-12'>
        {/* Breadcrumb Skeleton */}
        <Skeleton className='h-10 w-40 mb-6' />
        
        {/* Product Main Content Skeleton */}
        <div className='grid gap-8 md:grid-cols-2 md:gap-12'>
          {/* Image Gallery Skeleton */}
          <div className='space-y-4'>
            <Skeleton className='aspect-square w-full rounded-lg' />
            <div className='grid grid-cols-4 gap-2'>
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className='aspect-square rounded-md' />
              ))}
            </div>
          </div>
          
          {/* Product Info Skeleton */}
          <div className='space-y-6'>
            <Skeleton className='h-10 w-3/4' />
            <Skeleton className='h-6 w-1/4' />
            <Skeleton className='h-24 w-full' />
            <Skeleton className='h-12 w-full' />
            <Skeleton className='h-12 w-full' />
          </div>
        </div>

        {/* Separator Skeleton */}
        <Skeleton className='h-px w-full my-12' />

        {/* Reviews Section Skeleton */}
        <div className='space-y-6'>
          <Skeleton className='h-8 w-48' />
          <div className='space-y-4'>
            {[...Array(3)].map((_, i) => (
              <div key={i} className='space-y-2'>
                <Skeleton className='h-6 w-32' />
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-4 w-5/6' />
              </div>
            ))}
          </div>
        </div>

        {/* Separator Skeleton */}
        <Skeleton className='h-px w-full my-12' />

        {/* Related Products Skeleton */}
        <div className='space-y-6'>
          <Skeleton className='h-8 w-56' />
          <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
            {[...Array(4)].map((_, i) => (
              <div key={i} className='space-y-4'>
                <Skeleton className='aspect-square w-full rounded-lg' />
                <Skeleton className='h-6 w-full' />
                <Skeleton className='h-4 w-2/3' />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};