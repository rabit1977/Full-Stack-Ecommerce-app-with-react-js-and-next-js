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
import { Heart, Minus, Plus, ShoppingCart } from 'lucide-react';
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
    <div className='glass-card p-6 sm:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700'>
      <div className='space-y-4'>
        <h1 className='text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground leading-tight'>
          {product.title}
        </h1>

        <div className='flex items-baseline gap-4 flex-wrap'>
          <p className='text-4xl sm:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary to-violet-600'>
            {formattedPrice}
          </p>
          {product.discount && product.discount > 0 && (
            <div className='flex items-center gap-2'>
              <span className='text-xl text-muted-foreground line-through font-medium'>
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(product.price / (1 - product.discount/100))}
              </span>
              <span className='px-3 py-1 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 text-sm font-bold border border-red-500/20 shadow-sm'>
                {product.discount}% OFF
              </span>
            </div>
          )}
        </div>

        <p className='text-lg text-muted-foreground leading-relaxed'>
          {product.description}
        </p>
      </div>

      <Separator className='bg-border/60' />

      {/* Options */}
      <div className='space-y-6'>
        {Array.isArray(product.options) &&
          product.options.map((option) => (
            <div key={option.name} className='space-y-3'>
              <div className='flex justify-between items-center'>
                <Label className='text-sm font-semibold uppercase tracking-wider text-muted-foreground'>
                  {option.name}
                </Label>
                <span className='text-sm font-medium text-foreground'>
                  {selectedOptions[option.name]}
                </span>
              </div>
              <Select
                value={selectedOptions[option.name]}
                onValueChange={(value) => onOptionChange(option.name, value)}
              >
                <SelectTrigger className='h-12 w-full rounded-xl border-border/60 bg-secondary/30 hover:bg-secondary/50 transition-colors focus:ring-2 focus:ring-primary/20 font-medium'>
                  <SelectValue placeholder={`Select ${option.name}`} />
                </SelectTrigger>
                <SelectContent className='rounded-xl border-border/60 backdrop-blur-xl'>
                  {option.variants.map((variant) => (
                    <SelectItem 
                      key={variant.value} 
                      value={variant.value}
                      className='focus:bg-primary/10 py-3 cursor-pointer'
                    >
                      {variant.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
      </div>

      {/* Actions */}
      <div className='space-y-4 pt-2'>
        <div className='flex flex-col sm:flex-row gap-4'>
           {/* Quantity Stepper */}
           <div className='flex items-center justify-between border border-border/60 bg-secondary/30 rounded-full h-14 px-1 shrink-0 min-w-[140px]'>
              <Button
                variant='ghost'
                size='icon'
                className='h-11 w-11 rounded-full hover:bg-background shadow-sm transition-all'
                disabled={quantity <= 1 || isPending}
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                <Minus className='h-4 w-4' />
              </Button>
              <span className='text-lg font-bold tabular-nums w-8 text-center'>
                {quantity}
              </span>
              <Button
                variant='ghost'
                size='icon'
                className='h-11 w-11 rounded-full hover:bg-background shadow-sm transition-all'
                disabled={quantity >= product.stock || isPending}
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
              >
                <Plus className='h-4 w-4' />
              </Button>
           </div>
           
           <Button
             size='icon'
             variant='outline'
             onClick={handleToggleWishlist}
             disabled={isPending}
             className='h-14 w-14 rounded-full border border-border/60 hover:bg-secondary/50 hover:border-primary/30 transition-all shrink-0'
             title={isWished ? 'Remove from Wishlist' : 'Add to Wishlist'}
           >
             <Heart
               className={cn('h-6 w-6 transition-all duration-300', {
                 'fill-red-500 text-red-500 scale-110': isWished,
                 'text-muted-foreground': !isWished
               })}
             />
           </Button>
        </div>

        <Button
          size='lg'
          onClick={handleAddToCart}
          disabled={isPending || product.stock === 0}
          className='w-full h-16 text-lg font-bold rounded-2xl btn-premium btn-glow shadow-xl shadow-primary/25 hover:shadow-primary/40'
        >
          {isPending ? (
            <div className='h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white mr-3' />
          ) : (
            <ShoppingCart className='mr-3 h-5 w-5' />
          )}
          {isPending ? 'Adding to Cart...' : 'Add to Cart — ' + new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(product.price * quantity)}
        </Button>
      </div>

      {/* Stock Status */}
      <div className='flex items-center gap-3 text-sm pt-2'>
          {product.stock > 10 ? (
             <div className='flex items-center text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-500/10 px-3 py-1.5 rounded-full'>
               <div className='h-2 w-2 rounded-full bg-emerald-500 mr-2 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse'/>
               In Stock & Ready to Ship
             </div>
          ) : product.stock > 0 ? (
            <div className='flex items-center text-amber-600 dark:text-amber-400 font-medium bg-amber-500/10 px-3 py-1.5 rounded-full'>
               <div className='h-2 w-2 rounded-full bg-amber-500 mr-2 shadow-[0_0_8px_rgba(245,158,11,0.5)] animate-pulse'/>
               Low Stock - Only {product.stock} left
            </div>
          ) : (
            <div className='flex items-center text-red-600 dark:text-red-400 font-medium bg-red-500/10 px-3 py-1.5 rounded-full'>
               <div className='h-2 w-2 rounded-full bg-red-500 mr-2'/>
               Out of Stock
            </div>
          )}
          {product.stock > 0 && (
            <span className='text-xs text-muted-foreground'>
              Free shipping on all orders
            </span>
          )}
      </div>
    </div>

  );
}
