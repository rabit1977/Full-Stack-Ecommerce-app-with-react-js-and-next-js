'use client';

import { Product } from '@/lib/types';
import { HeroHeader } from './hero-header';
import { ProductCarousel } from './product-carousel';
import { Testimonials } from './testimonials';

export interface HeroProps {
  /** Products to display in carousel */
  products: Product[];
  /** Number of products to show in carousel */
  carouselLimit?: number;
  /** Auto-play interval in milliseconds */
  autoPlayInterval?: number;
  /** Whether to show testimonials section */
  showTestimonials?: boolean;
}

/**
 * Professional hero component with animated product carousel and testimonials
 *
 * Features:
 * - Auto-playing carousel with manual controls, swipe gestures, and play/pause
 * - Smooth animations with Framer Motion
 * - Pause on hover
 * - Keyboard navigation support
 * - Responsive design
 * - Performance optimized
 * - Component-based structure for maintainability
 */
export const Hero = ({
  products,
  carouselLimit,
  autoPlayInterval,
  showTestimonials = true,
}: HeroProps) => {
  return (
    <section className='bg-slate-50 dark:bg-slate-900 min-h-screen'>
      <HeroHeader />
      <ProductCarousel
        products={products}
        carouselLimit={carouselLimit}
        autoPlayInterval={autoPlayInterval}
      />
      {showTestimonials && <Testimonials />}
    </section>
  );
};