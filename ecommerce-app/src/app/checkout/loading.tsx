import { Skeleton } from '@/components/ui/skeleton';

export default function CheckoutLoading() {
  return (
    <div className='min-h-screen bg-slate-50 dark:bg-slate-950/50 page-wrapper'>
      <div className='container-wide py-8 sm:py-12 lg:py-16'>
        {/* Header/Steps Skeleton */}
        <div className='mb-8 sm:mb-12'>
          <div className='flex justify-center mb-8'>
             <Skeleton className='h-10 w-64 rounded-xl' />
          </div>
          <div className='flex justify-between max-w-2xl mx-auto'>
             {[1, 2, 3].map((i) => (
                <div key={i} className='flex flex-col items-center gap-2'>
                   <Skeleton className='h-8 w-8 rounded-full' />
                   <Skeleton className='h-4 w-16' />
                </div>
             ))}
          </div>
        </div>

        <div className='lg:grid lg:grid-cols-12 lg:gap-12'>
          {/* Main Checkout Flow */}
          <div className='lg:col-span-8 space-y-6'>
            {/* Address Section */}
            <div className='bg-card border border-border rounded-2xl p-6 space-y-6'>
               <div className='flex justify-between items-center'>
                  <Skeleton className='h-6 w-32' />
                  <Skeleton className='h-8 w-24 rounded-lg' />
               </div>
               
               <div className='grid sm:grid-cols-2 gap-4'>
                  {[1, 2].map((i) => (
                     <div key={i} className='p-4 border rounded-xl space-y-3'>
                        <div className='flex items-center gap-3'>
                           <Skeleton className='h-5 w-5 rounded-full' />
                           <Skeleton className='h-5 w-32' />
                        </div>
                        <div className='pl-8 space-y-2'>
                           <Skeleton className='h-4 w-full' />
                           <Skeleton className='h-4 w-2/3' />
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            {/* Payment Section */}
            <div className='bg-card border border-border rounded-2xl p-6 space-y-6'>
               <Skeleton className='h-6 w-32' />
               <Skeleton className='h-12 w-full rounded-xl' />
               <div className='grid grid-cols-2 gap-4'>
                  <Skeleton className='h-12 w-full rounded-xl' />
                  <Skeleton className='h-12 w-full rounded-xl' />
               </div>
               <Skeleton className='h-12 w-full rounded-xl' />
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className='lg:col-span-4 mt-8 lg:mt-0'>
            <div className='bg-card border border-border rounded-2xl p-6 space-y-6 sticky top-24'>
              <Skeleton className='h-6 w-32' />
              
              <div className='space-y-4 max-h-60 overflow-hidden'>
                 {[1, 2].map((i) => (
                    <div key={i} className='flex gap-3'>
                       <Skeleton className='h-16 w-16 rounded-lg flex-shrink-0' />
                       <div className='flex-1 space-y-2 py-1'>
                          <Skeleton className='h-4 w-3/4' />
                          <div className='flex justify-between'>
                             <Skeleton className='h-3 w-12' />
                             <Skeleton className='h-4 w-16' />
                          </div>
                       </div>
                    </div>
                 ))}
              </div>

              <div className='h-px w-full bg-border' />
              
              <div className='space-y-3'>
                 <div className='flex justify-between'>
                    <Skeleton className='h-4 w-20' />
                    <Skeleton className='h-4 w-16' />
                 </div>
                 <div className='flex justify-between'>
                    <Skeleton className='h-4 w-24' />
                    <Skeleton className='h-4 w-16' />
                 </div>
              </div>

              <div className='h-px w-full bg-border' />

              <div className='flex justify-between items-center'>
                 <Skeleton className='h-5 w-16' />
                 <Skeleton className='h-7 w-24' />
              </div>
              
              <Skeleton className='h-12 w-full rounded-xl' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
