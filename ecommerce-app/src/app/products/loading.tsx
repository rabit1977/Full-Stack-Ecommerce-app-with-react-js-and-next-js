'use client';

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

/**
 * Premium Loading Component for Products Page
 * 
 * Features:
 * - Animated skeleton loaders
 * - Subtle gradient shimmer effect
 * - Responsive grid layout matching actual product grid
 */
export default function ProductsLoading() {
  return (
    <div className='bg-slate-50 dark:bg-slate-900 min-h-screen'>
      <div className='container-wide py-8 sm:py-12 lg:py-16'>
        {/* Header Skeleton */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className='mb-8'
        >
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
            <div>
              <div className='h-8 w-48 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 rounded-lg animate-shimmer' />
              <div className='h-4 w-32 mt-2 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 rounded animate-shimmer' />
            </div>
            <div className='h-10 w-40 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 rounded-lg animate-shimmer' />
          </div>
        </motion.div>

        <div className='lg:grid lg:grid-cols-4 lg:gap-8 xl:gap-12'>
          {/* Filter Sidebar Skeleton */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className='hidden lg:block lg:col-span-1 sticky top-4 self-start'
          >
            <div className='rounded-xl border bg-card p-5 shadow-sm space-y-6'>
              {/* Categories */}
              <div className='space-y-3'>
                <div className='h-5 w-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse' />
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className='flex items-center gap-3'>
                    <div className='h-4 w-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse' />
                    <div className='h-4 w-20 bg-slate-200 dark:bg-slate-700 rounded animate-pulse' />
                  </div>
                ))}
              </div>

              {/* Brands */}
              <div className='space-y-3 pt-4 border-t border-slate-200 dark:border-slate-700'>
                <div className='h-5 w-20 bg-slate-200 dark:bg-slate-700 rounded animate-pulse' />
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className='flex items-center gap-3'>
                    <div className='h-4 w-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse' />
                    <div className='h-4 w-16 bg-slate-200 dark:bg-slate-700 rounded animate-pulse' />
                  </div>
                ))}
              </div>

              {/* Price Range */}
              <div className='space-y-3 pt-4 border-t border-slate-200 dark:border-slate-700'>
                <div className='h-5 w-28 bg-slate-200 dark:bg-slate-700 rounded animate-pulse' />
                <div className='h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse' />
                <div className='flex justify-between'>
                  <div className='h-4 w-12 bg-slate-200 dark:bg-slate-700 rounded animate-pulse' />
                  <div className='h-4 w-12 bg-slate-200 dark:bg-slate-700 rounded animate-pulse' />
                </div>
              </div>
            </div>
          </motion.aside>

          {/* Product Grid Skeleton */}
          <main className='lg:col-span-3'>
            <div className='grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6'>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}
                  className='group relative flex h-full w-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm dark:bg-slate-800 dark:border-slate-700'
                >
                  {/* Image Skeleton */}
                  <div className='relative aspect-square h-64 w-full overflow-hidden bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800'>
                    <div className='absolute inset-0 flex items-center justify-center'>
                      <Loader2 className='h-8 w-8 animate-spin text-slate-300 dark:text-slate-600' />
                    </div>
                    {/* Shimmer */}
                    <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer' />
                  </div>

                  {/* Content Skeleton */}
                  <div className='flex flex-1 flex-col p-4 space-y-3'>
                    <div className='h-3 w-16 bg-slate-200 dark:bg-slate-700 rounded animate-pulse' />
                    <div className='h-5 w-full bg-slate-200 dark:bg-slate-700 rounded animate-pulse' />
                    <div className='flex items-center justify-between mt-2'>
                      <div className='h-6 w-20 bg-slate-200 dark:bg-slate-700 rounded animate-pulse' />
                      <div className='h-4 w-16 bg-slate-200 dark:bg-slate-700 rounded animate-pulse' />
                    </div>
                    <div className='flex-1' />
                    <div className='h-10 w-full bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse' />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination Skeleton */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className='flex justify-center mt-8 gap-2'
            >
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className='h-10 w-10 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse'
                />
              ))}
            </motion.div>
          </main>
        </div>
      </div>

      <style jsx global>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite linear;
          background-size: 200% 100%;
        }
      `}</style>
    </div>
  );
}
