'use client';

import { Button } from '@/components/ui/button';
import { SortKey } from '@/lib/types';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';
import { useMemo } from 'react';

interface ProductGridControlsProps {
  title: string;
  subtitle: string;
  currentSort: SortKey;
  onSortChange: (sort: string) => void;
  onFilterToggle: () => void; // For mobile
}

const ProductGridControls = ({
  title,
  subtitle,
  currentSort,
  onSortChange,
  onFilterToggle,
}: ProductGridControlsProps) => {
  const sortOptions = useMemo(
    () => [
      { value: 'featured', label: 'Sort: Featured' },
      { value: 'price-asc', label: 'Sort: Price Low to High' },
      { value: 'price-desc', label: 'Sort: Price High to Low' },
      { value: 'rating', label: 'Sort: Highest Rated' },
      { value: 'newest', label: 'Sort: Newest' },
    ],
    []
  );

  return (
    <div className='flex flex-col lg:flex-row justify-between mb-8'>
      <div className='flex lg:block gap-3 items-center mb-4'>
        <h2 className='text-lg md:text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 dark:text-white'>
          {title}
        </h2>
        <p className='mt-2 text-sm md:text-base lg:text-lg text-slate-600 dark:text-slate-300'>
          {subtitle}
        </p>
      </div>
      <div className='flex items-center gap-4 justify-between'>
        {/* Mobile Filter Button */}
        <Button
          variant='outline'
          className='lg:hidden text-xs lg:text-base flex items-center gap-2'
          onClick={onFilterToggle}
        >
          <SlidersHorizontal className='h-4 w-4' />
          <span>Filters</span>
        </Button>

        {/* Sort Dropdown */}
        <div className='relative text-xs lg:text-base flex items-center gap-2'>
          <select
            value={currentSort}
            onChange={(e) => onSortChange(e.target.value)}
            className='h-10 cursor-pointer appearance-none rounded-md border border-slate-300 bg-white py-2 pl-3 pr-10 focus:border-slate-500 focus:outline-none focus:ring-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400'
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className='pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' />
        </div>
      </div>
    </div>
  );
};

export { ProductGridControls };
