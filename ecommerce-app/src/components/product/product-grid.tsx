// components/product/ProductGrid.tsx
'use client';

import { ProductGridPagination } from '@/lib/hooks/usePagination';
import { useEffect, useMemo, useRef, useState } from 'react';

import { useFilterMetadata } from '@/lib/hooks/useFilterMetadata';
import { useProductFilters } from '@/lib/hooks/useProductFilters';
import { ProductGridProps } from '@/lib/types';
import { ActiveFiltersBanner } from '../ActiveFiltersBanner';
import { MobileFilterSheet } from '../MobileFilterSheet';
import { EmptyState } from '../shared/EmptyState';
import { LoadingOverlay } from '../shared/LoadingOverlay';
import { ProductGridControls } from './ProductGridControls';
import { ProductList } from './ProductList';
import { FilterSidebar } from './filter-sidebar';

export const ProductGrid = ({
  title = 'All Products',
  subtitle = 'Find the perfect tech for you',
  products,
  totalCount,
  currentPage,
  currentCategories,
  currentBrands,
  currentMinPrice,
  currentMaxPrice,
  currentSort,
  pageSize = 8,
  // ADD THESE TWO LINES BELOW to accept the full lists from the parent
  allCategories,
  allBrands,
}: ProductGridProps) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const {
    isPending,
    priceTimeoutRef,
    handleCategoriesChange,
    handleBrandsChange,
    handlePriceChange,
    handleSortChange,
    handlePageChange,
    handleClearFilters,
  } = useProductFilters();

  const { activeFiltersCount, hasActiveFilters, searchQuery } =
    useFilterMetadata(
      currentCategories,
      currentBrands,
      currentMinPrice,
      currentMaxPrice
    );

  // Cleanup timeout on unmount
  useEffect(() => {
    const timeoutId = priceTimeoutRef.current;
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  const currentTitle = useMemo(
    () => (searchQuery ? `Results for "${searchQuery}"` : title),
    [searchQuery, title]
  );

  const currentSubtitle = useMemo(
    () =>
      searchQuery
        ? `${totalCount.toLocaleString()} product${
            totalCount !== 1 ? 's' : ''
          } found`
        : subtitle,
    [searchQuery, totalCount, subtitle]
  );

  const filterSidebar = useMemo(
    () => (
      <FilterSidebar
        // We now use the allCategories/allBrands passed from props
        // Note: Ensure your parent component passes 'all' for categories if needed, 
        // or prepend it here like: ['all', ...allCategories]
        categories={['all', ...allCategories.filter(c => c !== 'all')]} 
        brands={allBrands}
        currentCategories={currentCategories}
        currentBrands={currentBrands}
        currentMinPrice={currentMinPrice}
        currentMaxPrice={currentMaxPrice}
        onCategoriesChange={handleCategoriesChange}
        onBrandsChange={handleBrandsChange}
        onPriceChange={handlePriceChange}
      />
    ),
    [
      allCategories,
      allBrands,
      currentCategories,
      currentBrands,
      currentMinPrice,
      currentMaxPrice,
      handleCategoriesChange,
      handleBrandsChange,
      handlePriceChange,
    ]
  );

  const wrappedClearFilters = () => {
    setIsSheetOpen(false);
    handleClearFilters();
  };

  const wrappedPageChange = (page: number) => {
    handlePageChange(page, gridRef);
  };

  return (
    <div className='bg-slate-50 dark:bg-slate-900 min-h-screen'>
      <div
        className='container mx-auto px-4 py-8 sm:py-12 lg:py-16'
        ref={gridRef}
      >
        <ProductGridControls
          title={currentTitle}
          subtitle={currentSubtitle}
          currentSort={currentSort}
          onSortChange={handleSortChange}
          onFilterToggle={() => setIsSheetOpen(true)}
        />

        {hasActiveFilters && (
          <ActiveFiltersBanner
            count={activeFiltersCount}
            onClear={wrappedClearFilters}
            disabled={isPending}
          />
        )}

        <div className='lg:grid lg:grid-cols-4 lg:gap-8'>
          <aside
            className='hidden lg:block lg:col-span-1 sticky top-4 self-start'
            aria-label='Product filters'
          >
            <div className='rounded-lg border bg-card p-4 shadow-sm'>
              {filterSidebar}
            </div>
          </aside>

          <main className='lg:col-span-3'>
            <div className='relative'>
              <LoadingOverlay isLoading={isPending} />
              <ProductList products={products} />
            </div>

            {products.length === 0 && !isPending && (
              <EmptyState
                hasFilters={hasActiveFilters}
                onClearFilters={wrappedClearFilters}
              />
            )}

            {products.length > 0 && (
              <ProductGridPagination
                currentPage={currentPage}
                totalCount={totalCount}
                pageSize={pageSize}
                onPageChange={wrappedPageChange}
              />
            )}
          </main>
        </div>
      </div>

      <MobileFilterSheet
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        activeFiltersCount={activeFiltersCount}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={wrappedClearFilters}
        isPending={isPending}
      >
        {filterSidebar}
      </MobileFilterSheet>
    </div>
  );
};