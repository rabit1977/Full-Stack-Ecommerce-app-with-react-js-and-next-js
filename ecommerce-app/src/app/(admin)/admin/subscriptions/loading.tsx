import { Skeleton } from '@/components/ui/skeleton';

export default function AdminSubscriptionsLoading() {
  return (
    <div className='space-y-6 sm:space-y-8 pb-20'>
      {/* Header Skeleton */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='space-y-2'>
          <Skeleton className='h-10 w-48 sm:w-64 rounded-lg skeleton-enhanced' />
          <Skeleton className='h-5 w-32 sm:w-48 rounded-md skeleton-enhanced' />
        </div>
      </div>

      {/* Stats Grid Skeleton */}
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5'>
        {[1, 2, 3, 4].map((i) => (
          <div 
            key={i} 
            className='glass-card p-4 sm:p-6 rounded-2xl sm:rounded-3xl flex flex-col justify-between border border-border/50'
          >
            <div className='flex justify-between items-start mb-2'>
              <Skeleton className='h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl skeleton-enhanced' />
            </div>
            <div className='flex flex-col items-start min-w-24 gap-2'>
              <Skeleton className='h-8 w-16 sm:w-20 rounded-md skeleton-enhanced' />
              <Skeleton className='h-4 w-24 rounded-md skeleton-enhanced' />
            </div>
          </div>
        ))}
      </div>

      {/* Subscriptions List Skeleton */}
      <div className='glass-card rounded-2xl sm:rounded-[2.5rem] overflow-hidden shadow-xl shadow-black/5 border border-border/60'>
        <div className='p-4 sm:p-6 lg:p-8 space-y-6'>
            {/* Toolbar */}
             <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center pb-4 border-b border-border/40">
                <Skeleton className="h-10 w-full sm:w-64 rounded-lg skeleton-enhanced" />
            </div>

             {/* Items */}
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex flex-col sm:flex-row gap-4 items-center p-4 rounded-xl bg-secondary/5 border border-secondary/10">
                   <div className="flex items-center gap-4 w-full sm:w-auto flex-1">
                      <Skeleton className="h-10 w-10 rounded-full skeleton-enhanced shrink-0" />
                      <div className="space-y-2 flex-1">
                         <Skeleton className="h-5 w-3/4 max-w-[200px] rounded skeleton-enhanced" />
                         <Skeleton className="h-4 w-1/2 max-w-[150px] rounded skeleton-enhanced" />
                      </div>
                   </div>
                   <Skeleton className="h-8 w-24 rounded-full skeleton-enhanced" />
                </div>
              ))}
            </div>
        </div>
      </div>
    </div>
  );
}
