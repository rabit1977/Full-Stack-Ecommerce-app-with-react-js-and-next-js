import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useRef, useTransition } from 'react';

export const useProductFilters = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const priceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isPending, startTransition] = useTransition();

  const createQueryString = useCallback(
    (params: Record<string, string | number | null | undefined>) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());

      for (const [key, value] of Object.entries(params)) {
        if (value === null || value === undefined || value === '') {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, String(value));
        }
      }

      return newSearchParams.toString();
    },
    [searchParams]
  );

  const navigateWithTransition = useCallback(
    (
      queryString: string,
      scrollToTop = false,
      gridRef?: React.RefObject<HTMLDivElement | null>
    ) => {
      startTransition(() => {
        router.push(`${pathname}?${queryString}`, { scroll: false });

        if (scrollToTop && gridRef?.current) {
          setTimeout(() => {
            gridRef.current?.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            });
          }, 100);
        }
      });
    },
    [router, pathname]
  );

  const handleCategoriesChange = useCallback(
    (newCategories: string[]) => {
      const categoriesStr =
        newCategories.length > 0 ? newCategories.join(',') : null;
      const queryString = createQueryString({
        categories: categoriesStr,
        // Reset subcategories when main category changes if needed, 
        // or keep them if they might still be valid. 
        // Usually, it's safer to reset subcategories when categories change significantly.
        subCategories: null, 
        page: 1,
      });
      navigateWithTransition(queryString);
    },
    [createQueryString, navigateWithTransition]
  );

  const handleSubCategoriesChange = useCallback(
    (newSubCategories: string[]) => {
      const subCategoriesStr =
        newSubCategories.length > 0 ? newSubCategories.join(',') : null;
      const queryString = createQueryString({
        subCategories: subCategoriesStr,
        page: 1,
      });
      navigateWithTransition(queryString);
    },
    [createQueryString, navigateWithTransition]
  );

  const handleBrandsChange = useCallback(
    (newBrands: string[]) => {
      const brandsStr = newBrands.length > 0 ? newBrands.join(',') : null;
      const queryString = createQueryString({ brands: brandsStr, page: 1 });
      navigateWithTransition(queryString);
    },
    [createQueryString, navigateWithTransition]
  );

  const handlePriceChange = useCallback(
    (newPriceRange: [number, number]) => {
      if (priceTimeoutRef.current) {
        clearTimeout(priceTimeoutRef.current);
      }

      priceTimeoutRef.current = setTimeout(() => {
        const [min, max] = newPriceRange;
        const queryString = createQueryString({
          minPrice: min === 0 ? null : min,
          maxPrice: max === 1000 ? null : max,
          page: 1,
        });
        navigateWithTransition(queryString);
      }, 500);
    },
    [createQueryString, navigateWithTransition]
  );

  const handleSortChange = useCallback(
    (newSort: string) => {
      const queryString = createQueryString({
        sort: newSort === 'featured' ? null : newSort,
        page: 1,
      });
      navigateWithTransition(queryString);
    },
    [createQueryString, navigateWithTransition]
  );

  const handlePageChange = useCallback(
    (newPage: number, gridRef?: React.RefObject<HTMLDivElement | null>) => {
      const queryString = createQueryString({ page: newPage });
      navigateWithTransition(queryString, true, gridRef);
    },
    [createQueryString, navigateWithTransition]
  );

  const handleClearFilters = useCallback(() => {
    const queryString = createQueryString({
      categories: null,
      brands: null,
      minPrice: null,
      maxPrice: null,
      page: 1,
    });
    navigateWithTransition(queryString);
  }, [createQueryString, navigateWithTransition]);

  return {
    isPending,
    priceTimeoutRef,
    handleCategoriesChange,
    handleSubCategoriesChange,
    handleBrandsChange,
    handlePriceChange,
    handleSortChange,
    handlePageChange,
    handleClearFilters,
  };
};
