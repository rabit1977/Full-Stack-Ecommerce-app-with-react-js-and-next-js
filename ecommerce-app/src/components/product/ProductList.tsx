// components/product/product-list.tsx
'use client';

import { Product } from '@/lib/types';
import { ProductCard } from './product-card';

interface ProductListProps {
  products: Product[];
}

export const ProductList = ({ products }: ProductListProps) => {
  return (
    <div className='mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
      {products.length > 0 ? (
        // Render products when loaded
        products.map((product) => (
          <ProductCard key={product.id} product={product} />
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
