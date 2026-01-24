'use client';

import { motion } from 'framer-motion';

/**
 * Home Page Loading Skeleton
 * 
 * Premium loading state with animated gradients and shimmer effects
 */
export default function HomeLoading() {
  return (
    <div className='min-h-screen gradient-hero'>
      {/* Hero Section Skeleton */}
      <section className='relative container-wide py-20 sm:py-28 lg:py-36 text-center overflow-hidden'>
        {/* Background Effects */}
        <div className='absolute inset-0 -z-10'>
          <div className='hero-orb hero-orb-primary w-[400px] h-[400px] top-[-5%] left-[-5%]' />
          <div className='hero-orb hero-orb-accent w-[500px] h-[500px] bottom-[-10%] right-[-10%]' />
        </div>

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
          >
            <div className='inline-block h-10 w-52 skeleton-enhanced rounded-full' />
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
            <div className='h-14 w-44 bg-primary/20 rounded-2xl animate-pulse' />
            <div className='h-14 w-44 skeleton-enhanced rounded-2xl' />
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
              className='flex flex-col rounded-2xl border border-border/50 bg-card overflow-hidden'
            >
              {/* Image */}
              <div className='aspect-square bg-muted skeleton-enhanced' />
              
              {/* Content */}
              <div className='p-5 space-y-4'>
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
                
                {/* Button */}
                <div className='h-11 w-full skeleton-enhanced rounded-xl mt-2' />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Categories Section Skeleton */}
      <section className='container-wide py-16'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className='text-center mb-12'
        >
          <div className='h-10 w-64 mx-auto skeleton-enhanced rounded-xl mb-4' />
          <div className='h-5 w-48 mx-auto skeleton-enhanced rounded-lg' />
        </motion.div>

        <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
          {[1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.3 + i * 0.08 }}
              className='aspect-[4/3] skeleton-enhanced rounded-2xl'
            />
          ))}
        </div>
      </section>
    </div>
  );
}
