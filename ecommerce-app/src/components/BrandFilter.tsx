import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { BrandFilterProps } from '@/lib/types/filter';
import { cn } from '@/lib/utils';

export const BrandFilter = ({
  brands,
  selectedBrands,
  onBrandToggle,
  isPending,
  showFilterCount,
}: BrandFilterProps) => {
  const selectedBrandsCount = selectedBrands.size;

  return (
    <AccordionItem value='brands'>
      <AccordionTrigger
        className={cn(
          'text-lg font-medium hover:no-underline',
          isPending && 'opacity-50'
        )}
      >
        <div className='flex items-center gap-2'>
          <span>Brand</span>
          {selectedBrandsCount > 0 && showFilterCount && (
            <Badge variant='default' className='h-5 px-1.5 text-xs'>
              {selectedBrandsCount}
            </Badge>
          )}
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div
          className='grid grid-cols-1 gap-3 pt-2'
          role='group'
          aria-label='Brand filters'
        >
          {brands.map((brand) => {
            const isChecked = selectedBrands.has(brand);
            const checkboxId = `brand-${brand}`;

            return (
              <div key={brand} className='flex items-center gap-3 group'>
                <Checkbox
                  id={checkboxId}
                  checked={isChecked}
                  onCheckedChange={(checked) =>
                    onBrandToggle(brand, checked as boolean)
                  }
                  disabled={isPending}
                  className='transition-all'
                />
                <Label
                  htmlFor={checkboxId}
                  className={cn(
                    'flex-1 cursor-pointer text-sm font-normal transition-colors',
                    'group-hover:text-foreground',
                    isChecked && 'font-medium',
                    isPending && 'cursor-not-allowed opacity-50'
                  )}
                >
                  {brand}
                </Label>
              </div>
            );
          })}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};