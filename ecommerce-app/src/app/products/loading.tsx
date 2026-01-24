'use client';

import { motion } from 'framer-motion';
import { Package } from 'lucide-react';

/**
 * Premium Loading Component for Products Page
 * 
 * Features:
 * - Enhanced skeleton loaders with shimmer effect
 * - Consistent design with the new theme
 * - Responsive grid layout
 */
export default function ProductsLoading() {
  return (
    <div className='min-h-screen gradient-hero'>
      <div className='container-wide py-8 sm:py-12 lg:py-16'>
        {/* Header Skeleton */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className='mb-8'
        >
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
            <div className='space-y-2'>
              <div className='h-10 w-56 skeleton-enhanced rounded-xl' />
              <div className='h-5 w-36 skeleton-enhanced rounded-lg' />
            </div>
            <div className='flex gap-3'>
              <div className='h-11 w-32 skeleton-enhanced rounded-xl' />
              <div className='h-11 w-40 skeleton-enhanced rounded-xl' />
            </div>
          </div>
        </motion.div>

        <div className='lg:grid lg:grid-cols-4 lg:gap-8 xl:gap-12'>
          {/* Filter Sidebar Skeleton */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className='hidden lg:block lg:col-span-1 sticky top-24 self-start'
          >
            <div className='rounded-2xl border border-border/50 bg-card p-6 shadow-sm space-y-6'>
              {/* Categories */}
              <div className='space-y-4'>
                <div className='h-5 w-24 skeleton-enhanced rounded' />
                {[1, 2, 3, 4, 5].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.15 + i * 0.05 }}
                    className='flex items-center gap-3'
                  >
                    <div className='h-5 w-5 skeleton-enhanced rounded' />
                    <div className='h-4 w-24 skeleton-enhanced rounded' />
                  </motion.div>
                ))}
              </div>

              {/* Brands */}
              <div className='space-y-4 pt-6 border-t border-border/50'>
                <div className='h-5 w-20 skeleton-enhanced rounded' />
                {[1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    className='flex items-center gap-3'
                  >
                    <div className='h-5 w-5 skeleton-enhanced rounded' />
                    <div className='h-4 w-20 skeleton-enhanced rounded' />
                  </motion.div>
                ))}
              </div>

              {/* Price Range */}
              <div className='space-y-4 pt-6 border-t border-border/50'>
                <div className='h-5 w-28 skeleton-enhanced rounded' />
                <div className='h-2 w-full skeleton-enhanced rounded-full' />
                <div className='flex justify-between'>
                  <div className='h-4 w-14 skeleton-enhanced rounded' />
                  <div className='h-4 w-14 skeleton-enhanced rounded' />
                </div>
              </div>

              {/* Clear Filters Button */}
              <div className='pt-4'>
                <div className='h-10 w-full skeleton-enhanced rounded-xl' />
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
                  transition={{ duration: 0.3, delay: 0.1 + i * 0.04 }}
                  className='group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-border/50 bg-card shadow-sm'
                >
                  {/* Image Skeleton */}
                  <div className='relative aspect-square h-64 w-full overflow-hidden bg-muted'>
                    <div className='skeleton-enhanced h-full w-full' />
                    <div className='absolute inset-0 flex items-center justify-center'>
                      <Package className='h-10 w-10 text-muted-foreground/20' />
                    </div>
                  </div>

                  {/* Content Skeleton */}
                  <div className='flex flex-1 flex-col p-5 space-y-4'>
                    {/* Brand & Rating */}
                    <div className='flex items-center justify-between'>
                      <div className='h-3 w-16 skeleton-enhanced rounded' />
                      <div className='h-3 w-12 skeleton-enhanced rounded' />
                    </div>
                    
                    {/* Title */}
                    <div className='space-y-2'>
                      <div className='h-5 w-full skeleton-enhanced rounded' />
                      <div className='h-5 w-3/4 skeleton-enhanced rounded' />
                    </div>
                    
                    {/* Price */}
                    <div className='flex items-end justify-between pt-1'>
                      <div className='space-y-1'>
                        <div className='h-6 w-24 skeleton-enhanced rounded' />
                        <div className='h-3 w-16 skeleton-enhanced rounded' />
                      </div>
                    </div>
                    
                    <div className='flex-1' />
                    
                    {/* Button */}
                    <div className='h-11 w-full skeleton-enhanced rounded-xl' />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination Skeleton */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className='flex justify-center mt-10 gap-2'
            >
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className='h-10 w-10 skeleton-enhanced rounded-xl'
                />
              ))}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
}
