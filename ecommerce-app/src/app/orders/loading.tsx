import { Skeleton } from '@/components/ui/skeleton';

export default function OrdersLoading() {
  return (
    <div className='min-h-screen relative overflow-hidden pb-20'>
      {/* Background Pattern - Matching Admin/Account Layout */}
      <div className='fixed inset-0 -z-10 bg-gradient-to-br from-muted/30 via-background to-muted/20 dark:from-background dark:via-background dark:to-muted/10' />
      <div className='fixed inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.05),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.1),transparent)]' />

      <div className='container-wide py-10 sm:py-16 relative z-10'>
        {/* Header Skeleton */}
        <div className='mb-12'>
          <Skeleton className='h-10 w-32 rounded-full mb-8' />
          
          <div className='flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6'>
            <div className="space-y-3">
              <Skeleton className='h-10 sm:h-12 w-64 rounded-2xl' />
              <Skeleton className='h-6 w-96 rounded-lg' />
            </div>
            <Skeleton className='h-11 w-40 rounded-xl' />
          </div>
        </div>

        {/* Statistics Cards Skeleton */}
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12'>
          {[1, 2, 3, 4].map((i) => (
             <div key={i} className='glass-card p-6 rounded-[2rem] h-32 flex flex-col justify-between border-border/60 shadow-xl shadow-black/5'>
               <div className='flex justify-between items-start'>
                  <Skeleton className='h-4 w-24 rounded-full' />
                  <Skeleton className='h-12 w-12 rounded-2xl' />
               </div>
               <Skeleton className='h-10 w-32 rounded-xl' />
             </div>
          ))}
        </div>

        {/* Orders List Skeleton */}
        <div className='glass-card rounded-[2.5rem] overflow-hidden border border-border/60 shadow-xl shadow-black/5'>
          {/* Header */}
          <div className='p-8 border-b border-border/50 flex items-center justify-between bg-muted/20'>
            <Skeleton className='h-10 w-48 rounded-xl' />
            <Skeleton className='h-7 w-20 rounded-full' />
          </div>
          
          <div className='p-8 space-y-4'>
             {/* Simulating List Items */}
             {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className='p-6 rounded-2xl bg-muted/30 border border-border/50 flex flex-wrap items-center gap-6'>
                   <Skeleton className='h-6 w-24 rounded-full' />
                   <Skeleton className='h-6 w-32 rounded-full' />
                   <Skeleton className='h-8 w-24 rounded-full' />
                   <Skeleton className='h-6 w-16 rounded-full' />
                   <Skeleton className='h-6 w-24 rounded-full ml-auto' />
                   <Skeleton className='h-11 w-32 rounded-xl' />
                </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}
