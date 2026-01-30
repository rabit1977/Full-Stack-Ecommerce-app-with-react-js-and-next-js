'use client';

import { ProductCardSkeleton } from '@/components/ui/product-card-skeleton';

/**
 * Products Page Loading Skeleton
 * Consistent with other loading pages
 */
export default function ProductsLoading() {
  return (
    <div className='page-wrapper'>
      <div className='container-wide py-8 sm:py-12 lg:py-16'>
        {/* Header Skeleton */}
        <div className='mb-8'>
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
            <div className='space-y-2'>
              <div className='h-10 w-56 skeleton-enhanced rounded-xl' />
              <div className='h-5 w-36 skeleton-enhanced rounded-lg' />
            </div>
            <div className='flex gap-3'>
              <div className='h-11 w-32 skeleton-enhanced rounded-xl' />
              <div className='h-11 w-40 skeleton-enhanced rounded-xl' />
            </div>
          </div>
        </div>

        <div className='lg:grid lg:grid-cols-4 lg:gap-8 xl:gap-12'>
          {/* Filter Sidebar Skeleton */}
          <aside className='hidden lg:block lg:col-span-1 sticky top-24 self-start'>
            <div className='rounded-2xl border border-border bg-card p-6 space-y-8'>
               {/* Categories - Folder Structure Mimic */}
               <div className='space-y-5'>
                  <div className='flex items-center gap-2'>
                     <div className='h-6 w-6 skeleton-enhanced rounded' />
                     <div className='h-5 w-24 skeleton-enhanced rounded' />
                  </div>
                  <div className='space-y-3 pl-2'>
                     {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className='flex items-center gap-3'>
                           <div className='h-4 w-4 skeleton-enhanced rounded' />
                           <div className='h-4 w-32 skeleton-enhanced rounded' />
                        </div>
                     ))}
                  </div>
               </div>

               {/* Separator */}
               <div className='h-px w-full bg-border' />

               {/* Brands */}
               <div className='space-y-4'>
                  <div className='h-5 w-20 skeleton-enhanced rounded' />
                  <div className='space-y-3'>
                     {[1, 2, 3, 4].map((i) => (
                        <div key={i} className='flex items-center gap-3'>
                           <div className='h-4 w-4 skeleton-enhanced rounded' />
                           <div className='h-4 w-24 skeleton-enhanced rounded' />
                        </div>
                     ))}
                  </div>
               </div>

               {/* Separator */}
               <div className='h-px w-full bg-border' />

               {/* Price Range */}
               <div className='space-y-4'>
                  <div className='h-5 w-28 skeleton-enhanced rounded' />
                  <div className='h-12 w-full skeleton-enhanced rounded-xl' />
               </div>
            </div>
          </aside>

          {/* Product Grid Skeleton */}
          <main className='lg:col-span-3'>
            <div className='grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6'>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i}>
                   <ProductCardSkeleton />
                </div>
              ))}
            </div>

            {/* Pagination Skeleton */}
            <div className='flex justify-center mt-10 gap-2'>
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className='h-10 w-10 skeleton-enhanced rounded-xl'
                />
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
