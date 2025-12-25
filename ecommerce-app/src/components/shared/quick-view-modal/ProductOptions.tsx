import { Alert, AlertDescription } from '@/components/ui/alert';
import { ProductOptionsProps } from '@/lib/types/quickview';
import { cn } from '@/lib/utils';
import { AlertCircle, Check } from 'lucide-react';

export const ProductOptions = ({
  options,
  selectedOptions,
  onOptionChange,
  validationError,
}: ProductOptionsProps) => {
  if (!options || options.length === 0) return null;

  return (
    <div className='space-y-4'>
      {validationError && (
        <Alert variant='destructive'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>{validationError}</AlertDescription>
        </Alert>
      )}

      {options.map((option) => {
        const isSelected = !!selectedOptions[option.name];
        const hasError = validationError && !isSelected;

        return (
          <div key={option.name}>
            <h3
              className={cn(
                'text-sm font-semibold mb-2 flex items-center gap-2',
                hasError && 'text-destructive'
              )}
            >
              {option.name}
              <span className='text-destructive'>*</span>
              {selectedOptions[option.name] && (
                <span className='ml-2 font-normal text-muted-foreground'>
                  {selectedOptions[option.name]}
                </span>
              )}
            </h3>
            <div className='flex flex-wrap gap-2'>
              {option.variants.map((variant) => {
                const isVariantSelected =
                  selectedOptions[option.name] === variant.value;

                return (
                  <button
                    key={variant.value}
                    type='button'
                    onClick={() => onOptionChange(option.name, variant.value)}
                    className={cn(
                      'relative flex items-center justify-center rounded-md transition-all',
                      'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                      option.type === 'color'
                        ? 'h-10 w-10'
                        : 'h-10 px-4 text-sm font-medium border-2',
                      isVariantSelected
                        ? option.type === 'color'
                          ? 'ring-2 ring-primary ring-offset-2'
                          : 'border-primary bg-primary text-primary-foreground'
                        : option.type === 'color'
                        ? 'ring-1 ring-muted'
                        : 'border-muted hover:border-primary/50',
                      hasError &&
                        !isVariantSelected &&
                        'ring-2 ring-destructive/50'
                    )}
                    title={variant.name || variant.value}
                  >
                    {option.type === 'color' ? (
                      <>
                        <span
                          className='h-full w-full rounded-md block'
                          style={{ backgroundColor: variant.value }}
                        />
                        {isVariantSelected && (
                          <Check className='absolute h-4 w-4 text-white drop-shadow-md' />
                        )}
                      </>
                    ) : (
                      <span>{variant.name}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
