import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { MAX_PRICE } from '@/lib/constants/filter';

export const useFilterMetadata = (
  currentCategories: string,
  currentBrands: string,
  currentMinPrice?: number,
  currentMaxPrice?: number
) => {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  const activeFiltersCount = useMemo(() => {
    let count = 0;

    // Count selected categories
    if (currentCategories) {
      const categoriesArray = currentCategories.split(',').filter(Boolean);
      count += categoriesArray.length;
    }

    // Count selected brands
    if (currentBrands) {
      const brandsArray = currentBrands.split(',').filter(Boolean);
      count += brandsArray.length;
    }

    // Count price filter if not default range
    if (
      (currentMinPrice !== undefined && currentMinPrice !== 0) ||
      (currentMaxPrice !== undefined && currentMaxPrice !== MAX_PRICE)
    ) {
      count += 1;
    }

    return count;
  }, [currentCategories, currentBrands, currentMinPrice, currentMaxPrice]);

  const hasActiveFilters = activeFiltersCount > 0;

  return {
    activeFiltersCount,
    hasActiveFilters,
    searchQuery,
  };
};