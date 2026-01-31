import { Skeleton } from '@/components/ui/skeleton';

export default function AdminPromotionsLoading() {
  return (
    <div className='flex-1 space-y-4 p-8 pt-6'>
      <div className='flex items-center justify-between'>
         <div className="space-y-2">
            <Skeleton className='h-8 w-48 skeleton-enhanced' />
            <Skeleton className='h-4 w-64 skeleton-enhanced' />
         </div>
         <Skeleton className='h-10 w-32 rounded-lg skeleton-enhanced' />
      </div>
      
      <div className='grid gap-4 mt-6'>
         {[1, 2, 3].map((i) => (
             <div key={i} className='rounded-xl border border-border/50 bg-card p-6 shadow-sm flex flex-col md:flex-row gap-6 items-center'>
                 <Skeleton className='h-24 w-full md:w-48 rounded-lg skeleton-enhanced flex-shrink-0' />
                 <div className='flex-1 space-y-2 w-full'>
                     <div className='flex justify-between items-start'>
                        <Skeleton className='h-6 w-48 skeleton-enhanced' />
                        <Skeleton className='h-6 w-20 rounded-full skeleton-enhanced' />
                     </div>
                     <Skeleton className='h-4 w-full max-w-lg skeleton-enhanced' />
                     <div className='flex gap-4 pt-2'>
                        <Skeleton className='h-4 w-24 skeleton-enhanced' />
                        <Skeleton className='h-4 w-24 skeleton-enhanced' />
                     </div>
                 </div>
                 <div className="flex gap-2 w-full md:w-auto">
                     <Skeleton className='h-9 w-24 rounded-md skeleton-enhanced' />
                     <Skeleton className='h-9 w-24 rounded-md skeleton-enhanced' />
                 </div>
             </div>
         ))}
      </div>
    </div>
  );
}
