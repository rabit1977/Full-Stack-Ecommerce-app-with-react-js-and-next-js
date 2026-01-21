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
import { Separator } from '@/components/ui/separator';
import { ProductWithImages } from '@/lib/types/product';
import { cn } from '@/lib/utils';
import { Heart, ShoppingCart } from 'lucide-react';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { Label } from '../ui/label';

interface ProductPurchasePanelProps {
  product: ProductWithImages;
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
    <div className='flex flex-col gap-6 sm:gap-8'>
      <div className='space-y-4'>
        <h1 className='leading-tight'>{product.title}</h1>

        <div className='flex items-center gap-4'>
          <p className='text-2xl sm:text-3xl font-bold text-primary'>
            {formattedPrice}
          </p>
          {product.discount && product.discount > 0 && (
            <span className='px-2 py-1 rounded-md bg-red-100 text-red-600 dark:bg-red-950/30 dark:text-red-400 text-sm font-bold'>
              -{product.discount}% OFF
            </span>
          )}
        </div>

        <p className='text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl'>
          {product.description}
        </p>
      </div>

      <Separator />

      {/* Options */}
      <div className='space-y-6'>
        {Array.isArray(product.options) &&
          product.options.map((option) => (
            <div key={option.name} className='flex flex-col gap-3'>
              <Label className='text-sm font-semibold uppercase tracking-wider text-muted-foreground'>
                {option.name}
              </Label>
              <Select
                value={selectedOptions[option.name]}
                onValueChange={(value) => onOptionChange(option.name, value)}
              >
                <SelectTrigger className='h-12 w-full sm:max-w-xs'>
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
        <div className='flex flex-col gap-3'>
          <Label className='text-sm font-semibold uppercase tracking-wider text-muted-foreground'>
            Quantity
          </Label>
          <div className='flex items-center gap-4'>
            <Select
              value={String(quantity)}
              onValueChange={(val) => setQuantity(Number(val))}
            >
              <SelectTrigger className='h-12 w-24'>
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
            
            <p className='text-sm text-muted-foreground italic'>
              {product.stock > 0 ? `${product.stock} items available` : 'Currently out of stock'}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className='flex flex-col sm:flex-row gap-3 pt-4'>
        <Button
          size='lg'
          onClick={handleAddToCart}
          disabled={isPending || product.stock === 0}
          className='flex-1 h-14 text-lg font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-95 transition-all'
        >
          {isPending ? (
            <div className='h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent mr-2' />
          ) : (
            <ShoppingCart className='mr-2 h-5 w-5' />
          )}
          {isPending ? 'Adding to Cart...' : 'Add to Cart'}
        </Button>

        <Button
          size='lg'
          variant='outline'
          onClick={handleToggleWishlist}
          disabled={isPending}
          className='h-14 px-8 text-lg font-semibold border-2 active:scale-95 transition-all'
        >
          <Heart
            className={cn('mr-2 h-5 w-5 transition-all', {
              'fill-red-500 text-red-500': isWished,
            })}
          />
          <span className='sr-only'>{isWished ? 'Remove from Wishlist' : 'Add to Wishlist'}</span>
          {isWished ? 'In Wishlist' : 'Wishlist'}
        </Button>
      </div>
    </div>

  );
}
