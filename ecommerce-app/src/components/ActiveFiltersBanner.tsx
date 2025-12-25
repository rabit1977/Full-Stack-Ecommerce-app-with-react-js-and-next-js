import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FilterX } from 'lucide-react';

interface ActiveFiltersBannerProps {
  count: number;
  onClear: () => void;
  disabled?: boolean;
}

export const ActiveFiltersBanner = ({
  count,
  onClear,
  disabled,
}: ActiveFiltersBannerProps) => {
  return (
    <div className='mb-6 flex items-center justify-between rounded-lg border bg-card p-4 shadow-sm'>
      <div className='flex items-center gap-2'>
        <span className='text-sm font-medium'>Active Filters:</span>
        <Badge variant='secondary' className='font-semibold'>
          {count}
        </Badge>
      </div>
      <Button
        variant='ghost'
        size='sm'
        onClick={onClear}
        className='gap-2'
        disabled={disabled}
      >
        <FilterX className='h-4 w-4' />
        Clear All
      </Button>
    </div>
  );
};
