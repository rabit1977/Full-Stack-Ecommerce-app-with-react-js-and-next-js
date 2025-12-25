'use client';

import { pageTransition, staggerContainer } from '@/lib/constants/animations';
import { motion, Variants } from 'framer-motion';
import { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
  variants?: Variants;
  enableStagger?: boolean;
}

/**
 * Reusable page transition wrapper component
 * Provides consistent fade-in animations for page content
 * 
 * @param children - Page content to animate
 * @param className - Optional CSS classes
 * @param variants - Custom animation variants (defaults to pageTransition)
 * @param enableStagger - Enable stagger animation for children
 */
export function PageTransition({ 
  children, 
  className = '',
  variants = pageTransition,
  enableStagger = false,
}: PageTransitionProps) {
  const animationVariants = enableStagger ? staggerContainer : variants;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={animationVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}
