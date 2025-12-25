'use client';

import { Product } from '@/lib/types';
import { ProductList } from '@/components/product/ProductList';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface FeaturedProductsProps {
  /** Section title */
  title?: string;
  /** Section subtitle */
  subtitle?: string;
  /** Products to display */
  products: Product[];
  /** Whether to show "View All" button */
  showViewAll?: boolean;
  /** Custom class name */
  className?: string;
}

/**
 * Simplified product grid for homepage/featured sections
 * No filtering, sorting, or pagination - just displays products
 */
export const FeaturedProducts = ({
  title = 'Featured Products',
  subtitle = 'Check out our latest and greatest',
  products,
  showViewAll = true,
  className,
}: FeaturedProductsProps) => {
  return (
    <section className={className}>
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-12 flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {title}
            </h2>
            {subtitle && (
              <p className="text-lg text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>

          {/* View All Button */}
          {showViewAll && (
            <Button asChild  size="lg" className="gap-2">
              <Link href="/products">
                View All Products
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>

        {/* Product List */}
        <ProductList products={products} />

        {/* Bottom CTA - Mobile */}
        {showViewAll && (
          <div className="mt-12 flex justify-center sm:hidden ">
            <Button asChild size="lg" className="gap-2 w-full max-w-md">
              <Link href="/products">
                View All Products
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export type { FeaturedProductsProps };