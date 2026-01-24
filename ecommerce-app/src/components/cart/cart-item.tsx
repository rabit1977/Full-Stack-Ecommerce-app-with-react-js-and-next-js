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
import { formatPrice } from '@/lib/utils/formatters';
import { getProductImage } from '@/lib/utils/product-images';
import { Minus, Plus, Trash2 } from 'lucide-react';
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
      <li className='group flex flex-col py-6 sm:flex-row px-4 sm:px-6 transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-900/50'>
        <div className='relative h-32 w-full sm:h-32 sm:w-32 shrink-0 overflow-hidden rounded-xl border border-border bg-muted'>
          <Image
            src={getProductImage(item.product)}
            alt={item.product.title}
            fill
            className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
          />
        </div>
        <div className='mt-4 flex flex-1 flex-col justify-between sm:ml-6 sm:mt-0'>
          <div className='relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0'>
            <div>
              <div className='flex justify-between'>
                <h3 className='text-base font-semibold text-foreground'>
                  <Link
                    href={`/products/${item.productId}`}
                    className='hover:text-primary transition-colors'
                  >
                    {item.product.title}
                  </Link>
                </h3>
              </div>
              <div className='mt-1 flex text-sm'>
                <p className='text-muted-foreground font-medium'>
                   {item.product.brand && <span className='uppercase tracking-wider text-xs mr-2 border border-border px-1.5 py-0.5 rounded'>{item.product.brand}</span>}
                </p>
              </div>
              {Object.keys(options).length > 0 && (
                <div className='mt-2 flex flex-wrap gap-2'>
                  {Object.entries(options).map(([name, value]) => (
                    <span 
                      key={name} 
                      className='inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground ring-1 ring-inset ring-gray-500/10'
                    >
                      {name}: {value as string}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className='mt-4 sm:mt-0 sm:pr-9 text-right'>
              <p className='text-lg font-bold text-foreground tabular-nums'>
                {formatPrice(item.product.price * item.quantity)}
              </p>
              {item.quantity > 1 && (
                <p className='text-xs text-muted-foreground mt-0.5'>
                  {formatPrice(item.product.price)} each
                </p>
              )}
            </div>
          </div>

          <div className='mt-4 flex items-center justify-between'>
             {/* Quantity Control */}
            <div className='flex items-center rounded-full border border-border bg-background shadow-sm'>
              <Button
                variant='ghost'
                size='icon'
                className='h-8 w-8 rounded-l-full hover:bg-secondary'
                onClick={handleQuantityDecrease}
                aria-label='Decrease quantity'
                disabled={isPending || item.quantity <= 1}
              >
                <Minus className='h-3.5 w-3.5' />
              </Button>
              <div className='w-10 text-center text-sm font-semibold tabular-nums border-x border-border/50 h-full flex items-center justify-center bg-secondary/30'>
                 {item.quantity}
              </div>
              <Button
                variant='ghost'
                size='icon'
                className='h-8 w-8 rounded-r-full hover:bg-secondary'
                onClick={handleQuantityIncrease}
                aria-label='Increase quantity'
                disabled={isPending || item.quantity >= item.product.stock}
              >
                <Plus className='h-3.5 w-3.5' />
              </Button>
            </div>

            <div className='flex items-center gap-4'>
              <Button
                variant='ghost'
                size='sm'
                onClick={handleSaveForLater}
                disabled={isPending}
                className='text-muted-foreground hover:text-primary text-xs sm:text-sm font-medium'
              >
                Save for later
              </Button>
              <span className="text-border h-4 w-px bg-border/50" />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='text-muted-foreground hover:text-destructive hover:bg-destructive/5 text-xs sm:text-sm font-medium'
                    disabled={isPending}
                  >
                    <Trash2 className='h-3.5 w-3.5 mr-1.5' />
                    Remove
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Remove Item</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to remove this item from your cart?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleRemove} className='bg-destructive text-destructive-foreground hover:bg-destructive/90'>
                      Remove
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </li>
    );
  }
);

CartItem.displayName = 'CartItem';