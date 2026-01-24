'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion, Variants } from 'framer-motion';
import { ArrowRight, Sparkles, Zap } from 'lucide-react';
import Link from 'next/link';

const fadeInUpVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const scaleInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export const HeroHeader = () => {
  return (
    <div className='relative container-wide py-16 sm:py-20 lg:py-28 text-center overflow-hidden'>
      {/* Background Decoration */}
      <div className='absolute inset-0 -z-10 overflow-hidden'>
        {/* Gradient Orbs */}
        <div className='absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float' />
        <div className='absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float' style={{ animationDelay: '1s' }} />
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/5 via-purple-500/5 to-pink-500/5 rounded-full blur-3xl' />
      </div>

      <motion.div
        initial='hidden'
        animate='visible'
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.15,
              delayChildren: 0.1,
            },
          },
        }}
        className='space-y-8 relative'
      >
        {/* Badge */}
        <motion.div variants={scaleInVariants}>
          <Badge 
            variant='outline' 
            className='inline-flex items-center gap-2 text-sm font-semibold px-5 py-2 border-primary/30 text-primary bg-primary/5 hover:bg-primary/10 transition-colors cursor-default'
          >
            <Sparkles className='h-4 w-4' />
            New Collection 2025
          </Badge>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={fadeInUpVariants}
          className='leading-[1.1] max-w-4xl mx-auto'
        >
          <span className='block'>The Future of Tech,</span>
          <span className='block mt-2 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent'>
            Delivered Today
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={fadeInUpVariants}
          className='mx-auto max-w-2xl text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed'
        >
          Discover cutting-edge electronics and premium gadgets designed to 
          elevate your everyday life. Unbeatable prices, exceptional quality.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={fadeInUpVariants}
          className='flex flex-col sm:flex-row items-center justify-center gap-4 pt-4'
        >
          <Button
            asChild
            size='lg'
            className='group relative overflow-hidden text-base px-8 h-12 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300'
          >
            <Link href='/products'>
              <Zap className='h-5 w-5 mr-2' />
              Shop Now
              <ArrowRight className='h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform' />
              {/* Shine effect */}
              <span className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700' />
            </Link>
          </Button>
          <Button
            asChild
            size='lg'
            variant='outline'
            className='text-base px-8 h-12 border-2 hover:bg-accent/50 transition-all duration-300'
          >
            <Link href='/about'>
              Learn More
            </Link>
          </Button>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          variants={fadeInUpVariants}
          className='pt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-sm text-muted-foreground'
        >
          <div className='flex items-center gap-2'>
            <div className='w-2 h-2 rounded-full bg-green-500 animate-pulse' />
            <span>Free Shipping</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-2 h-2 rounded-full bg-blue-500 animate-pulse' style={{ animationDelay: '0.2s' }} />
            <span>24/7 Support</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-2 h-2 rounded-full bg-purple-500 animate-pulse' style={{ animationDelay: '0.4s' }} />
            <span>30-Day Returns</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
