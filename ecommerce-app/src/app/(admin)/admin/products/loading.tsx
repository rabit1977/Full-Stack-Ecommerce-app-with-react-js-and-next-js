import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className='space-y-6 sm:space-y-8 pb-20'>
      {/* Header Skeleton */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='space-y-2'>
          <Skeleton className='h-10 w-48 sm:w-64 skeleton-enhanced' />
          <Skeleton className='h-5 w-32 sm:w-40 skeleton-enhanced' />
        </div>
        <div className='flex gap-2 sm:gap-3'>
          <Skeleton className='h-10 w-24 sm:w-32 rounded-xl skeleton-enhanced' />
          <Skeleton className='h-10 w-32 sm:w-40 rounded-xl skeleton-enhanced' />
        </div>
      </div>

      {/* Stats Grid Skeleton */}
      <div className='grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-5'>
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className='h-32 w-full rounded-2xl sm:rounded-3xl skeleton-enhanced' />
        ))}
      </div>

      {/* Products List Skeleton */}
      <div className='glass-card rounded-2xl sm:rounded-[2.5rem] overflow-hidden border border-border/60'>
        <div className='p-4 sm:p-6 lg:p-8 space-y-6'>
          {/* Toolbar Skeleton */}
          <div className='flex flex-col sm:flex-row gap-4 justify-between'>
             <Skeleton className='h-10 w-full sm:w-64 rounded-xl skeleton-enhanced' />
             <div className='flex gap-2'>
                <Skeleton className='h-10 w-24 rounded-xl skeleton-enhanced' />
                <Skeleton className='h-10 w-24 rounded-xl skeleton-enhanced' />
             </div>
          </div>

          {/* Table Header Skeleton */}
          <div className='flex items-center gap-4 py-3 border-b border-border/50'>
             <Skeleton className='h-6 w-16 skeleton-enhanced' />
             <Skeleton className='h-6 w-32 flex-1 skeleton-enhanced' />
             <Skeleton className='h-6 w-24 skeleton-enhanced' />
             <Skeleton className='h-6 w-24 skeleton-enhanced' />
             <Skeleton className='h-6 w-16 skeleton-enhanced' />
          </div>

          {/* Table Rows Skeleton */}
          <div className='space-y-4'>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className='flex items-center gap-4 py-2'>
                <Skeleton className='h-16 w-16 rounded-xl skeleton-enhanced' />
                <div className='space-y-2 flex-1'>
                    <Skeleton className='h-5 w-3/4 skeleton-enhanced' />
                    <Skeleton className='h-4 w-1/2 skeleton-enhanced' />
                </div>
                <Skeleton className='h-8 w-24 rounded-lg skeleton-enhanced' />
                <Skeleton className='h-8 w-24 rounded-lg skeleton-enhanced' />
                <div className='flex gap-2'>
                    <Skeleton className='h-8 w-8 rounded-lg skeleton-enhanced' />
                    <Skeleton className='h-8 w-8 rounded-lg skeleton-enhanced' />
                </div>
              </div>
            ))}
          </div>
          
           {/* Pagination Skeleton */}
           <div className='flex justify-between items-center pt-4'>
              <Skeleton className='h-10 w-24 rounded-lg skeleton-enhanced' />
              <Skeleton className='h-10 w-24 rounded-lg skeleton-enhanced' />
           </div>
        </div>
      </div>
    </div>
  );
}
