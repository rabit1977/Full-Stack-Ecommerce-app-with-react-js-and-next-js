import { Skeleton } from '@/components/ui/skeleton';

export default function AdminNotificationsLoading() {
  return (
    <div className='flex-1 space-y-4 p-8 pt-6 animate-pulse'>
      <div className='flex items-center justify-between'>
         <div className="space-y-2">
            <Skeleton className='h-8 w-48Skeleton-enhanced' />
            <Skeleton className='h-4 w-64 skeleton-enhanced' />
         </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 mt-4 h-[600px]">
         {/* Form Skeleton */}
         <div className="rounded-xl border border-border/50 bg-card p-6 shadow-sm space-y-6">
             <Skeleton className='h-6 w-32 skeleton-enhanced' />
             
             <div className="space-y-3">
                 <Skeleton className='h-4 w-24 skeleton-enhanced' />
                 <Skeleton className='h-10 w-full rounded-md skeleton-enhanced' />
             </div>
             
             <div className="space-y-3">
                 <Skeleton className='h-4 w-24 skeleton-enhanced' />
                 <Skeleton className='h-32 w-full rounded-md skeleton-enhanced' />
             </div>

             <div className="space-y-3">
                 <Skeleton className='h-4 w-24 skeleton-enhanced' />
                 <div className="flex gap-4">
                     <Skeleton className='h-10 w-32 rounded-md skeleton-enhanced' />
                     <Skeleton className='h-10 w-32 rounded-md skeleton-enhanced' />
                 </div>
             </div>
             
             <Skeleton className='h-12 w-full rounded-md mt-8 skeleton-enhanced' />
         </div>

         {/* Preview/History Skeleton */}
         <div className="rounded-xl border border-border/50 bg-card p-6 shadow-sm flex flex-col">
             <Skeleton className='h-6 w-40 mb-6 skeleton-enhanced' />
             
             <div className="space-y-4 flex-1">
                 {[1, 2, 3].map(i => (
                     <div key={i} className="p-4 rounded-lg bg-muted/20 border border-border/30 space-y-3">
                         <div className="flex justify-between">
                             <Skeleton className='h-5 w-48 skeleton-enhanced' />
                             <Skeleton className='h-4 w-20 skeleton-enhanced' />
                         </div>
                         <Skeleton className='h-4 w-full skeleton-enhanced' />
                     </div>
                 ))}
             </div>
         </div>
      </div>
    </div>
  );
}
