'use client';

import { ProductCard } from '@/components/product/product-card';
import { useProducts } from '@/lib/hooks/useProducts';
import { Product } from '@/lib/types';

interface RelatedProductsProps {
  currentProduct: Product;
}
import { useMemo } from 'react';

const RelatedProducts = ({ currentProduct }: RelatedProductsProps) => {
  const { products } = useProducts();

  const related = useMemo(() => {
    return products
      .filter(
        (p) =>
          p.category === currentProduct.category && p.id !== currentProduct.id
      )
      .slice(0, 4);
  }, [products, currentProduct]);

  if (related.length === 0) return null;

  return (
    <div className='mt-12 py-8 border-t dark:border-slate-800'>
      <h2 className='text-2xl font-bold tracking-tight text-slate-900 dark:text-white'>
        You Might Also Like
      </h2>
      <div className='mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {related.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export { RelatedProducts };
