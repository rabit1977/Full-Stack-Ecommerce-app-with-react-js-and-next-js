import { useCallback, useTransition } from 'react';

export const useFilterHandlers = (
  selectedBrandsSet: Set<string>,
  selectedCategoriesSet: Set<string>,
  selectedSubCategoriesSet: Set<string>,
  currentMinPrice: number,
  currentMaxPrice: number,
  onBrandsChange: (brands: string[]) => void,
  onCategoriesChange: (categories: string[]) => void,
  onSubCategoriesChange: (subCategories: string[]) => void,
  onPriceChange: (priceRange: [number, number]) => void
) => {
  const [isPending, startTransition] = useTransition();

  const handleBrandToggle = useCallback(
    (brand: string, checked: boolean) => {
      startTransition(() => {
        const newSelectedBrands = new Set(selectedBrandsSet);

        if (checked) {
          newSelectedBrands.add(brand);
        } else {
          newSelectedBrands.delete(brand);
        }

        onBrandsChange(Array.from(newSelectedBrands));
      });
    },
    [selectedBrandsSet, onBrandsChange]
  );

  const handleCategoryToggle = useCallback(
    (category: string, checked: boolean) => {
      startTransition(() => {
        const newSelectedCategories = new Set(selectedCategoriesSet);

        if (checked) {
          newSelectedCategories.add(category);
        } else {
          newSelectedCategories.delete(category);
        }

        onCategoriesChange(Array.from(newSelectedCategories));
      });
    },
    [selectedCategoriesSet, onCategoriesChange]
  );

  const handleSubCategoryToggle = useCallback(
    (subCategory: string, checked: boolean) => {
      startTransition(() => {
        const newSelectedSubCategories = new Set(selectedSubCategoriesSet);

        if (checked) {
          newSelectedSubCategories.add(subCategory);
        } else {
          newSelectedSubCategories.delete(subCategory);
        }

        onSubCategoriesChange(Array.from(newSelectedSubCategories));
      });
    },
    [selectedSubCategoriesSet, onSubCategoriesChange]
  );

  const handlePriceValueChange = useCallback((value: number[]) => {
    return value as [number, number];
  }, []);

  const handlePriceCommit = useCallback(
    (value: number[]) => {
      const [min, max] = value;
      if (min !== currentMinPrice || max !== currentMaxPrice) {
        startTransition(() => {
          onPriceChange(value as [number, number]);
        });
      }
    },
    [currentMinPrice, currentMaxPrice, onPriceChange]
  );

  return {
    isPending,
    handleBrandToggle,
    handleCategoryToggle,
    handleSubCategoryToggle,
    handlePriceValueChange,
    handlePriceCommit,
  };
};