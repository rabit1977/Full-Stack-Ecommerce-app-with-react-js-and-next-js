'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
} from 'lucide-react';
import React, { useCallback, useMemo } from 'react';

// Pagination hook constant
const DOTS = '...';

interface UsePaginationProps {
  totalCount: number;
  pageSize: number;
  siblingCount?: number;
  currentPage: number;
}

/**
 * Custom hook for generating pagination range
 * Returns an array of page numbers and DOTS for ellipsis
 */
const usePagination = ({
  totalCount,
  pageSize,
  siblingCount = 1,
  currentPage,
}: UsePaginationProps): (string | number)[] => {
  const paginationRange = useMemo(() => {
    const totalPageCount = Math.ceil(totalCount / pageSize);

    // Total page numbers to show: siblingCount + firstPage + lastPage + currentPage + 2*DOTS
    const totalPageNumbers = siblingCount + 5;

    // Case 1: If total pages is less than what we want to show, return all pages
    if (totalPageNumbers >= totalPageCount) {
      return Array.from({ length: totalPageCount }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(
      currentPage + siblingCount,
      totalPageCount
    );

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPageCount;

    // Case 2: No left dots, but show right dots
    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      return [...leftRange, DOTS, totalPageCount];
    }

    // Case 3: Show left dots, but no right dots
    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => totalPageCount - rightItemCount + 1 + i
      );
      return [firstPageIndex, DOTS, ...rightRange];
    }

    // Case 4: Show both left and right dots
    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i
      );
      return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
    }

    return [];
  }, [totalCount, pageSize, siblingCount, currentPage]);

  return paginationRange;
};

interface ProductGridPaginationProps {
  /** Current active page number (1-based) */
  currentPage: number;
  /** Total number of items across all pages */
  totalCount: number;
  /** Number of items displayed per page */
  pageSize: number;
  /** Callback function triggered when page changes - receives page number only */
  onPageChange: (page: number) => void;
  /** Optional CSS class names for custom styling */
  className?: string;
  /** Whether to show first/last page navigation buttons */
  showFirstLast?: boolean;
  /** Whether to show page info text */
  showPageInfo?: boolean;
  /** Size variant for pagination buttons */
  size?: 'sm' | 'default' | 'lg';
  /** Custom aria-label for the pagination navigation */
  ariaLabel?: string;
  /** Number of sibling pages to show on each side of current page */
  siblingCount?: number;
}

/**
 * Professional pagination component with accessibility features and modern UX patterns
 *
 * Features:
 * - Full keyboard navigation support
 * - Screen reader optimization
 * - Responsive design
 * - Customizable appearance
 * - Performance optimized with memoization
 * - TypeScript strict mode compatible
 */
