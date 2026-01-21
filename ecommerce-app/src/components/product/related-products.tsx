// components/product/related-products.tsx (Server Component Version)

import { getProductsAction } from '@/actions/product-actions';
import { ProductWithRelations } from '@/lib/types';
import { ProductCard } from './product-card';

interface RelatedProductsProps {
  currentProduct: ProductWithRelations;
  limit?: number;
}

/**
 * RelatedProducts Server Component
 *
 * Displays products related to the current product
 * Fetches data on the server for better performance
 */
export async function RelatedProducts({
  currentProduct,
  limit = 4,
}: RelatedProductsProps) {
  // Fetch related products on the server
  const { products } = await getProductsAction({
    categories: currentProduct.category,
    limit: limit + 1, // Get one extra in case current product is included
    sort: 'rating',
  });

  // Filter out current product and limit results
  const relatedProducts = products
    .filter((p) => p.id !== currentProduct.id)
    .slice(0, limit);

  // Don't render if no related products
  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <section className='py-12' aria-labelledby='related-products-heading'>
      <div className='container-wide'>
        <h2
          id='related-products-heading'
          className='mb-8'
        >
          Related Products
        </h2>

        <div className='grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8'>
          {relatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
