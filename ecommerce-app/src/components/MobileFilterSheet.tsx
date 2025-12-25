import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { FilterX, X } from 'lucide-react';

interface MobileFilterSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  activeFiltersCount: number;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  isPending: boolean;
  children: React.ReactNode;
}

/**
 * MobileFilterSheet - Mobile sidebar for product filters
 * 
 * Features:
 * - Real-time filter application (no "Apply" button needed)
 * - Clear all filters action
 * - Active filter count badge
 * - Responsive width
 * - Loading state support
 */
export const MobileFilterSheet = ({
  isOpen,
  onOpenChange,
  activeFiltersCount,
  hasActiveFilters,
  onClearFilters,
  isPending,
  children,
}: MobileFilterSheetProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side='left'
        className='w-[85%] sm:w-[350px] p-0 flex flex-col'
      >
        {/* Header */}
        <SheetHeader className='p-4 border-b dark:border-slate-800'>
          <div className='flex items-center justify-between'>
            <div className='space-y-1'>
              <SheetTitle className='flex items-center gap-2'>
                Filters
                {hasActiveFilters && (
                  <Badge
                    variant='secondary'
                    className='font-semibold'
                  >
                    {activeFiltersCount}
                  </Badge>
                )}
              </SheetTitle>
              <SheetDescription>
                {hasActiveFilters 
                  ? `${activeFiltersCount} filter${activeFiltersCount !== 1 ? 's' : ''} applied`
                  : 'Refine your product search'
                }
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {/* Filter Content */}
        <div className='flex-1 overflow-y-auto p-4'>
          {children}
        </div>

        {/* Footer Actions */}
        <div className='border-t dark:border-slate-800 p-4 space-y-2'>
          {/* Clear Filters Button - Only show when filters are active */}
          {hasActiveFilters && (
            <Button
              variant='outline'
              className='w-full'
              onClick={onClearFilters}
              disabled={isPending}
            >
              <FilterX className='h-4 w-4 mr-2' />
              Clear All Filters
            </Button>
          )}
          
          {/* Close Button */}
          <Button
            variant={hasActiveFilters ? 'default' : 'outline'}
            className='w-full'
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            <X className='h-4 w-4 mr-2' />
            Close
          </Button>
          
          {/* Info text */}
          <p className='text-xs text-center text-muted-foreground pt-2'>
            Filters apply automatically
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
};