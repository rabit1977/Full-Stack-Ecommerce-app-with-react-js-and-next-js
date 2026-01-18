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
      <div className='container mx-auto px-4 py-16'>
        {/* Header */}
        <div className='mb-12 flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left'>
          <div className='space-y-2'>
            <h2
              id='featured-products-heading'
              className='text-3xl font-bold tracking-tight sm:text-4xl'
            >
              {title}
            </h2>
            {subtitle && (
              <p className='text-lg text-muted-foreground'>{subtitle}</p>
            )}
          </div>

          {/* View All Button - Desktop */}
          {showViewAll && (
            <Button asChild size='lg' className='hidden sm:inline-flex gap-2'>
              <Link href='/products'>
                View All Products
                <ArrowRight className='h-4 w-4' />
              </Link>
            </Button>
          )}
        </div>

        {/* Product List */}
        <ProductList products={products} />

        {/* Bottom CTA - Mobile */}
        {showViewAll && (
          <Button asChild size='lg' className='gap-2 w-full max-w-md'>
            <Link href='/products'>
              View All Products
              <ArrowRight className='h-4 w-4' />
            </Link>
          </Button>
        )}
      </div>
    </section>
  );
};

export type { FeaturedProductsProps };
