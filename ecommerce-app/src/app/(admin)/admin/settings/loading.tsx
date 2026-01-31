import { Skeleton } from '@/components/ui/skeleton';

export default function AdminSettingsLoading() {
  return (
    <div className='flex-col space-y-6 animate-in fade-in duration-500'>
      <div className='flex items-center justify-between'>
        <div className='space-y-2'>
          <Skeleton className='h-8 w-48 skeleton-enhanced' />
          <Skeleton className='h-4 w-64 skeleton-enhanced' />
        </div>
      </div>

      <div className='space-y-8'>
         {/* Tabs Skeleton */}
         <div className="w-full h-10 md:h-12 bg-muted/60 rounded-xl grid grid-cols-4 gap-2 p-1">
             {[1, 2, 3, 4].map((i) => (
                 <Skeleton key={i} className="h-full w-full rounded-lg skeleton-enhanced" />
             ))}
         </div>

         {/* Card Skeleton */}
         <div className='rounded-xl border bg-card text-card-foreground shadow space-y-6 p-6'>
            <div className='space-y-2'>
                <Skeleton className='h-6 w-32 skeleton-enhanced' />
                <Skeleton className='h-4 w-48 skeleton-enhanced' />
            </div>
            <div className='space-y-4'>
                <div className='space-y-2'>
                    <Skeleton className='h-4 w-20 skeleton-enhanced' />
                    <Skeleton className='h-10 w-full skeleton-enhanced' />
                </div>
                <div className='grid grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                        <Skeleton className='h-4 w-20 skeleton-enhanced' />
                        <Skeleton className='h-10 w-full skeleton-enhanced' />
                    </div>
                    <div className='space-y-2'>
                        <Skeleton className='h-4 w-20 skeleton-enhanced' />
                        <Skeleton className='h-10 w-full skeleton-enhanced' />
                    </div>
                </div>
                 <div className='grid grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                        <Skeleton className='h-4 w-20 skeleton-enhanced' />
                        <Skeleton className='h-10 w-full skeleton-enhanced' />
                    </div>
                    <div className='space-y-2'>
                        <Skeleton className='h-4 w-20 skeleton-enhanced' />
                        <Skeleton className='h-10 w-full skeleton-enhanced' />
                    </div>
                </div>
            </div>
         </div>
      </div>
    </div>
  );
}
