'use client';

import { getFiltersAction, getProductsAction } from '@/actions/product-actions';
import { ProductGrid } from '@/components/product/product-grid'; // Check case: product-grid vs ProductGrid
import { Product, SortKey } from '@/lib/types';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const ProductsPage = () => {
  const searchParams = useSearchParams();
  
  // Product Data States
  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isProductLoading, setIsProductLoading] = useState(true);

  // Filter Data States (Fetch once and keep)
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [allBrands, setAllBrands] = useState<string[]>([]);
  const [filtersLoaded, setFiltersLoaded] = useState(false);

  // 1. Fetch Categories and Brands ONLY ONCE on mount
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const filters = await getFiltersAction();
        setAllCategories(filters.categories);
        setAllBrands(filters.brands);
        setFiltersLoaded(true);
      } catch (error) {
        console.error('Failed to load filters', error);
      }
    };

    fetchFilters();
  }, []);

  // 2. Fetch Products whenever searchParams change
  useEffect(() => {
    const fetchProducts = async () => {
      setIsProductLoading(true);
      const params = searchParams || new URLSearchParams();

      const query = (params.get('search') as string) || '';
      const categories = (params.get('categories') as string) || '';
      const brands = (params.get('brands') as string) || '';
      const minPrice = Number(params.get('minPrice')) || undefined;
      const maxPrice = Number(params.get('maxPrice')) || undefined;
      const sort = (params.get('sort') as SortKey) || 'featured';
      const page = Number(params.get('page')) || 1;

      try {
        const { products: newProducts, totalCount: newTotal } = await getProductsAction({
          query,
          categories,
          brands,
          minPrice,
          maxPrice,
          sort,
          page,
          limit: 8,
        });

        setProducts(newProducts);
        setTotalCount(newTotal);
      } catch (error) {
        console.error('Failed to load products', error);
      } finally {
        setIsProductLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  const params = searchParams || new URLSearchParams();
  const query = (params.get('search') as string) || '';
  const categories = (params.get('categories') as string) || '';
  const brands = (params.get('brands') as string) || '';
  const minPrice = Number(params.get('minPrice')) || undefined;
  const maxPrice = Number(params.get('maxPrice')) || undefined;
  const sort = (params.get('sort') as SortKey) || 'featured';
  const page = Number(params.get('page')) || 1;

  // Only use the full screen loader for the INITIAL load of filters
  // Do NOT use it for subsequent product filtering
  if (!filtersLoaded) {
     // You can use your LoadingOverlay here if you want a full screen load initially
     return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <ProductGrid
      // Data
      products={products}
      totalCount={totalCount}
      
      // Filter Lists (Passed from the one-time fetch)
      allCategories={allCategories}
      allBrands={allBrands}
      
      // Current State (from URL)
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