import { Skeleton } from '@/components/ui/skeleton';

export default function AdminActivityLoading() {
  return (
    <div className='flex-1 space-y-4 p-8 pt-6'>
      <div className='flex items-center justify-between'>
         <div className="space-y-2">
            <Skeleton className='h-8 w-48 skeleton-enhanced' />
            <Skeleton className='h-4 w-64 skeleton-enhanced' />
         </div>
      </div>
      
      <div className='mt-6 rounded-xl border border-border/50 bg-card shadow-sm overflow-hidden'>
          <div className="p-6 border-b border-border/40">
              <Skeleton className='h-6 w-32 skeleton-enhanced' />
          </div>
          <div className="divide-y divide-border/40">
             {[1, 2, 3, 4, 5, 6].map((i) => (
                 <div key={i} className="p-4 flex gap-4 items-start">
                     <Skeleton className='h-10 w-10 rounded-full skeleton-enhanced flex-shrink-0' />
                     <div className="flex-1 space-y-2"> 
                         <div className="flex justify-between items-start">
                             <Skeleton className='h-5 w-48 skeleton-enhanced' />
                             <Skeleton className='h-4 w-24 skeleton-enhanced' />
                         </div>
                         <Skeleton className='h-4 w-full max-w-md skeleton-enhanced' />
                     </div>
                 </div>
             ))}
          </div>
      </div>
    </div>
  );
}
