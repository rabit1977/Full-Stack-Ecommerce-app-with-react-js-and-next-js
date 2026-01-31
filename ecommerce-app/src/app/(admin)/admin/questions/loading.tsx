import { Skeleton } from '@/components/ui/skeleton';

export default function AdminQuestionsLoading() {
  return (
    <div className='flex-1 space-y-4 p-8 pt-6 animate-pulse'>
      <div className='flex items-center justify-between'>
         <div className="space-y-2">
            <div className="flex items-center gap-3">
               <Skeleton className="h-8 w-8 rounded-md skeleton-enhanced" />
               <Skeleton className='h-8 w-48 skeleton-enhanced' />
            </div>
            <Skeleton className='h-4 w-64 skeleton-enhanced' />
         </div>
         <Skeleton className='h-10 w-32 rounded-lg skeleton-enhanced' />
      </div>
      
      <div className="flex gap-4 mt-6">
          <Skeleton className='h-10 w-full md:w-96 rounded-lg skeleton-enhanced' />
          <Skeleton className='h-10 w-32 rounded-lg skeleton-enhanced' />
      </div>

      <div className='grid gap-4 mt-6'>
         {[1, 2, 3, 4].map((i) => (
             <div key={i} className='rounded-xl border border-border/50 bg-card p-6 shadow-sm space-y-4'>
                 <div className='flex justify-between items-start'>
                     <div className="flex gap-4">
                        <Skeleton className='h-10 w-10 rounded-full skeleton-enhanced' />
                        <div className="space-y-1">
                           <Skeleton className='h-5 w-40 skeleton-enhanced' />
                           <Skeleton className='h-3 w-24 skeleton-enhanced' />
                        </div>
                     </div>
                     <Skeleton className='h-6 w-20 rounded-full skeleton-enhanced' />
                 </div>
                 
                 <div className="pl-14 space-y-3">
                     <Skeleton className='h-4 w-full max-w-2xl skeleton-enhanced' />
                     <Skeleton className='h-4 w-3/4 max-w-xl skeleton-enhanced' />
                     
                     <div className="bg-muted/30 p-4 rounded-lg mt-3 border border-border/30">
                        <div className="flex gap-2 mb-2">
                           <Skeleton className='h-4 w-4 rounded-full skeleton-enhanced' />
                           <Skeleton className='h-4 w-24 skeleton-enhanced' />
                        </div>
                        <Skeleton className='h-4 w-full skeleton-enhanced' />
                     </div>
                 </div>

                 <div className="pl-14 flex gap-3 pt-2">
                     <Skeleton className='h-9 w-24 rounded-md skeleton-enhanced' />
                     <Skeleton className='h-9 w-24 rounded-md skeleton-enhanced' />
                     <Skeleton className='h-9 w-24 rounded-md ml-auto skeleton-enhanced' />
                 </div>
             </div>
         ))}
      </div>
    </div>
  );
}
