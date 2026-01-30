// app/contact/ContactSkeleton.tsx
import { Skeleton } from '@/components/ui/skeleton';

export const ContactSkeleton = () => {
  return (
    <div className='container-wide py-12 sm:py-20 lg:py-28 space-y-6 lg:space-y-8'>
      {/* Page Header Skeleton */}
      <div className='text-center mb-16 sm:mb-24 space-y-4'>
        <Skeleton className='h-12 sm:h-16 w-64 sm:w-96 mx-auto rounded-xl' />
        <Skeleton className='h-6 w-96 mx-auto rounded-lg' />
      </div>

      <div className='grid lg:grid-cols-12 gap-8 lg:gap-16 items-start'>
        {/* Contact Form Skeleton (7 cols) */}
        <div className='lg:col-span-7 rounded-3xl border border-border/50 bg-card p-8 sm:p-12 shadow-2xl relative overflow-hidden space-y-8'>
          <Skeleton className='h-8 w-48 rounded-lg' />
          
          <div className='space-y-6'>
            {/* Name & Email */}
            <div className='grid sm:grid-cols-2 gap-6'>
               <div className='space-y-2'>
                  <Skeleton className='h-5 w-16' />
                  <Skeleton className='h-12 w-full rounded-xl' />
               </div>
               <div className='space-y-2'>
                  <Skeleton className='h-5 w-16' />
                  <Skeleton className='h-12 w-full rounded-xl' />
               </div>
            </div>

            {/* Subject */}
            <div className='space-y-2'>
              <Skeleton className='h-5 w-20' />
              <Skeleton className='h-12 w-full rounded-xl' />
            </div>

            {/* Message */}
            <div className='space-y-2'>
              <Skeleton className='h-5 w-20' />
              <Skeleton className='h-40 w-full rounded-xl' />
            </div>

            {/* Submit Button */}
            <Skeleton className='h-14 w-40 rounded-xl' />
          </div>
        </div>

        {/* Contact Info Skeleton (5 cols) */}
        <div className='lg:col-span-5 space-y-8'>
          {/* Info Cards */}
          <div className='grid gap-6'>
            {[...Array(4)].map((_, i) => (
              <div key={i} className='flex gap-4 p-6 rounded-2xl bg-card border border-border/50'>
                <Skeleton className='flex-shrink-0 w-12 h-12 rounded-xl' />
                <div className='flex-1 space-y-2'>
                  <Skeleton className='h-6 w-32' />
                  <Skeleton className='h-4 w-48' />
                </div>
              </div>
            ))}
          </div>

          {/* Map Skeleton */}
          <Skeleton className='rounded-3xl w-full h-64 sm:h-80 shadow-xl' />
        </div>
      </div>
    </div>
  );
};