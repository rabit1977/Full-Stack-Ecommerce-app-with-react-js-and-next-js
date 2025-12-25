import { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { SearchResultItem } from './SearchResultItem';

interface SearchDropdownProps {
  isLoading: boolean;
  results: Product[];
  inputValue: string;
  onProductSelect: () => void;
  onViewAll: () => void;
  onResultKeyDown: (e: React.KeyboardEvent<HTMLAnchorElement>, index: number) => void;
  isPending: boolean;
}

export const SearchDropdown = ({
  isLoading,
  results,
  inputValue,
  onProductSelect,
  onViewAll,
  onResultKeyDown,
  isPending,
}: SearchDropdownProps) => {
  return (
    <div
      id='search-results'
      role='listbox'
      className='absolute left-0 right-0 top-full z-50 mt-2 rounded-lg border bg-background shadow-lg max-h-[400px] overflow-auto'
    >
      {isLoading ? (
        <div className='flex items-center justify-center p-8'>
          <Loader2 className='h-6 w-6 animate-spin text-muted-foreground' />
        </div>
      ) : results.length > 0 ? (
        <>
          <ul className='p-2'>
            {results.map((product, index) => (
              <SearchResultItem
                key={product.id}
                product={product}
                index={index}
                onSelect={onProductSelect}
                onKeyDown={onResultKeyDown}
              />
            ))}
          </ul>

          <div className='border-t p-2'>
            <Button
              variant='ghost'
              size='sm'
              onClick={onViewAll}
              disabled={isPending}
              className='w-full justify-center'
            >
              View all results for "{inputValue}"
            </Button>
          </div>
        </>
      ) : (
        <div className='p-8 text-center'>
          <p className='text-sm text-muted-foreground'>
            No results found for "{inputValue}"
          </p>
          <p className='text-xs text-muted-foreground mt-1'>
            Try adjusting your search terms
          </p>
        </div>
      )}
    </div>
  );
};
