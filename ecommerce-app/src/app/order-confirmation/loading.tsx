import { Skeleton } from '@/components/ui/skeleton';

export default function OrderConfirmationLoading() {
  return (
    <div className='min-h-screen bg-slate-50 dark:bg-slate-950/50 pb-20'>
      {/* Header Loading State */}
      <div className="bg-primary/5 pb-32 pt-20 px-4 border-b border-primary/10 relative overflow-hidden">
         <div className="container-wide text-center relative z-10">
            <div className='inline-flex mb-8 relative justify-center'>
               <Skeleton className='h-24 w-24 rounded-full' />
            </div>
            <div className="flex flex-col items-center gap-4">
               <Skeleton className='h-12 w-3/4 max-w-md rounded-xl' />
               <Skeleton className='h-6 w-full max-w-lg rounded-lg' />
            </div>
         </div>
      </div>

      <div className="container-wide px-4 -mt-20 relative z-20">
          <div className="grid lg:grid-cols-12 gap-8">
             {/* Main Receipt Card Skeleton */}
             <div className="lg:col-span-8 space-y-8">
                <div className="glass-card p-0 rounded-3xl overflow-hidden border border-border/60">
                   {/* Top Bar */}
                   <div className="p-8 border-b border-border/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-secondary/10">
                      <div className="space-y-2">
                         <Skeleton className="h-4 w-24" />
                         <Skeleton className="h-8 w-40" />
                      </div>
                      <div className="flex gap-3">
                         <Skeleton className="h-9 w-24 rounded-full" />
                         <Skeleton className="h-9 w-24 rounded-full" />
                      </div>
                   </div>
                   
                   {/* Items List */}
                   <div className="p-8 space-y-8">
                      <Skeleton className="h-7 w-48" />
                      
                      <div className="space-y-6">
                         {[1, 2].map((i) => (
                            <div key={i} className="flex gap-4 sm:gap-6 items-center">
                               <Skeleton className="h-20 w-20 rounded-2xl shrink-0" />
                               <div className="flex-1 space-y-2">
                                  <Skeleton className="h-5 w-48" />
                                  <Skeleton className="h-4 w-32" />
                               </div>
                               <Skeleton className="h-6 w-24" />
                            </div>
                         ))}
                      </div>
                      
                      {/* Totals */}
                      <div className="mt-8 pt-8 border-t border-border/50 space-y-4">
                         <div className="flex justify-between">
                            <Skeleton className="h-5 w-24" />
                            <Skeleton className="h-5 w-24" />
                         </div>
                         <div className="flex justify-between">
                            <Skeleton className="h-7 w-32" />
                            <Skeleton className="h-7 w-32" />
                         </div>
                      </div>
                   </div>
                </div>
                
                <div className="flex gap-4">
                   <Skeleton className="h-12 w-full rounded-full" />
                   <Skeleton className="h-12 w-full rounded-full" />
                </div>
             </div>

             {/* Sidebar Skeleton */}
             <div className="lg:col-span-4 space-y-6">
                <div className="glass-card p-6 rounded-3xl space-y-6 border border-border/60">
                   <Skeleton className="h-6 w-40" />
                   <Skeleton className="h-24 w-full rounded-2xl" />
                   <div className="space-y-4">
                      <div>
                         <Skeleton className="h-4 w-16 mb-2" />
                         <Skeleton className="h-6 w-24 rounded-full" />
                      </div>
                      <div>
                         <Skeleton className="h-4 w-16 mb-2" />
                         <Skeleton className="h-5 w-32" />
                      </div>
                   </div>
                </div>
                <Skeleton className="h-32 w-full rounded-3xl" />
             </div>
          </div>
      </div>
    </div>
  );
}
