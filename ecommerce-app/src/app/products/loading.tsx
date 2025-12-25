import { ProductCardSkeleton } from '@/components/ui/product-card-skeleton';

// This component will be automatically used by Next.js as a loading fallback
// for the `app/products/page.tsx` route.

export default function Loading() {
  return (
    <div className='bg-slate-50 dark:bg-slate-900'>
      <div className='container mx-auto px-4 py-16'>
        {/* Skeleton for ProductGridControls */}
        <div className='md:flex md:items-center md:justify-between'>
          <div>
            <div className='h-9 w-48 rounded-md bg-slate-200 dark:bg-slate-700 animate-pulse'></div>
            <div className='h-7 w-64 mt-2 rounded-md bg-slate-200 dark:bg-slate-700 animate-pulse'></div>
          </div>
          <div className='mt-4 flex flex-col gap-4 sm:flex-row md:mt-0'>
            <div className='h-9 w-full sm:w-40 rounded-md bg-slate-200 dark:bg-slate-700 animate-pulse'></div>
            <div className='h-9 w-full sm:w-40 rounded-md bg-slate-200 dark:bg-slate-700 animate-pulse'></div>
          </div>
        </div>

        {/* Skeleton for ProductList */}
        <div className='mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>

        {/* Skeleton for Pagination */}
        <div className="flex justify-center items-center mt-12">
            <div className="flex items-center gap-2">
                <div className="h-9 w-20 rounded-md bg-slate-200 dark:bg-slate-700 animate-pulse"></div>
                <div className="h-9 w-24 rounded-md bg-slate-200 dark:bg-slate-700 animate-pulse"></div>
                <div className="h-9 w-20 rounded-md bg-slate-200 dark:bg-slate-700 animate-pulse"></div>
            </div>
        </div>
      </div>
    </div>
  );
}
