// app/contact/ContactSkeleton.tsx
import { Skeleton } from '@/components/ui/skeleton';

export const ContactSkeleton = () => {
  return (
    <div className='container mx-auto px-4 py-12 sm:py-16 lg:py-20 space-y-6 lg:space-y-8 max-w-6xl'>
      {/* Page Header Skeleton */}
      <div className='text-center mb-12 sm:mb-16'>
        <Skeleton className='h-12 w-64 mx-auto mb-4' />
        <Skeleton className='h-6 w-96 mx-auto' />
      </div>

      <div className='grid md:grid-cols-2 gap-8 lg:gap-12'>
        {/* Contact Form Skeleton */}
        <div className='rounded-xl border bg-white p-6 sm:p-8 shadow-lg dark:bg-slate-900 dark:border-slate-800 space-y-6'>
          <Skeleton className='h-8 w-48 mb-6' />
          
          <div className='space-y-8'>
            {/* Name Field */}
            <div className='space-y-2'>
              <Skeleton className='h-5 w-16' />
              <Skeleton className='h-10 w-full' />
            </div>

            {/* Email Field */}
            <div className='space-y-2'>
              <Skeleton className='h-5 w-16' />
              <Skeleton className='h-10 w-full' />
            </div>

            {/* Subject Field */}
            <div className='space-y-2'>
              <Skeleton className='h-5 w-20' />
              <Skeleton className='h-10 w-full' />
            </div>

            {/* Message Field */}
            <div className='space-y-2'>
              <Skeleton className='h-5 w-20' />
              <Skeleton className='h-32 w-full' />
            </div>

            {/* Submit Button */}
            <Skeleton className='h-12 w-full' />
          </div>
        </div>

        {/* Contact Information Skeleton */}
        <div className='space-y-6 lg:space-y-8'>
          {/* Location Card Skeleton */}
          <div className='rounded-xl border bg-white p-6 shadow-lg dark:bg-slate-900 dark:border-slate-800'>
            <Skeleton className='h-8 w-40 mb-6' />
            <div className='space-y-4'>
              {[...Array(3)].map((_, i) => (
                <div key={i} className='flex gap-4'>
                  <Skeleton className='flex-shrink-0 w-8 h-8 rounded-full' />
                  <div className='flex-1 space-y-2'>
                    <Skeleton className='h-5 w-24' />
                    <Skeleton className='h-4 w-full' />
                    <Skeleton className='h-4 w-3/4' />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Business Hours Card Skeleton */}
          <div className='rounded-xl border bg-white p-6 shadow-lg dark:bg-slate-900 dark:border-slate-800'>
            <div className='flex items-center gap-3 mb-6'>
              <Skeleton className='w-8 h-8 rounded-full' />
              <Skeleton className='h-8 w-40' />
            </div>
            <div className='space-y-2'>
              {[...Array(3)].map((_, i) => (
                <div key={i} className='flex justify-between items-center py-2'>
                  <Skeleton className='h-4 w-32' />
                  <Skeleton className='h-4 w-28' />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Map Skeleton */}
      <Skeleton className='rounded-xl w-full h-64 sm:h-80' />
    </div>
  );
};