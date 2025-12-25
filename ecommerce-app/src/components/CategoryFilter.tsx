import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';

interface CategoryFilterProps {
  categories: string[];
  selectedCategories: Set<string>;
  onCategoryToggle: (category: string, checked: boolean) => void;
  isPending: boolean;
  showFilterCount?: boolean;
}

/**
 * Format category label for display
 */
const formatCategoryLabel = (category: string): string => {
  // Capitalize first letter of each word
  return category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * CategoryFilter - Multi-select category filter with checkbox options
 * 
 * Features:
 * - Multiple category selection with checkboxes
 * - Shows active filter count badge
 * - "All Categories" button to clear all selections
 * - Disabled state during pending operations
 * - Accessible with ARIA labels
 */
export const CategoryFilter = ({
  categories,
  selectedCategories,
  onCategoryToggle,
  isPending,
  showFilterCount = true,
}: CategoryFilterProps) => {
  // Calculate active filter count
  const activeFilterCount = useMemo(() => {
    return selectedCategories.size;
  }, [selectedCategories]);

  // Should show the filter count badge
  const shouldShowBadge = showFilterCount && activeFilterCount > 0;

  // Check if all categories are selected (or none)
  const isShowingAll = selectedCategories.size === 0;

  // Handle "All Categories" button click
  const handleShowAll = () => {
    // Clear all selections by unchecking all selected categories
    selectedCategories.forEach(category => {
      onCategoryToggle(category, false);
    });
  };

  return (
    <AccordionItem value='category'>
      <AccordionTrigger
        className={cn(
          'text-lg font-medium hover:no-underline',
          isPending && 'opacity-50 cursor-not-allowed'
        )}
        disabled={isPending}
      >
        <div className='flex items-center gap-2'>
          <span>Category</span>
          {shouldShowBadge && (
            <Badge 
              variant='default' 
              className='h-5 px-1.5 text-xs'
              aria-label={`${activeFilterCount} ${activeFilterCount === 1 ? 'category' : 'categories'} selected`}
            >
              {activeFilterCount}
            </Badge>
          )}
        </div>
      </AccordionTrigger>
      
      <AccordionContent>
        <div
          className='space-y-2 pt-2'
          role='group'
          aria-label='Category filters'
        >
          {/* All Categories Button */}
          <Button
            variant={isShowingAll ? 'default' : 'ghost'}
            onClick={handleShowAll}
            className={cn(
              'w-full justify-start font-normal transition-all',
              isShowingAll && 'font-medium shadow-sm'
            )}
            disabled={isPending}
            aria-label='Show all categories'
          >
            All Categories
          </Button>

          {/* Individual Category Checkboxes */}
          <div className='space-y-1.5 pt-1'>
            {categories
              .filter(cat => cat !== 'all') // Exclude 'all' from checkbox list
              .map((category) => {
                const isChecked = selectedCategories.has(category);
                const label = formatCategoryLabel(category);

                return (
                  <label
                    key={category}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors',
                      'hover:bg-accent',
                      isPending && 'cursor-not-allowed opacity-50',
                      isChecked && 'bg-accent'
                    )}
                    aria-label={`${isChecked ? 'Unselect' : 'Select'} ${label} category`}
                  >
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={(checked) => 
                        onCategoryToggle(category, checked as boolean)
                      }
                      disabled={isPending}
                      aria-label={label}
                    />
                    <span className='text-sm flex-1'>{label}</span>
                  </label>
                );
              })}
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};