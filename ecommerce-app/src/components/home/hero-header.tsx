'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion, Variants } from 'framer-motion';
import { ArrowRight, Play, ShieldCheck, Sparkles, Truck, Zap } from 'lucide-react';
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

const floatVariants: Variants = {
  animate: {
    y: [-8, 8, -8],
    transition: {
      duration: 6,
      ease: 'easeInOut',
      repeat: Infinity,
    },
  },
};

export const HeroHeader = () => {
  return (
    <div className='relative container-wide py-20 sm:py-28 lg:py-36 text-center overflow-hidden'>
      {/* Background Decorations */}
      <div className='absolute inset-0 -z-10 overflow-hidden'>
        {/* Primary Gradient Orb */}
        <motion.div
          variants={floatVariants}
          animate='animate'
          className='hero-orb hero-orb-primary w-[500px] h-[500px] top-[-10%] left-[-10%]'
        />
        
        {/* Accent Gradient Orb */}
        <motion.div
          variants={floatVariants}
          animate='animate'
          style={{ animationDelay: '2s' }}
          className='hero-orb hero-orb-accent w-[600px] h-[600px] bottom-[-20%] right-[-15%]'
        />
        
        {/* Center Glow */}
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/5 via-transparent to-transparent blur-3xl' />
        
        {/* Grid Pattern */}
        <div className='absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:60px_60px]' />
      </div>

      <motion.div
        initial='hidden'
        animate='visible'
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.12,
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
            className='inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 border-primary/30 text-primary bg-primary/5 hover:bg-primary/10 transition-all duration-300 cursor-default rounded-full backdrop-blur-sm'
          >
            <Sparkles className='h-4 w-4 animate-pulse' />
            New Collection 2025
            <ArrowRight className='h-3.5 w-3.5' />
          </Badge>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={fadeInUpVariants}
          className='leading-[1.05] max-w-4xl mx-auto'
        >
          <span className='block text-foreground'>The Future of Tech,</span>
          <span className='block mt-2 gradient-text-animate'>
            Delivered Today
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={fadeInUpVariants}
          className='mx-auto max-w-2xl text-lg sm:text-xl text-muted-foreground leading-relaxed'
        >
          Discover cutting-edge electronics and premium gadgets designed to 
          elevate your everyday life. Unbeatable prices, exceptional quality.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={fadeInUpVariants}
          className='flex flex-col sm:flex-row items-center justify-center gap-4 pt-6'
        >
          <Button
            asChild
            size='lg'
            className='group relative overflow-hidden text-base px-8 h-14 rounded-2xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/95 hover:to-primary shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:shadow-2xl transition-all duration-300 font-semibold'
          >
            <Link href='/products'>
              <Zap className='h-5 w-5 mr-2' />
              Shop Now
              <ArrowRight className='h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform' />
              {/* Shine effect */}
              <span className='absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700' />
            </Link>
          </Button>
          <Button
            asChild
            size='lg'
            variant='outline'
            className='text-base px-8 h-14 rounded-2xl border-2 border-border hover:bg-accent/50 hover:border-primary/30 transition-all duration-300 font-semibold group backdrop-blur-sm'
          >
            <Link href='/about'>
              <Play className='h-4 w-4 mr-2 group-hover:scale-110 transition-transform' />
              Watch Story
            </Link>
          </Button>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          variants={fadeInUpVariants}
          className='pt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-12'
        >
          {[
            { icon: Truck, label: 'Free Shipping', subtext: 'On orders $50+' },
            { icon: ShieldCheck, label: '2-Year Warranty', subtext: 'Full coverage' },
            { icon: Zap, label: '24/7 Support', subtext: 'Always here' },
          ].map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              className='flex items-center gap-3 group'
            >
              <div className='w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-colors'>
                <item.icon className='h-5 w-5 text-primary' />
              </div>
              <div className='text-left'>
                <p className='text-sm font-semibold text-foreground'>{item.label}</p>
                <p className='text-xs text-muted-foreground'>{item.subtext}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Floating Elements */}
      <motion.div
        className='absolute top-20 right-[15%] hidden lg:block'
        animate={{
          y: [0, -15, 0],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 5,
          ease: 'easeInOut',
          repeat: Infinity,
        }}
      >
        <div className='w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-sm border border-white/20 shadow-lg flex items-center justify-center'>
          <Sparkles className='h-7 w-7 text-primary' />
        </div>
      </motion.div>

      <motion.div
        className='absolute bottom-32 left-[10%] hidden lg:block'
        animate={{
          y: [0, 12, 0],
          rotate: [0, -5, 0],
        }}
        transition={{
          duration: 6,
          ease: 'easeInOut',
          repeat: Infinity,
          delay: 1,
        }}
      >
        <div className='w-14 h-14 rounded-xl bg-gradient-to-br from-accent/20 to-primary/20 backdrop-blur-sm border border-white/20 shadow-lg flex items-center justify-center'>
          <Zap className='h-6 w-6 text-accent' />
        </div>
      </motion.div>
    </div>
  );
};
