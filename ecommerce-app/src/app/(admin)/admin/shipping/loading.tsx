import { Skeleton } from '@/components/ui/skeleton';

export default function AdminShippingLoading() {
  return (
    <div className='flex-1 space-y-4 p-8 pt-6'>
      <div className='flex items-center justify-between'>
         <div className="space-y-2">
            <Skeleton className='h-8 w-48 skeleton-enhanced' />
            <Skeleton className='h-4 w-64 skeleton-enhanced' />
         </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 mt-4">
         {/* Zones Skeleton */}
         <div className="space-y-4">
             <div className="flex items-center justify-between">
                <Skeleton className='h-6 w-32 skeleton-enhanced' />
                <Skeleton className='h-8 w-24 rounded-md skeleton-enhanced' />
             </div>
             {[1, 2, 3].map(i => (
                 <div key={i} className="rounded-xl border border-border/50 bg-card p-4 shadow-sm flex items-center justify-between">
                     <div className="space-y-1">
                         <Skeleton className='h-5 w-32 skeleton-enhanced' />
                         <Skeleton className='h-3 w-48 skeleton-enhanced' />
                     </div>
                     <Skeleton className='h-8 w-8 rounded-md skeleton-enhanced' />
                 </div>
             ))}
         </div>

         {/* Rates Skeleton */}
         <div className="space-y-4">
             <div className="flex items-center justify-between">
                <Skeleton className='h-6 w-32 skeleton-enhanced' />
                <Skeleton className='h-8 w-24 rounded-md skeleton-enhanced' />
             </div>
             {[1, 2, 3].map(i => (
                 <div key={i} className="rounded-xl border border-border/50 bg-card p-4 shadow-sm flex items-center justify-between">
                     <div className="flex items-center gap-4">
                         <Skeleton className='h-10 w-10 rounded-full skeleton-enhanced' />
                         <div className="space-y-1">
                             <Skeleton className='h-5 w-40 skeleton-enhanced' />
                             <Skeleton className='h-3 w-24 skeleton-enhanced' />
                         </div>
                     </div>
                     <Skeleton className='h-6 w-16 rounded-md skeleton-enhanced' />
                 </div>
             ))}
         </div>
      </div>
    </div>
  );
}
