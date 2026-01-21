'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion, Variants } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

const fadeInUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export const HeroHeader = () => {
  const router = useRouter();

  const navigateToProducts = useCallback(() => {
    router.push('/products');
  }, [router]);

  const navigateToAbout = useCallback(() => {
    router.push('/about');
  }, [router]);

  return (
    <div className='container-wide py-12 sm:py-16 lg:py-24 text-center'>
      <motion.div
        initial='hidden'
        animate='visible'
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.2,
            },
          },
        }}
        className='space-y-8'
      >
        <motion.div variants={fadeInUpVariants}>
          <Badge variant='outline' className='text-sm font-semibold px-4 py-1.5 border-primary/30 text-primary bg-primary/5 uppercase tracking-wider'>
            🎉 New Arrivals Available
          </Badge>
        </motion.div>

        <motion.h1
          variants={fadeInUpVariants}
          className='leading-tight'
        >
          The Future of Tech, <span className='text-primary'>Today</span>
        </motion.h1>

        <motion.p
          variants={fadeInUpVariants}
          className='mx-auto max-w-3xl text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 leading-relaxed'
        >
          Discover cutting-edge electronics and gadgets designed to elevate your
          everyday life. Unbeatable prices, unmatched quality.
        </motion.p>

        <motion.div
          variants={fadeInUpVariants}
          className='flex flex-col sm:flex-row items-center justify-center gap-4 pt-4'
        >
          <Button
            size='lg'
            variant='default'
            onClick={navigateToProducts}
            className='text-base px-8 flex items-center gap-2'
          >
            <ShoppingBag className='h-5 w-5' />
            Shop Now
          </Button>
          <Button
            size='lg'
            variant='outline'
            onClick={navigateToAbout}
            className='text-base px-8'
          >
            Learn More
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};
