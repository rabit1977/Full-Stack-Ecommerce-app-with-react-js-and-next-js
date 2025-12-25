import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { MAX_PRICE } from '@/lib/constants/filter';
import { PriceFilterProps } from '@/lib/types/filter';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/utils/formatters';

export const PriceFilter = ({
  localPriceRange,
  onValueChange,
  onValueCommit,
  isPending,
  showFilterCount,
  isActive,
}: PriceFilterProps) => {
  return (
    <AccordionItem value='price'>
      <AccordionTrigger
        className={cn(
          'text-lg font-medium hover:no-underline',
          isPending && 'opacity-50'
        )}
      >
        <div className='flex items-center gap-2'>
          <span>Price</span>
          {isActive && showFilterCount && (
            <Badge variant='default' className='h-5 px-1.5 text-xs'>
              1
            </Badge>
          )}
        </div>
      </AccordionTrigger>
      <AccordionContent className='pt-4'>
        <div className='space-y-4' role='group' aria-label='Price range filter'>
          {/* Price Range Display */}
          <div className='flex items-center justify-between text-sm font-medium'>
            <span className='rounded-md bg-muted px-2.5 py-1'>
              {formatPrice(localPriceRange[0])}
            </span>
            <span className='text-muted-foreground'>to</span>
            <span className='rounded-md bg-muted px-2.5 py-1'>
              {formatPrice(localPriceRange[1])}
            </span>
          </div>

          {/* Price Slider */}
          <Slider
            min={0}
            max={MAX_PRICE}
            step={10}
            value={localPriceRange}
            onValueChange={onValueChange}
            onValueCommit={onValueCommit}
            disabled={isPending}
            className={cn(isPending && 'opacity-50')}
            aria-label={`Price range from ${formatPrice(
              localPriceRange[0]
            )} to ${formatPrice(localPriceRange[1])}`}
          />

          {/* Min/Max Labels */}
          <div className='flex justify-between text-xs text-muted-foreground'>
            <span>{formatPrice(0)}</span>
            <span>{formatPrice(MAX_PRICE)}</span>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
