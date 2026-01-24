'use client';

import { motion } from 'framer-motion';

/**
 * Home Page Loading Skeleton
 * 
 * Premium loading state with animated gradients and placeholders
 */
export default function HomeLoading() {
  return (
    <div className='bg-slate-50 dark:bg-slate-900 min-h-screen'>
      {/* Hero Section Skeleton */}
      <section className='relative container-wide py-16 sm:py-20 lg:py-28 text-center overflow-hidden'>
        {/* Background Effects */}
        <div className='absolute inset-0 -z-10'>
          <div className='absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse' />
          <div className='absolute bottom-20 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse' />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className='space-y-8'
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className='inline-block h-8 w-48 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse' />
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className='space-y-4 max-w-4xl mx-auto'
          >
            <div className='h-12 sm:h-16 lg:h-20 w-3/4 mx-auto bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse' />
            <div className='h-12 sm:h-16 lg:h-20 w-2/3 mx-auto bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 rounded-xl shimmer' />
          </motion.div>

          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className='max-w-2xl mx-auto space-y-2'
          >
            <div className='h-5 w-full bg-slate-200 dark:bg-slate-700 rounded animate-pulse' />
            <div className='h-5 w-4/5 mx-auto bg-slate-200 dark:bg-slate-700 rounded animate-pulse' />
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className='flex justify-center gap-4 pt-4'
          >
            <div className='h-12 w-36 bg-primary/30 rounded-lg animate-pulse' />
            <div className='h-12 w-36 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse' />
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className='pt-8 flex justify-center gap-10'
          >
            {[1, 2, 3].map((i) => (
              <div key={i} className='flex items-center gap-2'>
                <div className='w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600 animate-pulse' />
                <div className='h-4 w-20 bg-slate-200 dark:bg-slate-700 rounded animate-pulse' />
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Product Carousel Skeleton */}
      <section className='container-wide py-8'>
        <div className='relative'>
          <div className='flex gap-4 overflow-hidden'>
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className='flex-shrink-0 w-full sm:w-1/2 lg:w-1/3'
              >
                <div className='aspect-[4/3] bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 rounded-2xl shimmer' />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section Skeleton */}
      <section className='container-wide py-12'>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className='text-center mb-12'
        >
          <div className='h-10 w-64 mx-auto bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse mb-4' />
          <div className='h-5 w-48 mx-auto bg-slate-200 dark:bg-slate-700 rounded animate-pulse' />
        </motion.div>

        {/* Products Grid */}
        <div className='grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + i * 0.05 }}
              className='flex flex-col rounded-xl border bg-card overflow-hidden'
            >
              <div className='aspect-square bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-700 shimmer' />
              <div className='p-4 space-y-3'>
                <div className='h-3 w-16 bg-slate-200 dark:bg-slate-700 rounded animate-pulse' />
                <div className='h-5 w-full bg-slate-200 dark:bg-slate-700 rounded animate-pulse' />
                <div className='flex justify-between'>
                  <div className='h-6 w-20 bg-slate-200 dark:bg-slate-700 rounded animate-pulse' />
                  <div className='h-4 w-16 bg-slate-200 dark:bg-slate-700 rounded animate-pulse' />
                </div>
                <div className='h-10 w-full bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse' />
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
