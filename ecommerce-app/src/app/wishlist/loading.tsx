import { ProductCardSkeleton } from '@/components/ui/product-card-skeleton';
import { Skeleton } from '@/components/ui/skeleton';

export default function WishlistLoading() {
  return (
    <div className='min-h-screen bg-slate-50 dark:bg-slate-950/50 pb-20'>
      <div className='container-wide py-10 sm:py-16'>
        {/* Header Skeleton */}
        <div className='flex items-center justify-between mb-10'>
          <div className='space-y-3'>
            <Skeleton className='h-10 sm:h-12 w-64 rounded-xl' />
            <Skeleton className='h-6 w-48 rounded-lg' />
          </div>
          <Skeleton className='h-10 w-36 rounded-full' />
        </div>

        {/* Grid Skeleton */}
        <div className='grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
