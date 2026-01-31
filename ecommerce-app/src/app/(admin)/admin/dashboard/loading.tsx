import { Skeleton } from '@/components/ui/skeleton';

export default function AdminDashboardLoading() {
  return (
    <div className='space-y-8'>
      <div className='space-y-2'>
        <Skeleton className='h-10 w-56 skeleton-enhanced' />
        <Skeleton className='h-5 w-80 skeleton-enhanced' />
      </div>
      
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6'>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className='rounded-xl border border-border/50 bg-card p-6 shadow-sm space-y-4 h-40 flex flex-col justify-between'>
             <div className='flex items-start justify-between'>
                 <Skeleton className='h-4 w-24 skeleton-enhanced' />
                 <Skeleton className='h-10 w-10 rounded-xl skeleton-enhanced' />
             </div>
             <div className="space-y-2">
                 <Skeleton className='h-9 w-20 skeleton-enhanced' />
                 <Skeleton className='h-4 w-32 skeleton-enhanced' />
             </div>
          </div>
        ))}
      </div>
      
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
         {[1, 2].map(i => (
             <div key={i} className="rounded-xl border border-border/50 bg-card p-6 shadow-sm h-96 flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                      <Skeleton className='h-6 w-32 skeleton-enhanced' />
                      <Skeleton className='h-4 w-16 skeleton-enhanced' />
                  </div>
                  <div className="space-y-4 flex-1">
                      {[1,2,3,4,5].map(j => (
                          <div key={j} className="flex justify-between items-center">
                              <div className="flex gap-3">
                                  <Skeleton className='h-10 w-10 rounded-full skeleton-enhanced' />
                                  <div className="space-y-1">
                                      <Skeleton className='h-4 w-24 skeleton-enhanced' />
                                      <Skeleton className='h-3 w-16 skeleton-enhanced' />
                                  </div>
                              </div>
                              <Skeleton className='h-6 w-16 rounded-md skeleton-enhanced' />
                          </div>
                      ))}
                  </div>
             </div>
         ))}
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
         {[1, 2, 3, 4].map(i => (
             <div key={i} className="rounded-xl border border-border/50 bg-card p-6 shadow-sm flex flex-col items-center justify-center gap-3 h-32">
                 <Skeleton className='h-12 w-12 rounded-xl skeleton-enhanced' />
                 <Skeleton className='h-4 w-20 skeleton-enhanced' />
             </div>
         ))}
      </div>
    </div>
  );
}
