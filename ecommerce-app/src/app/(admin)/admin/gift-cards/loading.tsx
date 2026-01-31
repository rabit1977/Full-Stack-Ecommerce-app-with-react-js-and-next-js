import { Skeleton } from '@/components/ui/skeleton';

export default function AdminGiftCardsLoading() {
  return (
    <div className='flex-1 space-y-4 p-8 pt-6'>
      <div className='flex items-center justify-between'>
         <div className="space-y-2">
            <Skeleton className='h-8 w-48 skeleton-enhanced' />
            <Skeleton className='h-4 w-64 skeleton-enhanced' />
         </div>
         <Skeleton className='h-10 w-32 rounded-lg skeleton-enhanced' />
      </div>
      
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 mt-6'>
         {[1, 2, 3, 4, 5, 6].map((i) => (
             <div key={i} className='rounded-xl border border-border/50 bg-card overflow-hidden shadow-sm h-[220px]'>
                 <div className="h-32 bg-secondary/20 p-6 flex flex-col justify-between">
                    <div className="flex justify-between">
                        <Skeleton className='h-6 w-24 skeleton-enhanced' />
                        <Skeleton className='h-6 w-16 rounded-full skeleton-enhanced' />
                    </div>
                    <Skeleton className='h-8 w-32 skeleton-enhanced' />
                 </div>
                 <div className='p-4 space-y-3'>
                    <div className="flex justify-between">
                        <Skeleton className='h-4 w-24 skeleton-enhanced' />
                        <Skeleton className='h-4 w-24 skeleton-enhanced' />
                    </div>
                    <div className="flex gap-2">
                        <Skeleton className='h-8 w-full rounded-md skeleton-enhanced' />
                        <Skeleton className='h-8 w-full rounded-md skeleton-enhanced' />
                    </div>
                 </div>
             </div>
         ))}
      </div>
    </div>
  );
}
