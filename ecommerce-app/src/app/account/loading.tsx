import { Skeleton } from '@/components/ui/skeleton';

export default function AccountLoading() {
  return (
    <div className='min-h-screen bg-slate-50 dark:bg-slate-950/50'>
      <div className='container-wide py-10 sm:py-16'>
        {/* Profile Header Skeleton */}
        <div className='mb-10 sm:mb-16 rounded-3xl p-8 sm:p-12 relative overflow-hidden border border-border bg-card'>
           <div className='flex flex-col sm:flex-row items-center sm:items-start gap-8'>
             {/* Avatar */}
             <Skeleton className='w-28 h-28 sm:w-32 sm:h-32 rounded-3xl flex-shrink-0' />
             
             {/* User Info */}
             <div className='flex-1 text-center sm:text-left space-y-4 w-full'>
               <div className='space-y-3'>
                 <Skeleton className='h-10 sm:h-12 w-64 mx-auto sm:mx-0 rounded-xl' />
                 <div className='flex flex-wrap items-center justify-center sm:justify-start gap-3'>
                   <Skeleton className='h-8 w-48 rounded-full' />
                   <Skeleton className='h-8 w-40 rounded-full' />
                 </div>
               </div>
               
               <div className='flex justify-center sm:justify-start gap-3 pt-2'>
                  <Skeleton className='h-8 w-24 rounded-full' />
                  <Skeleton className='h-8 w-32 rounded-full' />
               </div>
             </div>
             
             {/* Edit Button */}
             <div className='hidden sm:block shrink-0'>
                <Skeleton className='h-12 w-32 rounded-xl' />
             </div>
           </div>
        </div>

        {/* Main Content Grid */}
        <div className='grid lg:grid-cols-12 gap-8'>
          {/* Left Column */}
          <div className='lg:col-span-8 space-y-8'>
            {/* Account Stats Skeleton */}
            <div className='grid grid-cols-2 sm:grid-cols-4 gap-4 p-1'>
               {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className='h-24 w-full rounded-2xl' />
               ))}
            </div>

            {/* Account Info Card Skeleton */}
            <div className='bg-card border border-border rounded-3xl p-8 space-y-8'>
               <Skeleton className='h-8 w-56' />
               <div className='grid sm:grid-cols-2 gap-x-12 gap-y-8'>
                  {[1, 2, 3, 4].map((i) => (
                     <div key={i} className='space-y-2'>
                        <Skeleton className='h-4 w-24' />
                        <Skeleton className='h-12 w-full rounded-2xl' />
                     </div>
                  ))}
               </div>
            </div>
          </div>

          {/* Right Column */}
          <div className='lg:col-span-4 space-y-8'>
             {/* Quick Actions Skeleton */}
             <div className='bg-card border border-border rounded-3xl p-6 space-y-6'>
                <Skeleton className='h-7 w-40' />
                <div className='space-y-3'>
                   {[1, 2, 3, 4, 5].map((i) => (
                      <Skeleton key={i} className='h-16 w-full rounded-2xl' />
                   ))}
                </div>
             </div>

             {/* Summary Card Skeleton */}
             <Skeleton className='h-64 w-full rounded-3xl' />
          </div>
        </div>
      </div>
    </div>
  );
}
