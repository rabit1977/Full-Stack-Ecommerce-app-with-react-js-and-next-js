import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { CartItemWithProduct } from '@/lib/types/cart';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/utils/formatters';
import { getProductImage } from '@/lib/utils/product-images';
import { Bookmark, Minus, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface CartItemProps {
  item: CartItemWithProduct;
  onUpdateQuantity: (cartItemId: string, quantity: number) => void;
  onRemove: (cartItemId: string) => void;
  onSaveForLater: (cartItemId: string) => void;
  isPending: boolean;
}

export const CartItem = React.memo(
  ({
    item,
    onUpdateQuantity,
    onRemove,
    onSaveForLater,
    isPending,
  }: CartItemProps) => {
    const handleQuantityDecrease = () => {
      onUpdateQuantity(item.id, item.quantity - 1);
    };

    const handleQuantityIncrease = () => {
      onUpdateQuantity(item.id, item.quantity + 1);
    };

    const handleSaveForLater = () => {
      onSaveForLater(item.id);
    };

    const handleRemove = () => {
      onRemove(item.id);
    };

    const options = item.selectedOptions || {};

    return (
      <li className='group p-3 sm:p-6'>
        {/* Mobile Layout: Image left, info right */}
        <div className='flex gap-3 sm:gap-6'>
          {/* Product Image */}
          <div className='relative h-20 w-20 sm:h-28 sm:w-28 md:h-36 md:w-36 shrink-0 overflow-hidden rounded-xl border border-border bg-muted'>
            <Image
              src={getProductImage(item.product)}
              alt={item.product.title}
              fill
              className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
            />
          </div>

          {/* Product Details */}
          <div className='flex-1 min-w-0 flex flex-col'>
            {/* Title + Price Row */}
            <div className='flex items-start justify-between gap-2'>
              <h3 className='text-sm sm:text-base font-semibold text-foreground line-clamp-2'>
                <Link
                  href={`/products/${item.productId}`}
                  className='hover:underline transition-all'
                >
                  {item.product.title}
                </Link>
              </h3>
              <p className='text-sm sm:text-lg font-bold text-foreground tabular-nums shrink-0'>
                {formatPrice(item.product.price * item.quantity)}
              </p>
            </div>

            {/* Brand */}
            {item.product.brand && (
              <p className='text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider mt-0.5'>
                {item.product.brand}
              </p>
            )}

            {/* Options */}
            {Object.keys(options).length > 0 && (
              <div className='mt-1.5 flex flex-wrap gap-1'>
                {Object.entries(options).map(([name, value]) => (
                  <span 
                    key={name} 
                    className='inline-flex items-center rounded bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-secondary-foreground'
                  >
                    {name}: {value as string}
                  </span>
                ))}
              </div>
            )}

            {/* Unit price if multiple */}
            {item.quantity > 1 && (
              <p className='text-[10px] sm:text-xs text-muted-foreground mt-1'>
                {formatPrice(item.product.price)} each
              </p>
            )}

            {/* Spacer */}
            <div className='flex-1' />

            {/* Actions Row - Quantity + Buttons */}
            <div className='flex items-center justify-between gap-2 mt-3'>
              {/* Quantity Control */}
              <div className='flex items-center rounded-full border border-border bg-background shadow-sm'>
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-7 w-7 sm:h-8 sm:w-8 rounded-l-full hover:bg-secondary'
                  onClick={handleQuantityDecrease}
                  aria-label='Decrease quantity'
                  disabled={isPending || item.quantity <= 1}
                >
                  <Minus className='h-3 w-3' />
                </Button>
                <div className='w-8 sm:w-10 text-center text-xs sm:text-sm font-semibold tabular-nums border-x border-border/50 h-full flex items-center justify-center bg-secondary/30'>
                  {item.quantity}
                </div>
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-7 w-7 sm:h-8 sm:w-8 rounded-r-full hover:bg-secondary'
                  onClick={handleQuantityIncrease}
                  aria-label='Increase quantity'
                  disabled={isPending || item.quantity >= item.product.stock}
                >
                  <Plus className='h-3 w-3' />
                </Button>
              </div>

              {/* Action Buttons */}
              <div className='flex items-center gap-1'>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={handleSaveForLater}
                  disabled={isPending}
                  className={cn(
                    'h-8 w-8 rounded-full',
                    'text-muted-foreground hover:text-primary hover:bg-primary/10'
                  )}
                  title='Save for later'
                >
                  <Bookmark className='h-4 w-4' />
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant='ghost'
                      size='icon'
                      className={cn(
                        'h-8 w-8 rounded-full',
                        'text-muted-foreground hover:text-destructive hover:bg-destructive/10'
                      )}
                      disabled={isPending}
                      title='Remove item'
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className='max-w-[90vw] sm:max-w-md rounded-2xl'>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remove Item</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to remove this item from your cart?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className='flex-col sm:flex-row gap-2'>
                      <AlertDialogCancel className='w-full sm:w-auto'>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleRemove} 
                        className='w-full sm:w-auto bg-destructive text-destructive-foreground hover:bg-destructive/90'
                      >
                        Remove
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </div>
      </li>
    );
  }
);

CartItem.displayName = 'CartItem';