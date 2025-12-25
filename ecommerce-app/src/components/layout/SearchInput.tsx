import { Input } from '@/components/ui/input';
import { Loader2, Search, X } from 'lucide-react';

interface SearchInputProps {
  ref?: React.Ref<HTMLInputElement>;
  value: string;
  onChange: (value: string) => void;
  onFocus: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onClear: () => void;
  isPending: boolean;
  showResults: boolean;
}

export const SearchInput = ({
  ref,
  value,
  onChange,
  onFocus,
  onKeyDown,
  onClear,
  isPending,
  showResults,
}: SearchInputProps) => {
  return (
    <div className='relative'>
      <Input
        ref={ref}
        type='search'
        placeholder='Search products...'
        className='pr-10 pl-10 [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden'
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        disabled={isPending}
        aria-label='Search products'
        aria-expanded={showResults}
        aria-autocomplete='list'
        aria-controls={showResults ? 'search-results' : undefined}
      />

      <Search className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />

      {value && (
        <button
          onClick={onClear}
          disabled={isPending}
          aria-label='Clear search'
          className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50'
        >
          {isPending ? (
            <Loader2 className='h-4 w-4 animate-spin' />
          ) : (
            <X className='h-4 w-4' />
          )}
        </button>
      )}
    </div>
  );
};

SearchInput.displayName = 'SearchInput';
