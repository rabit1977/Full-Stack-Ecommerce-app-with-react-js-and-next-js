'use client';

import { motion } from 'framer-motion';

import { ProductCardSkeleton } from '@/components/ui/product-card-skeleton';

/**
 * Home Page Loading Skeleton
 * Consistent with other loading pages
 */
export default function HomeLoading() {
  return (
    <div className='page-wrapper'>
      {/* Hero Section Skeleton */}
      <section className='relative container-wide py-20 sm:py-28 lg:py-36 text-center'>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className='space-y-8'
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className='flex justify-center'
          >
            <div className='h-10 w-52 skeleton-enhanced rounded-full' />
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className='space-y-4 max-w-4xl mx-auto'
          >
            <div className='h-14 sm:h-20 lg:h-24 w-4/5 mx-auto skeleton-enhanced rounded-2xl' />
            <div className='h-14 sm:h-20 lg:h-24 w-3/5 mx-auto skeleton-enhanced rounded-2xl' />
          </motion.div>

          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className='max-w-2xl mx-auto space-y-3'
          >
            <div className='h-6 w-full skeleton-enhanced rounded-lg' />
            <div className='h-6 w-4/5 mx-auto skeleton-enhanced rounded-lg' />
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className='flex flex-col sm:flex-row justify-center gap-4 pt-6'
          >
            <div className='h-14 w-44 skeleton-enhanced rounded-2xl mx-auto sm:mx-0' />
            <div className='h-14 w-44 skeleton-enhanced rounded-2xl mx-auto sm:mx-0' />
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className='pt-12 flex flex-wrap justify-center gap-8 sm:gap-12'
          >
            {[1, 2, 3].map((i) => (
              <div key={i} className='flex items-center gap-3'>
                <div className='w-10 h-10 skeleton-enhanced rounded-xl' />
                <div className='space-y-1.5'>
                  <div className='h-4 w-24 skeleton-enhanced rounded' />
                  <div className='h-3 w-16 skeleton-enhanced rounded' />
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Featured Products Section Skeleton */}
      <section className='container-wide py-16'>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className='text-center mb-12'
        >
          <div className='h-10 w-72 mx-auto skeleton-enhanced rounded-xl mb-4' />
          <div className='h-5 w-56 mx-auto skeleton-enhanced rounded-lg' />
        </motion.div>

        {/* Products Grid */}
        <div className='grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + i * 0.04 }}
            >
              <ProductCardSkeleton />
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
