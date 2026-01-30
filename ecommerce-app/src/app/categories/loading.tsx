import { Skeleton } from '@/components/ui/skeleton';

export default function CategoriesLoading() {
  return (
    <div className='page-wrapper'>
      <div className='container-wide py-12 sm:py-16 lg:py-20'>
        {/* Header Skeleton */}
        <div className='text-center mb-12 space-y-4'>
           <Skeleton className='h-10 sm:h-12 w-64 mx-auto rounded-xl' />
           <Skeleton className='h-6 w-96 mx-auto rounded-lg' />
        </div>

        {/* Categories Grid Skeleton */}
        <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6'>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
             <div key={i} className='rounded-2xl aspect-square overflow-hidden relative'>
                <Skeleton className='h-full w-full' />
                <div className='absolute inset-0 flex flex-col items-center justify-center p-4 space-y-3'>
                   <Skeleton className='h-16 w-16 rounded-2xl bg-white/20' />
                   <Skeleton className='h-6 w-32 bg-white/20' />
                   <Skeleton className='h-4 w-20 bg-white/20' />
                </div>
             </div>
          ))}
        </div>
        
        {/* Footer Link Skeleton */}
        <div className='flex justify-center mt-12'>
           <Skeleton className='h-6 w-40' />
        </div>
      </div>
    </div>
  );
}
