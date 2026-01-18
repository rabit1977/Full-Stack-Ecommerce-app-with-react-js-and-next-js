import { Skeleton } from '@/components/ui/skeleton';

export function CartSkeleton() {
  return (
    <div className='space-y-8'>
      <Skeleton className='h-8 w-48' />
      <div className='grid lg:grid-cols-3 gap-8'>
        <div className='lg:col-span-2 space-y-4'>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className='h-32 w-full' />
          ))}
        </div>
        <Skeleton className='h-96' />
      </div>
    </div>
  );
}
