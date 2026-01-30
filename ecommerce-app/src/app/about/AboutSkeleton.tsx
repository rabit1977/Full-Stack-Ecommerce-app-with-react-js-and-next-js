// app/about/AboutSkeleton.tsx
import { Skeleton } from '@/components/ui/skeleton';

export const AboutSkeleton = () => {
  return (
    <div className='space-y-8'>
      {/* Story Section Skeleton */}
      <section className='grid lg:grid-cols-2 gap-8 lg:gap-12 items-center'>
        <div className='space-y-6'>
          {/* Title Skeleton */}
          <Skeleton className='h-12 w-48' />
          
          {/* Paragraph Skeletons */}
          <div className='space-y-4'>
            <div className='space-y-2'>
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-4 w-5/6' />
            </div>
            <div className='space-y-2'>
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-4 w-4/6' />
            </div>
          </div>
        </div>

        {/* Image Skeleton */}
        <Skeleton className='h-64 sm:h-80 lg:h-full lg:min-h-[400px] rounded-2xl' />
      </section>

      {/* Values Section Skeleton */}
      <section className='mt-16 sm:mt-20 lg:mt-24'>
        <div className='text-center mb-12'>
          <Skeleton className='h-10 w-48 mx-auto mb-4' />
          <Skeleton className='h-6 w-96 mx-auto' />
        </div>

        <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8'>
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className='p-6 sm:p-8 rounded-xl border border-border/50 bg-card shadow-sm'
            >
              <Skeleton className='w-16 h-16 mx-auto rounded-full mb-6' />
              <Skeleton className='h-6 w-32 mx-auto mb-3' />
              <div className='space-y-2'>
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-4 w-5/6 mx-auto' />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section Skeleton */}
      <section className='mt-16 sm:mt-20 lg:mt-24'>
        <div className='text-center mb-12'>
          <Skeleton className='h-10 w-56 mx-auto mb-4' />
          <Skeleton className='h-6 w-80 mx-auto' />
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'>
          {[...Array(4)].map((_, i) => (
            <div key={i} className='rounded-2xl border border-border/50 bg-card overflow-hidden'>
               <Skeleton className='aspect-[3/4] w-full' />
               <div className='p-4 space-y-2'>
                  <Skeleton className='h-6 w-32' />
                  <Skeleton className='h-4 w-24' />
               </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};