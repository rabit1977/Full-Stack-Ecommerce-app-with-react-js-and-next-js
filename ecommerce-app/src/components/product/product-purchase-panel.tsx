// =======================
// ✅ FIXED CLIENT COMPONENT
// =======================
'use client';

import { addItemToCartAction } from '@/actions/cart-actions';
import { toggleWishlistAction } from '@/actions/wishlist-actions';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Product } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Heart } from 'lucide-react';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { Label } from '../ui/label';

interface ProductPurchasePanelProps {
  product: Product;
  selectedOptions: Record<string, string>;
  onOptionChange: (name: string, value: string) => void;
  initialIsWished: boolean;
  initialQuantityInCart: number;
}

export function ProductPurchasePanel({
  product,
  selectedOptions,
  onOptionChange,
  initialIsWished,
  initialQuantityInCart,
}: ProductPurchasePanelProps) {
  const [isPending, startTransition] = useTransition();
  const [quantity, setQuantity] = useState(
    initialQuantityInCart > 0 ? initialQuantityInCart : 1,
  );
  const [isWished, setIsWished] = useState(initialIsWished);

  const handleAddToCart = () => {
    startTransition(async () => {
      const result = await addItemToCartAction(
        product.id,
        quantity,
        selectedOptions,
      );

      if (result.success) {
        toast.success(result.message ?? 'Added to cart');
      } else {
        toast.error(result.message ?? 'Failed to add to cart');
      }
    });
  };

  const handleToggleWishlist = () => {
    startTransition(async () => {
      const result = await toggleWishlistAction(product.id);

      if (!result.success) {
        toast.error(result.error ?? 'Wishlist update failed');
        return;
      }

      // ✅ derive wished state from server response
      const wished = result.wishlist.includes(product.id);
      setIsWished(wished);

      toast.success(wished ? 'Added to wishlist' : 'Removed from wishlist');
    });
  };

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(product.price);

  return (
    <div className='flex flex-col gap-4'>
      <h1 className='text-3xl font-bold'>{product.title}</h1>

      <p className='text-xl text-gray-700 dark:text-gray-300'>
        {formattedPrice}
      </p>

      <p className='text-sm text-gray-500 dark:text-gray-400'>
        {product.description}
      </p>

      {/* Options */}
      {Array.isArray(product.options) &&
        product.options.map((option) => (
          <div key={option.name} className='flex flex-col gap-2'>
            <Label>{option.name}</Label>
            <Select
              value={selectedOptions[option.name]}
              onValueChange={(value) => onOptionChange(option.name, value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={`Select ${option.name}`} />
              </SelectTrigger>
              <SelectContent>
                {option.variants.map((variant) => (
                  <SelectItem key={variant.value} value={variant.value}>
                    {variant.value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}

      {/* Quantity */}
      <div className='flex items-center gap-2'>
        <Label>Quantity</Label>
        <Select
          value={String(quantity)}
          onValueChange={(val) => setQuantity(Number(val))}
        >
          <SelectTrigger className='w-20'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 10 }, (_, i) => i + 1).map((i) => (
              <SelectItem key={i} value={String(i)}>
                {i}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Actions */}
      <div className='flex gap-2'>
        <Button
          onClick={handleAddToCart}
          disabled={isPending}
          className='flex-1'
        >
          {isPending ? 'Adding…' : 'Add to Cart'}
        </Button>

        <Button
          variant='outline'
          onClick={handleToggleWishlist}
          disabled={isPending}
        >
          <Heart
            className={cn('mr-2 transition', {
              'fill-red-500 text-red-500': isWished,
            })}
          />
          {isPending ? '...' : isWished ? 'In Wishlist' : 'Add to Wishlist'}
        </Button>
      </div>
    </div>
  );
}
