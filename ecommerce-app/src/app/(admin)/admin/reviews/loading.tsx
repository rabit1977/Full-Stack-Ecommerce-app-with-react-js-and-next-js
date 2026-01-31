import { Skeleton } from '@/components/ui/skeleton';

export default function AdminReviewsLoading() {
  return (
    <div className='space-y-6 sm:space-y-8 pb-20'>
      {/* Header Skeleton */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='space-y-2'>
           <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-md skeleton-enhanced" />
              <Skeleton className='h-10 w-64 rounded-lg skeleton-enhanced' />
           </div>
           <Skeleton className='h-5 w-96 max-w-full rounded-md skeleton-enhanced' />
        </div>
      </div>
      
      {/* Search & Filter Skeleton */}
      <div className="flex flex-col sm:flex-row gap-4">
         <Skeleton className="h-11 w-full sm:w-96 rounded-xl skeleton-enhanced" />
         <Skeleton className="h-11 w-40 rounded-xl skeleton-enhanced" />
      </div>

      {/* Reviews List Grid */}
      <div className="grid gap-6">
         {[1, 2, 3, 4].map((i) => (
             <div key={i} className="glass-card p-6 rounded-2xl border border-border/50 space-y-4">
                 <div className="flex flex-col sm:flex-row justify-between gap-4">
                     <div className="flex gap-4">
                         <Skeleton className="h-12 w-12 rounded-full skeleton-enhanced shrink-0" />
                         <div className="space-y-2">
                             <Skeleton className="h-5 w-48 skeleton-enhanced" />
                             <div className="flex gap-2 items-center">
                                 <div className="flex gap-1">
                                     {[1,2,3,4,5].map(s => <Skeleton key={s} className="h-4 w-4 rounded-sm skeleton-enhanced" />)}
                                 </div>
                                 <Skeleton className="h-4 w-24 skeleton-enhanced" />
                             </div>
                         </div>
                     </div>
                     <Skeleton className="h-8 w-24 rounded-full skeleton-enhanced" />
                 </div>
                 
                 <div className="pl-0 sm:pl-16 space-y-3"> 
                     <Skeleton className="h-16 w-full rounded-lg skeleton-enhanced" />
                     <div className="flex gap-4 pt-2">
                         <div className="flex items-center gap-2">
                             <Skeleton className="h-10 w-10 rounded-lg skeleton-enhanced" />
                             <div className="space-y-1">
                                 <Skeleton className="h-3 w-32 skeleton-enhanced" />
                                 <Skeleton className="h-3 w-20 skeleton-enhanced" />
                             </div>
                         </div>
                     </div>
                 </div>

                 <div className="pl-0 sm:pl-16 pt-4 flex gap-3 border-t border-border/40">
                     <Skeleton className="h-9 w-24 rounded-lg skeleton-enhanced" />
                     <Skeleton className="h-9 w-24 rounded-lg skeleton-enhanced" />
                     <Skeleton className="h-9 w-24 rounded-lg ml-auto skeleton-enhanced" />
                 </div>
             </div>
         ))}
      </div>
    </div>
  );
}
