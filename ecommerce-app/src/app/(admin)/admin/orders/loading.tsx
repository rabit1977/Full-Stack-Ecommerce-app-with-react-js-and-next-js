import { Skeleton } from '@/components/ui/skeleton';

export default function AdminOrdersLoading() {
  return (
    <div className='space-y-6 sm:space-y-8 pb-20'>
      {/* Header Skeleton */}
      <div className='flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between'>
        <div className='space-y-2'>
          <Skeleton className='h-10 w-48 sm:w-64 rounded-lg skeleton-enhanced' />
          <Skeleton className='h-5 w-32 sm:w-48 rounded-md skeleton-enhanced' />
        </div>
        
        <Skeleton className='h-10 w-32 rounded-xl skeleton-enhanced' />
      </div>

      {/* Stats Grid Skeleton */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5'>
        {[1, 2, 3, 4].map((i) => (
          <div 
            key={i} 
            className='glass-card p-4 sm:p-6 rounded-2xl sm:rounded-3xl flex flex-col justify-between border border-border/50 h-32'
          >
            <div className='flex justify-between items-start mb-2'>
              <Skeleton className='h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl skeleton-enhanced' />
            </div>
            <div className='space-y-2'>
               <Skeleton className='h-8 w-16 rounded-md skeleton-enhanced' />
               <Skeleton className='h-3 w-20 rounded-md skeleton-enhanced' />
            </div>
          </div>
        ))}
      </div>

      {/* Orders Table Skeleton */}
      <div className='glass-card rounded-2xl sm:rounded-[2.5rem] overflow-hidden shadow-xl shadow-black/5 border border-border/60'>
        <div className='p-4 sm:p-6 lg:p-8 space-y-6'> 
          {/* Toolbar Skeleton */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pb-4 border-b border-border/40">
              <Skeleton className="h-10 w-full sm:w-64 rounded-lg skeleton-enhanced" />
              <div className="flex gap-2">
                 <Skeleton className="h-9 w-24 rounded-lg skeleton-enhanced" />
                 <Skeleton className="h-9 w-24 rounded-lg skeleton-enhanced" />
              </div>
          </div>

          {/* Table Headers */}
          <div className="hidden sm:grid grid-cols-6 gap-4 py-3 px-4 bg-secondary/10 rounded-lg">
             <Skeleton className="h-4 w-20 skeleton-enhanced" />
             <Skeleton className="h-4 w-24 skeleton-enhanced" />
             <Skeleton className="h-4 w-32 skeleton-enhanced" />
             <Skeleton className="h-4 w-20 skeleton-enhanced" />
             <Skeleton className="h-4 w-24 skeleton-enhanced" />
             <Skeleton className="h-4 w-12 ml-auto skeleton-enhanced" />
          </div>

          {/* Table Rows Skeleton */}
          <div className="space-y-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex flex-col sm:grid sm:grid-cols-6 gap-4 items-center p-4 rounded-xl bg-secondary/5 border border-secondary/10">
                 <Skeleton className="h-5 w-24 w-full sm:w-auto skeleton-enhanced" />
                 <Skeleton className="h-5 w-32 w-full sm:w-auto skeleton-enhanced" />
                 <div className="w-full sm:w-auto flex items-center gap-2">
                    <Skeleton className="h-8 w-8 rounded-full skeleton-enhanced" />
                    <Skeleton className="h-5 w-24 skeleton-enhanced" />
                 </div>
                 <Skeleton className="h-5 w-16 w-full sm:w-auto skeleton-enhanced" />
                 <Skeleton className="h-7 w-24 rounded-full w-full sm:w-auto skeleton-enhanced" />
                 <Skeleton className="h-8 w-8 ml-auto rounded-md skeleton-enhanced hidden sm:block" />
              </div>
            ))}
          </div>

          {/* Pagination Skeleton */}
          <div className="flex justify-between items-center pt-4 border-t border-border/40">
             <Skeleton className="h-4 w-48 rounded skeleton-enhanced hidden sm:block" />
             <div className="flex gap-2 mx-auto sm:mx-0">
                <Skeleton className="h-9 w-20 rounded-lg skeleton-enhanced" />
                <Skeleton className="h-9 w-20 rounded-lg skeleton-enhanced" />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
