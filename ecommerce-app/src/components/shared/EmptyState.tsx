import { FilterX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  hasFilters: boolean;
  onClearFilters: () => void;
}

export const EmptyState = ({ hasFilters, onClearFilters }: EmptyStateProps) => {
  return (
    <div className='flex flex-col items-center justify-center py-16 text-center'>
      <div className='rounded-full bg-muted p-4 mb-4'>
        <FilterX className='h-8 w-8 text-muted-foreground' />
      </div>
      <h3 className='text-lg font-semibold mb-2'>No products found</h3>
      <p className='text-sm text-muted-foreground mb-4 max-w-md'>
        Try adjusting your filters or search criteria to find what you&apos;re
        looking for.
      </p>
      {hasFilters && (
        <Button onClick={onClearFilters} variant='outline'>
          Clear All Filters
        </Button>
      )}
    </div>
  );
};