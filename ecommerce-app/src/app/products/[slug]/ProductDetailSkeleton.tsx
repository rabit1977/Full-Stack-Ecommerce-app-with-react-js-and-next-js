// app/products/[id]/ProductDetailSkeleton.tsx
import { ProductCardSkeleton } from '@/components/ui/product-card-skeleton';
import { Skeleton } from '@/components/ui/skeleton';

export const ProductDetailSkeleton = () => {
  return (
    <div className='bg-white dark:bg-slate-900 min-h-screen'>
      <div className='container-wide py-12'>
        {/* Breadcrumb Skeleton */}
        <Skeleton className='h-10 w-40 mb-6' />
        
        {/* Product Main Content Skeleton */}
        <div className='grid gap-8 md:grid-cols-2 md:gap-12'>
          {/* Image Gallery Skeleton */}
          <div className='space-y-4'>
            <Skeleton className='aspect-square w-full rounded-2xl' />
            <div className='grid grid-cols-4 gap-4'>
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className='aspect-square rounded-xl' />
              ))}
            </div>
          </div>
          
          {/* Product Info Skeleton */}
          <div className='space-y-8'>
            <div className='space-y-4'>
              <Skeleton className='h-4 w-24' />
              <Skeleton className='h-12 w-3/4' />
              <div className='flex items-center gap-4'>
                 <Skeleton className='h-8 w-32' />
                 <Skeleton className='h-6 w-24' />
              </div>
            </div>
            
            <Skeleton className='h-32 w-full rounded-xl' />

            <div className='space-y-4 pt-4 border-t border-border'>
               <div className='grid grid-cols-2 gap-4'>
                  <Skeleton className='h-12 w-full rounded-xl' />
                  <Skeleton className='h-12 w-full rounded-xl' />
               </div>
               <Skeleton className='h-14 w-full rounded-full' />
            </div>
          </div>
        </div>

        {/* Separator Skeleton */}
        <Skeleton className='h-px w-full my-16' />

        {/* Reviews Section Skeleton */}
        <div className='space-y-8'>
          <Skeleton className='h-8 w-48' />
          <div className='grid gap-6 md:grid-cols-2'>
            {[...Array(2)].map((_, i) => (
              <div key={i} className='p-6 rounded-2xl border border-border space-y-4'>
                <div className='flex items-center gap-4'>
                   <Skeleton className='h-12 w-12 rounded-full' />
                   <div className='space-y-2'>
                      <Skeleton className='h-4 w-32' />
                      <Skeleton className='h-3 w-24' />
                   </div>
                </div>
                <Skeleton className='h-16 w-full' />
              </div>
            ))}
          </div>
        </div>

        {/* Separator Skeleton */}
        <Skeleton className='h-px w-full my-16' />

        {/* Related Products Skeleton */}
        <div className='space-y-8'>
          <Skeleton className='h-8 w-56' />
          <div className='grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6'>
            {[...Array(4)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};