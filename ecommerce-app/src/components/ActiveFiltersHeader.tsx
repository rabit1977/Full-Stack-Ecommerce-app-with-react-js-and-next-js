import { Badge } from '@/components/ui/badge';

interface ActiveFiltersHeaderProps {
  count: number;
  show: boolean;
}

export const ActiveFiltersHeader = ({ count, show }: ActiveFiltersHeaderProps) => {
  if (!show || count === 0) return null;

  return (
    <div className='mb-4 flex items-center justify-between rounded-lg border bg-muted/50 px-4 py-2'>
      <span className='text-sm font-medium'>Active Filters</span>
      <Badge variant='secondary' className='font-semibold'>
        {count}
      </Badge>
    </div>
  );
};