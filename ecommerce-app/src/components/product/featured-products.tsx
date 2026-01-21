'use client';

import { ProductList } from '@/components/product/ProductList';
import { Button } from '@/components/ui/button';
import { ProductWithRelations } from '@/lib/types'; // ✅ Changed import
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface FeaturedProductsProps {
  /** Section title */
  title?: string;
  /** Section subtitle */
  subtitle?: string;
  /** Products to display */
  products: ProductWithRelations[]; // ✅ Changed type
  /** Whether to show "View All" button */
  showViewAll?: boolean;
  /** Custom class name */
  className?: string;
}

/**
 * Featured Products Section Component
 *
 * Displays a curated list of products with optional header and CTA
 * Perfect for homepage featured sections or category highlights
 *
 * Features:
 * - Responsive layout
 * - Optional "View All" CTA
 * - Mobile-optimized with bottom CTA
 * - Clean, modern design
 * - Accessible markup
 */
export const FeaturedProducts = ({
  title = 'Featured Products',
  subtitle = 'Check out our latest and greatest',
  products,
  showViewAll = true,
  className,
}: FeaturedProductsProps) => {
  return (
    <section className={className} aria-labelledby='featured-products-heading'>
      <div className='container-wide py-16 sm:py-24'>
        {/* Header */}
        <div className='mb-12 flex flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left'>
          <div className='space-y-3'>
            <h2
              id='featured-products-heading'
              className='tracking-tight'
            >
              {title}
            </h2>
            {subtitle && (
              <p className='text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl'>{subtitle}</p>
            )}
          </div>

          {/* View All Button - Desktop */}
          {showViewAll && (
            <Button asChild size='lg' className='hidden sm:inline-flex gap-2 h-14 px-8 text-base shadow-lg shadow-primary/10 transition-all active:scale-95'>
              <Link href='/products'>
                View All Products
                <ArrowRight className='h-5 w-5' />
              </Link>
            </Button>
          )}
        </div>

        {/* Product List */}
        <ProductList products={products} />

        {/* Bottom CTA - Mobile */}
        {showViewAll && (
          <div className='mt-10 flex justify-center sm:hidden'>
            <Button
              asChild
              size='lg'
              className='gap-2 w-full flex justify-center max-w-md'
            >
              <Link href='/products'>
                View All Products
                <ArrowRight className='h-4 w-4' />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export type { FeaturedProductsProps };