const ProductGridPagination = React.memo<ProductGridPaginationProps>(
  ({
    currentPage,
    totalCount,
    pageSize,
    onPageChange,
    className,
    showFirstLast = false,
    showPageInfo = true,
    size = 'default',
    ariaLabel = 'Product pagination navigation',
    siblingCount = 1,
  }) => {
    const paginationRange = usePagination({
      currentPage,
      totalCount,
      pageSize,
      siblingCount,
    });

    const totalPages = useMemo(
      () => Math.ceil(totalCount / pageSize),
      [totalCount, pageSize]
    );

    const lastPage = useMemo(() => {
      const last = paginationRange[paginationRange.length - 1];
      return typeof last === 'number' ? last : totalPages;
    }, [paginationRange, totalPages]);

    // Memoized handlers for performance
    const handlePrevious = useCallback(() => {
      if (currentPage > 1) {
        onPageChange(currentPage - 1);
      }
    }, [currentPage, onPageChange]);

    const handleNext = useCallback(() => {
      if (currentPage < totalPages) {
        onPageChange(currentPage + 1);
      }
    }, [currentPage, totalPages, onPageChange]);

    const handleFirst = useCallback(() => {
      if (currentPage !== 1) {
        onPageChange(1);
      }
    }, [currentPage, onPageChange]);

    const handleLast = useCallback(() => {
      if (currentPage !== totalPages) {
        onPageChange(totalPages);
      }
    }, [currentPage, totalPages, onPageChange]);

    const handlePageClick = useCallback(
      (page: number) => {
        if (page !== currentPage) {
          onPageChange(page);
        }
      },
      [currentPage, onPageChange]
    );

    // Calculate visible range for screen readers
    const startItem = useMemo(() => {
      if (!totalCount || totalCount === 0 || !pageSize) return 0;
      return (currentPage - 1) * pageSize + 1;
    }, [currentPage, pageSize, totalCount]);

    const endItem = useMemo(() => {
      if (!totalCount || totalCount === 0 || !pageSize) return 0;
      return Math.min(currentPage * pageSize, totalCount);
    }, [currentPage, pageSize, totalCount]);

    // Don't render if there's only one page or no items
    if (totalPages <= 1 || !paginationRange || paginationRange.length === 0) {
      return null;
    }

    const sizeClasses = {
      sm: 'h-8 w-8 text-sm',
      default: 'h-9 w-9',
      lg: 'h-10 w-10 text-lg',
    };

    const buttonSize = size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'icon';

    return (
      <div className={cn('mt-12 space-y-4', className)}>
        {/* Page Information */}
        {showPageInfo && totalCount > 0 && (
          <div className='flex justify-center'>
            <p
              className='text-sm text-muted-foreground'
              aria-live='polite'
              role='status'
            >
              Showing{' '}
              <span className='font-medium text-foreground'>
                {startItem.toLocaleString()}
              </span>{' '}
              to{' '}
              <span className='font-medium text-foreground'>
                {endItem.toLocaleString()}
              </span>{' '}
              of{' '}
              <span className='font-medium text-foreground'>
                {totalCount.toLocaleString()}
              </span>{' '}
              products
            </p>
          </div>
        )}

        {/* Pagination Navigation */}
        <nav
          role='navigation'
          aria-label={ariaLabel}
          className='flex justify-center'
        >
          <div className='flex items-center gap-1 sm:gap-2'>
            {/* First Page Button */}
            {showFirstLast && (
              <Button
                variant='outline'
                size={buttonSize}
                onClick={handleFirst}
                disabled={currentPage === 1}
                aria-label='Go to first page'
                className={cn(
                  'transition-all duration-200 hover:scale-105',
                  sizeClasses[size]
                )}
              >
                <ChevronsLeft
                  className={cn(
                    size === 'sm'
                      ? 'h-3 w-3'
                      : size === 'lg'
                      ? 'h-5 w-5'
                      : 'h-4 w-4'
                  )}
                />
              </Button>
            )}

            {/* Previous Page Button */}
            <Button
              variant='outline'
              size={buttonSize}
              onClick={handlePrevious}
              disabled={currentPage === 1}
              aria-label='Go to previous page'
              className={cn(
                'transition-all duration-200 hover:scale-105',
                sizeClasses[size]
              )}
            >
              <ChevronLeft
                className={cn(
                  size === 'sm'
                    ? 'h-3 w-3'
                    : size === 'lg'
                    ? 'h-5 w-5'
                    : 'h-4 w-4'
                )}
              />
            </Button>

            {/* Page Numbers */}
            {paginationRange.map((pageNumber, index) =>
              pageNumber === DOTS ? (
                <div
                  key={`dots-${index}`}
                  className={cn(
                    'flex items-center justify-center text-muted-foreground',
                    sizeClasses[size]
                  )}
                  aria-hidden='true'
                >
                  <MoreHorizontal
                    className={cn(
                      size === 'sm'
                        ? 'h-3 w-3'
                        : size === 'lg'
                        ? 'h-5 w-5'
                        : 'h-4 w-4'
                    )}
                  />
                </div>
              ) : (
                <Button
                  key={`page-${pageNumber}`}
                  variant={currentPage === pageNumber ? 'default' : 'outline'}
                  size={buttonSize}
                  onClick={() => handlePageClick(pageNumber as number)}
                  aria-current={currentPage === pageNumber ? 'page' : undefined}
                  aria-label={
                    currentPage === pageNumber
                      ? `Current page, page ${pageNumber}`
                      : `Go to page ${pageNumber}`
                  }
                  className={cn(
                    'transition-all duration-200 min-w-0 font-medium',
                    sizeClasses[size],
                    currentPage === pageNumber
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg'
                      : 'bg-background text-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  {pageNumber}
                </Button>
              )
            )}

            {/* Next Page Button */}
            <Button
              variant='outline'
              size={buttonSize}
              onClick={handleNext}
              disabled={currentPage === lastPage}
              aria-label='Go to next page'
              className={cn(
                'transition-all duration-200 hover:scale-105',
                sizeClasses[size]
              )}
            >
              <ChevronRight
                className={cn(
                  size === 'sm'
                    ? 'h-3 w-3'
                    : size === 'lg'
                    ? 'h-5 w-5'
                    : 'h-4 w-4'
                )}
              />
            </Button>

            {/* Last Page Button */}
            {showFirstLast && (
              <Button
                variant='outline'
                size={buttonSize}
                onClick={handleLast}
                disabled={currentPage === lastPage}
                aria-label='Go to last page'
                className={cn(
                  'transition-all duration-200 hover:scale-105',
                  sizeClasses[size]
                )}
              >
                <ChevronsRight
                  className={cn(
                    size === 'sm'
                      ? 'h-3 w-3'
                      : size === 'lg'
                      ? 'h-5 w-5'
                      : 'h-4 w-4'
                  )}
                />
              </Button>
            )}
          </div>
        </nav>

        {/* Screen Reader Only Summary */}
        <div className='sr-only' aria-live='polite' role='status'>
          Page {currentPage} of {totalPages}
        </div>
      </div>
    );
  }
);

ProductGridPagination.displayName = 'ProductGridPagination';

export { DOTS, ProductGridPagination, usePagination };
export type { ProductGridPaginationProps, UsePaginationProps };
