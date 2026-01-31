import { Skeleton } from '@/components/ui/skeleton';

export default function AdminReturnsLoading() {
  return (
    <div className='flex-1 space-y-4 p-8 pt-6 animate-pulse'>
      <div className='flex items-center justify-between'>
         <div className="space-y-2">
            <Skeleton className='h-8 w-48 skeleton-enhanced' />
            <Skeleton className='h-4 w-64 skeleton-enhanced' />
         </div>
      </div>
      
      <div className="grid gap-4 mt-6">
         {/* Filter Bar */}
         <div className="flex gap-4">
             <Skeleton className='h-10 w-full md:w-64 rounded-md skeleton-enhanced' />
             <Skeleton className='h-10 w-32 rounded-md skeleton-enhanced' />
         </div>

         {/* Return Requests List */}
         {[1, 2, 3, 4].map((i) => (
             <div key={i} className='rounded-xl border border-border/50 bg-card p-6 shadow-sm space-y-4'>
                 <div className='flex flex-col md:flex-row justify-between gap-4'>
                     <div className='flex gap-4'>
                         <Skeleton className='h-12 w-12 rounded-full skeleton-enhanced flex-shrink-0' />
                         <div className='space-y-1.5'>
                             <div className="flex items-center gap-2">
                                <Skeleton className='h-5 w-32 skeleton-enhanced' />
                                <Skeleton className='h-5 w-20 rounded-full skeleton-enhanced' />
                             </div>
                             <Skeleton className='h-4 w-48 skeleton-enhanced' />
                         </div>
                     </div>
                     <Skeleton className='h-4 w-32 skeleton-enhanced' />
                 </div>
                 
                 <div className="pl-0 md:pl-16 space-y-2">
                    <Skeleton className='h-4 w-full max-w-2xl skeleton-enhanced' />
                    <Skeleton className='h-4 w-3/4 max-w-xl skeleton-enhanced' />
                 </div>

                 <div className="pl-0 md:pl-16 flex gap-3 pt-2">
                     <Skeleton className='h-9 w-24 rounded-md skeleton-enhanced' />
                     <Skeleton className='h-9 w-24 rounded-md skeleton-enhanced' />
                 </div>
             </div>
         ))}
      </div>
    </div>
  );
}
