import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { QuantitySelectorProps } from '@/lib/types/quickview';

export const QuantitySelector = ({
  quantity,
  maxStock,
  onQuantityChange,
  disabled = false,
}: QuantitySelectorProps) => {
  const handleInputChange = (value: string) => {
    const num = parseInt(value, 10);
    if (!isNaN(num)) {
      onQuantityChange(num);
    }
  };

  return (
    <div className='flex items-center gap-2'>
      <span className='text-sm font-medium'>Quantity:</span>
      <div className='flex items-center border rounded-md'>
        <Button
          variant='ghost'
          size='icon'
          onClick={() => onQuantityChange(quantity - 1)}
          disabled={disabled || quantity <= 1}
          className='h-9 w-9'
        >
          <Minus className='h-4 w-4' />
        </Button>
        <Input
          type='number'
          min={1}
          max={maxStock}
          value={quantity}
          onChange={(e) => handleInputChange(e.target.value)}
          disabled={disabled}
          className='h-9 w-16 border-0 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
        />
        <Button
          variant='ghost'
          size='icon'
          onClick={() => onQuantityChange(quantity + 1)}
          disabled={disabled || quantity >= maxStock}
          className='h-9 w-9'
        >
          <Plus className='h-4 w-4' />
        </Button>
      </div>
      <span className='text-xs text-muted-foreground'>
        {maxStock} available
      </span>
    </div>
  );
};