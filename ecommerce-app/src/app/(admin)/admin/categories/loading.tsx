import { Skeleton } from '@/components/ui/skeleton';

export default function AdminCategoriesLoading() {
  return (
    <div className='flex-1 space-y-4 p-8 pt-6'>
      <div className='flex items-center justify-between'>
         <div className="space-y-2">
            <Skeleton className='h-8 w-48 skeleton-enhanced' />
            <Skeleton className='h-4 w-64 skeleton-enhanced' />
         </div>
         <Skeleton className='h-10 w-32 rounded-lg skeleton-enhanced' />
      </div>
      
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6'>
         {[1, 2, 3, 4, 5, 6].map((i) => (
             <div key={i} className='rounded-xl border border-border/50 bg-card p-6 shadow-sm h-[200px] flex flex-col justify-between'>
                 <div className='space-y-4'>
                     <div className='flex items-start justify-between'>
                        <Skeleton className='h-12 w-12 rounded-lg skeleton-enhanced' />
                        <Skeleton className='h-6 w-6 rounded-full skeleton-enhanced' />
                     </div>
                     <div className='space-y-2'>
                        <Skeleton className='h-6 w-32 skeleton-enhanced' />
                        <Skeleton className='h-4 w-full skeleton-enhanced' />
                     </div>
                 </div>
                 <div className='flex gap-2 pt-4 border-t border-border/40'>
                     <Skeleton className='h-8 w-full rounded-md skeleton-enhanced' />
                     <Skeleton className='h-8 w-full rounded-md skeleton-enhanced' />
                 </div>
             </div>
         ))}
      </div>
    </div>
  );
}
