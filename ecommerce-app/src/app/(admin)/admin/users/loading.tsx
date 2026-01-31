import { Skeleton } from '@/components/ui/skeleton';

export default function AdminUsersLoading() {
  return (
    <div className='space-y-6 sm:space-y-8 pb-20'>
      {/* Header Skeleton */}
      <div className='flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between'>
        <div className='space-y-2'>
          <Skeleton className='h-10 w-48 sm:w-64 rounded-lg skeleton-enhanced' />
          <Skeleton className='h-5 w-32 sm:w-48 rounded-md skeleton-enhanced' />
        </div>
        
        <Skeleton className='h-12 w-40 rounded-full skeleton-enhanced' />
      </div>

      {/* Stats Cards Skeleton */}
      <div className='grid gap-5 md:grid-cols-3'>
        {[1, 2, 3].map((i) => (
            <div key={i} className='glass-card p-6 rounded-3xl flex flex-col justify-between border border-border/50 h-40'>
                <div className='flex justify-between items-start mb-2'>
                    <Skeleton className='h-12 w-12 rounded-2xl skeleton-enhanced' />
                </div>
                <div>
                   <Skeleton className='h-9 w-16 mb-2 skeleton-enhanced' />
                   <Skeleton className='h-4 w-24 skeleton-enhanced' />
                </div>
            </div>
        ))}
      </div>

      {/* Users Table Skeleton */}
      <div className='glass-card rounded-[2.5rem] overflow-hidden shadow-xl shadow-black/5 border border-border/60'>
         {/* Table Header */}
         <div className="p-8 border-b border-border/50 bg-secondary/5 flex items-center justify-between">
            <Skeleton className='h-8 w-48 skeleton-enhanced' />
         </div>

         <div className='p-8 pt-0 space-y-6'>
            {/* Search/Filter Bar */}
            <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
                 <Skeleton className="h-10 w-full sm:w-72 rounded-lg skeleton-enhanced" />
                 <Skeleton className="h-10 w-32 rounded-lg skeleton-enhanced" />
            </div>

            {/* Table Rows */}
            <div className="space-y-4 rounded-xl border border-border/40 overflow-hidden">
               {/* Header Row */}
               <div className="hidden sm:grid grid-cols-4 gap-4 p-4 bg-muted/30 border-b border-border/40">
                  <Skeleton className="h-4 w-24 skeleton-enhanced" />
                  <Skeleton className="h-4 w-32 skeleton-enhanced" />
                  <Skeleton className="h-4 w-20 skeleton-enhanced" />
                  <Skeleton className="h-4 w-16 ml-auto skeleton-enhanced" />
               </div>

               {/* Data Rows */}
               {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex flex-col sm:grid sm:grid-cols-4 gap-4 p-4 items-center border-b border-border/40 last:border-0 hover:bg-muted/10">
                     <div className="flex items-center gap-3 w-full sm:w-auto">
                        <Skeleton className="h-10 w-10 rounded-full skeleton-enhanced" />
                        <div className="space-y-1">
                           <Skeleton className="h-4 w-24 skeleton-enhanced" />
                           <Skeleton className="h-3 w-32 sm:hidden skeleton-enhanced" />
                        </div>
                     </div>
                     <Skeleton className="h-4 w-40 w-full sm:w-auto hidden sm:block skeleton-enhanced" />
                     <Skeleton className="h-6 w-20 rounded-full w-full sm:w-auto skeleton-enhanced" />
                     <Skeleton className="h-8 w-8 ml-auto rounded-md skeleton-enhanced hidden sm:block" />
                  </div>
               ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center pt-2">
               <Skeleton className="h-4 w-32 rounded skeleton-enhanced hidden sm:block" />
               <div className="flex gap-2 mx-auto sm:mx-0">
                  <Skeleton className="h-9 w-20 rounded-md skeleton-enhanced" />
                  <Skeleton className="h-9 w-20 rounded-md skeleton-enhanced" />
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
