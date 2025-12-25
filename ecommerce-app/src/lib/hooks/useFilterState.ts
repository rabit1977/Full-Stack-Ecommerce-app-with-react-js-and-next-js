import { useMemo, useState } from 'react';
import { MAX_PRICE } from '@/lib/constants/filter';

export const useFilterState = (
  currentMinPrice: number,
  currentMaxPrice: number,
  currentBrands: string,
  currentCategories: string
) => {
  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>([
    currentMinPrice,
    currentMaxPrice,
  ]);

  // Parse selected brands from comma-separated string
  const selectedBrandsSet = useMemo(() => {
    if (!currentBrands) return new Set<string>();
    return new Set(currentBrands.split(',').filter(Boolean));
  }, [currentBrands]);

  // Parse selected categories from comma-separated string
  const selectedCategoriesSet = useMemo(() => {
    if (!currentCategories) return new Set<string>();
    return new Set(currentCategories.split(',').filter(Boolean));
  }, [currentCategories]);

  // Check if price filter is active (not default range)
  const isPriceFilterActive = useMemo(
    () => currentMinPrice !== 0 || currentMaxPrice !== MAX_PRICE,
    [currentMinPrice, currentMaxPrice]
  );

  // Calculate total active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    
    // Count selected categories
    count += selectedCategoriesSet.size;
    
    // Count selected brands
    count += selectedBrandsSet.size;
    
    // Count price filter if active
    if (isPriceFilterActive) count += 1;
    
    return count;
  }, [selectedCategoriesSet, selectedBrandsSet, isPriceFilterActive]);

  const hasActiveFilters = activeFiltersCount > 0;

  return {
    localPriceRange,
    setLocalPriceRange,
    selectedBrandsSet,
    selectedCategoriesSet,
    isPriceFilterActive,
    activeFiltersCount,
    hasActiveFilters,
  };
};