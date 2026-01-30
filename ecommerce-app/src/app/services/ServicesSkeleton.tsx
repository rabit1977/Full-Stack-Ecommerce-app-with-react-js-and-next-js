// app/services/ServicesSkeleton.tsx
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const ServicesSkeleton = () => {
  return (
    <div className='container mx-auto px-4 py-12 sm:px-6 lg:px-8 max-w-6xl'>
      {/* Header Section Skeleton */}
      <section className='text-center mb-12'>
        <Skeleton className='h-10 w-64 mx-auto mb-4' />
        <Skeleton className='h-6 w-full max-w-2xl mx-auto' />
        <Skeleton className='h-6 w-3/4 max-w-xl mx-auto mt-2' />
      </section>

      {/* Services Grid Skeleton */}
      <section className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12'>
        {[...Array(4)].map((_, index) => (
          <Card
            key={index}
            className='p-6 sm:p-8 bg-card border border-border/50 shadow-sm rounded-xl'
          >
            <CardHeader className='flex flex-col items-center mb-4'>
              <Skeleton className='h-10 w-10 rounded-full mb-2' />
            </CardHeader>
            <CardTitle className='mb-2'>
              <Skeleton className='h-6 w-full' />
            </CardTitle>
            <CardDescription>
              <div className='space-y-2'>
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-4 w-3/4' />
              </div>
            </CardDescription>
            <CardContent></CardContent>
          </Card>
        ))}
      </section>

      {/* Contact Section Skeleton */}
      <section className='text-center'>
        <Skeleton className='h-8 w-48 mx-auto mb-4' />
        <Skeleton className='h-6 w-96 mx-auto mb-2' />
        <Skeleton className='h-6 w-80 mx-auto mb-6' />
        <Skeleton className='h-12 w-40 mx-auto' />
      </section>
    </div>
  );
};