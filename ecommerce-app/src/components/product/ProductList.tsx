// components/product/product-list.tsx
'use client';

import { ProductWithRelations } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ProductCard } from './product-card';

interface ProductListProps {
  products: ProductWithRelations[];
  className?: string;
}

export const ProductList = ({ products, className }: ProductListProps) => {
  return (
    <div
      className={cn(
        'mt-6 sm:mt-8 grid gap-4 xs:gap-5 sm:gap-6 lg:gap-8 grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5',
        className,
      )}
    >
      {products.length > 0 ? (
        // Render products when loaded
        products.map((product) => (
          <ProductCard key={product.id} product={product} initialIsWished={false} />
        ))
      ) : (
        // Render "no products found" message
        <div className='col-span-full py-16 text-center'>
          <p className='text-lg text-slate-500 dark:text-slate-400'>
            No products found.
          </p>
          <p className='text-slate-400 dark:text-slate-500'>
            Try adjusting your search or filters.
          </p>
        </div>
      )}
    </div>
  );
};
