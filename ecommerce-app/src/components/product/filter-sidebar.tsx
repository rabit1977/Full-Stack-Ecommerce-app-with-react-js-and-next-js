'use client';

import { Accordion } from '@/components/ui/accordion';
import { DEFAULT_ACCORDION_VALUES, MAX_PRICE } from '@/lib/constants/filter';
import { useFilterHandlers } from '@/lib/hooks/useFilterHandlers';
import { useFilterState } from '@/lib/hooks/useFilterState';
import { FilterSidebarProps } from '@/lib/types/filter';
import { cn } from '@/lib/utils';
import React from 'react';
import { ActiveFiltersHeader } from '../ActiveFiltersHeader';
import { BrandFilter } from '../BrandFilter';
import { CategoryFilter } from '../CategoryFilter';
import { FilterLoadingIndicator } from '../FilterLoadingIndicator';
import { PriceFilter } from '../PriceFilter';

const FilterSidebar = React.memo<FilterSidebarProps>(
  ({
    categories,
    brands,
    currentCategories,
    currentSubCategories,
    currentBrands,
    currentMinPrice = 0,
    currentMaxPrice = MAX_PRICE,
    onCategoriesChange,
    onSubCategoriesChange,
    onBrandsChange,
    onPriceChange,
    className,
    showFilterCount = true,
  }) => {
    const {
      localPriceRange,
      setLocalPriceRange,
      selectedBrandsSet,
      selectedCategoriesSet,
      selectedSubCategoriesSet,
      isPriceFilterActive,
      activeFiltersCount,
    } = useFilterState(
      currentMinPrice,
      currentMaxPrice,
      currentBrands,
      currentCategories,
      currentSubCategories
    );

    const {
      isPending,
      handleBrandToggle,
      handleCategoryToggle,
      handleSubCategoryToggle,
      handlePriceValueChange,
      handlePriceCommit,
    } = useFilterHandlers(
      selectedBrandsSet,
      selectedCategoriesSet,
      selectedSubCategoriesSet,
      currentMinPrice,
      currentMaxPrice,
      onBrandsChange,
      onCategoriesChange,
      onSubCategoriesChange,
      onPriceChange
    );

    const handlePriceChange = (value: number[]) => {
      setLocalPriceRange(handlePriceValueChange(value));
    };

    return (
      <aside className={cn('w-full', className)} aria-label='Product filters'>
        <ActiveFiltersHeader
          count={activeFiltersCount}
          show={showFilterCount}
        />

        <Accordion
          type='multiple'
          defaultValue={DEFAULT_ACCORDION_VALUES}
          className='w-full'
        >
          <CategoryFilter
            categories={categories}
            selectedCategories={selectedCategoriesSet}
            selectedSubCategories={selectedSubCategoriesSet}
            onCategoryToggle={handleCategoryToggle}
            onSubCategoryToggle={handleSubCategoryToggle}
            isPending={isPending}
            showFilterCount={showFilterCount}
          />

          <BrandFilter
            brands={brands}
            selectedBrands={selectedBrandsSet}
            onBrandToggle={handleBrandToggle}
            isPending={isPending}
            showFilterCount={showFilterCount}
          />

          <PriceFilter
            localPriceRange={localPriceRange}
            onValueChange={handlePriceChange}
            onValueCommit={handlePriceCommit}
            isPending={isPending}
            showFilterCount={showFilterCount}
            isActive={isPriceFilterActive}
          />
        </Accordion>

        <FilterLoadingIndicator isPending={isPending} />
      </aside>
    );
  }
);

FilterSidebar.displayName = 'FilterSidebar';

export { FilterSidebar };
export type { FilterSidebarProps };
