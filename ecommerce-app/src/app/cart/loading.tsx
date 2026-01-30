import { Skeleton } from '@/components/ui/skeleton';

export default function CartLoading() {
  return (
    <div className='page-wrapper'>
      <div className='container-wide py-8 sm:py-12 lg:py-16'>
        {/* Header Skeleton */}
        <div className='mb-8'>
          <Skeleton className='h-10 w-48 mb-2' />
          <Skeleton className='h-5 w-32' />
        </div>

        <div className='lg:grid lg:grid-cols-12 lg:gap-12'>
          {/* Cart Items List */}
          <div className='lg:col-span-8 space-y-4'>
            {[1, 2, 3].map((i) => (
              <div key={i} className='p-4 border rounded-2xl flex gap-4 bg-card'>
                {/* Product Image */}
                <Skeleton className='h-24 w-24 rounded-xl flex-shrink-0' />
                
                {/* Product Details */}
                <div className='flex-1 flex flex-col justify-between py-1'>
                   <div className='flex justify-between gap-4'>
                      <div className='space-y-2'>
                        <Skeleton className='h-5 w-48' />
                        <Skeleton className='h-4 w-24' />
                      </div>
                      <Skeleton className='h-5 w-20' />
                   </div>
                   
                   <div className='flex justify-between items-end'>
                      <div className='flex items-center gap-3'>
                        <Skeleton className='h-8 w-24 rounded-lg' />
                        <Skeleton className='h-4 w-16' />
                      </div>
                      <Skeleton className='h-8 w-8 rounded-lg' />
                   </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className='lg:col-span-4 mt-8 lg:mt-0'>
            <div className='rounded-2xl border border-border bg-card p-6 space-y-6 sticky top-24'>
              <Skeleton className='h-7 w-32' />
              
              <div className='space-y-4 py-4 border-y border-border'>
                <div className='flex justify-between'>
                   <Skeleton className='h-4 w-20' />
                   <Skeleton className='h-4 w-20' />
                </div>
                <div className='flex justify-between'>
                   <Skeleton className='h-4 w-24' />
                   <Skeleton className='h-4 w-16' />
                </div>
                <div className='flex justify-between'>
                   <Skeleton className='h-4 w-28' />
                   <Skeleton className='h-4 w-12' />
                </div>
              </div>
              
              <div className='flex justify-between items-center'>
                 <Skeleton className='h-6 w-16' />
                 <Skeleton className='h-8 w-24' />
              </div>
              
              <Skeleton className='h-12 w-full rounded-xl' />
              <div className='flex justify-center'>
                 <Skeleton className='h-4 w-48' />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
