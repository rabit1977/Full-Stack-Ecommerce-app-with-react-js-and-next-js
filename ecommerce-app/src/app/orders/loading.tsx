import { Skeleton } from '@/components/ui/skeleton';

export default function OrdersLoading() {
  return (
    <div className='min-h-screen bg-slate-50 dark:bg-slate-950/50 pb-20'>
      <div className='container-wide py-10 sm:py-16'>
        {/* Header Skeleton */}
        <div className='mb-12'>
          <Skeleton className='h-10 w-32 rounded-full mb-8' />
          
          <div className='flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6'>
            <div className="space-y-3">
              <Skeleton className='h-10 sm:h-12 w-64 rounded-xl' />
              <Skeleton className='h-6 w-96 rounded-lg' />
            </div>
            <Skeleton className='h-10 w-40 rounded-full' />
          </div>
        </div>

        {/* Statistics Cards Skeleton */}
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12'>
          {[1, 2, 3, 4].map((i) => (
             <div key={i} className='glass-card p-6 rounded-3xl h-32 flex flex-col justify-between border border-border/50'>
               <div className='flex justify-between items-start'>
                  <Skeleton className='h-4 w-24' />
                  <Skeleton className='h-10 w-10 rounded-2xl' />
               </div>
               <Skeleton className='h-8 w-32' />
             </div>
          ))}
        </div>

        {/* Orders Table Skeleton */}
        <div className='glass-card rounded-3xl overflow-hidden border border-border/60'>
          {/* Table Header */}
          <div className='p-8 border-b border-border/50 flex items-center justify-between'>
            <Skeleton className='h-8 w-48' />
            <Skeleton className='h-6 w-20 rounded-full' />
          </div>
          
          <div className='p-0'>
             {/* Simulating Table Rows */}
             <div className='hidden md:block'>
               <div className='flex gap-4 p-5 border-b border-border/50 bg-secondary/30'>
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                     <Skeleton key={i} className='h-4 w-full' />
                  ))}
               </div>
               {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className='flex items-center gap-4 p-6 border-b border-border/50'>
                     <Skeleton className='h-5 w-24' />
                     <Skeleton className='h-5 w-32' />
                     <Skeleton className='h-6 w-24 rounded-full' />
                     <Skeleton className='h-5 w-16 mx-auto' />
                     <Skeleton className='h-5 w-24 ml-auto' />
                     <Skeleton className='h-9 w-28 rounded-xl ml-4' />
                  </div>
               ))}
             </div>

             {/* Mobile View Skeleton */}
             <div className='md:hidden space-y-4 p-4'>
                {[1, 2, 3].map((i) => (
                   <Skeleton key={i} className='h-40 w-full rounded-2xl' />
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
