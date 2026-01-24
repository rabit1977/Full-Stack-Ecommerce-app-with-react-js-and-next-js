import { getFiltersAction, getProductsAction } from '@/actions/product-actions';
import { ProductGrid } from '@/components/product/product-grid';
import { SortKey } from '@/lib/types';
import { Suspense } from 'react';
import ProductsLoading from './loading';

export const metadata = {
  title: 'Products',
  description: 'Browse our collection of premium tech products',
};

interface ProductsPageProps {
  searchParams: Promise<{
    search?: string;
    categories?: string;
    brands?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: SortKey;
    page?: string;
  }>;
}

/**
 * Products Page - Server Component
 *
 * Fetches data on the server for optimal performance
 * Uses React 19's async params pattern
 */
export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;

  const query = params.search || '';
  const categories = params.categories || '';
  const brands = params.brands || '';
  const minPrice = params.minPrice ? Number(params.minPrice) : undefined;
  const maxPrice = params.maxPrice ? Number(params.maxPrice) : undefined;
  const sort = (params.sort as SortKey) || 'featured';
  const page = params.page ? Number(params.page) : 1;

  // Fetch products and filters in parallel on the server
  const [productsRes, filtersRes] = await Promise.all([
    getProductsAction({
      query,
      categories,
      brands,
      minPrice,
      maxPrice,
      sort,
      page,
      limit: 8,
    }),
    getFiltersAction(categories),
  ]);

  return (
    <Suspense fallback={<ProductsLoading />}>
      <ProductGrid
        products={productsRes.products}
        totalCount={productsRes.totalCount}
        allCategories={filtersRes.categories}
        allBrands={filtersRes.brands}
        currentPage={page}
        currentCategories={categories}
        currentBrands={brands}
        currentMinPrice={minPrice}
        currentMaxPrice={maxPrice}
        currentSort={sort}
        searchQuery={query}
      />
    </Suspense>
  );
}
