import { Skeleton } from '@/components/ui/skeleton';

export default function AdminCouponsLoading() {
  return (
    <div className='p-4 sm:p-8 max-w-7xl mx-auto space-y-8 animate-pulse'>
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
         <div className="space-y-2">
            <Skeleton className='h-10 w-64 skeleton-enhanced' />
            <Skeleton className='h-5 w-96 max-w-full skeleton-enhanced' />
         </div>
         <Skeleton className='h-11 w-40 rounded-full skeleton-enhanced' />
      </div>

      {/* Coupon Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
         {[1, 2, 3, 4, 5, 6].map((i) => (
             <div key={i} className="glass-card rounded-2xl overflow-hidden border border-border/50 h-[220px] flex flex-col">
                 <div className="p-6 flex-1 space-y-4">
                     <div className="flex justify-between items-start">
                         <Skeleton className="h-8 w-32 rounded-md skeleton-enhanced" />
                         <Skeleton className="h-6 w-16 rounded-full skeleton-enhanced" />
                     </div>
                     <Skeleton className="h-4 w-full skeleton-enhanced" />
                     <div className="flex gap-4 pt-2">
                         <Skeleton className="h-5 w-24 skeleton-enhanced" />
                         <Skeleton className="h-5 w-24 skeleton-enhanced" />
                     </div>
                 </div>
                 <div className="px-6 py-4 bg-muted/20 border-t border-border/40 flex justify-between items-center">
                     <Skeleton className="h-4 w-32 skeleton-enhanced" />
                     <div className="flex gap-2">
                         <Skeleton className="h-8 w-8 rounded-md skeleton-enhanced" />
                         <Skeleton className="h-8 w-8 rounded-md skeleton-enhanced" />
                     </div>
                 </div>
             </div>
         ))}
      </div>
    </div>
  );
}
