'use client';

import { getFiltersAction, getProductsAction } from '@/actions/product-actions';
import { ProductGrid } from '@/components/product/product-grid'; // Check case: product-grid vs ProductGrid
import { ProductWithImages, SortKey } from '@/lib/types';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const ProductsPage = () => {
  const searchParams = useSearchParams();

  // Data States
  const [products, setProducts] = useState<ProductWithImages[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);
  const [filtersLoaded, setFiltersLoaded] = useState(false);

  // Fetch both products and filters whenever searchParams change
  useEffect(() => {
    const fetchData = async () => {
      const params = searchParams || new URLSearchParams();

      const query = (params.get('search') as string) || '';
      const categories = (params.get('categories') as string) || '';
      const brands = (params.get('brands') as string) || '';
      const minPrice = Number(params.get('minPrice')) || undefined;
      const maxPrice = Number(params.get('maxPrice')) || undefined;
      const sort = (params.get('sort') as SortKey) || 'featured';
      const page = Number(params.get('page')) || 1;

      try {
        // Fetch products and dynamic filters in parallel
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
          // Pass current categories to filter the available brands
          getFiltersAction(categories),
        ]);

        setProducts(productsRes.products);
        setTotalCount(productsRes.totalCount);
        
        // Update filter lists
        setAllCategories(filtersRes.categories);
        setAvailableBrands(filtersRes.brands);
        setFiltersLoaded(true);
      } catch (error) {
        console.error('Failed to load products page data', error);
      }
    };

    fetchData();
  }, [searchParams]);

  const params = searchParams || new URLSearchParams();
  const query = (params.get('search') as string) || '';
  const categories = (params.get('categories') as string) || '';
  const brands = (params.get('brands') as string) || '';
  const minPrice = Number(params.get('minPrice')) || undefined;
  const maxPrice = Number(params.get('maxPrice')) || undefined;
  const sort = (params.get('sort') as SortKey) || 'featured';
  const page = Number(params.get('page')) || 1;

  if (!filtersLoaded) {
    return (
      <div className='min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900'>
        <div className='w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4' />
        <p className='text-slate-500 font-medium'>Curating tech for you...</p>
      </div>
    );
  }

  return (
    <ProductGrid
      products={products}
      totalCount={totalCount}
      allCategories={allCategories}
      allBrands={availableBrands} // This now updates dynamically!
      currentPage={page}
      currentCategories={categories}
      currentBrands={brands}
      currentMinPrice={minPrice}
      currentMaxPrice={maxPrice}
      currentSort={sort}
      searchQuery={query}
    />
  );
};

export default ProductsPage;
