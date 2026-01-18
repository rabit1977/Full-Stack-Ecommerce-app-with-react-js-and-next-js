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
      <li className='flex flex-col py-6 sm:flex-row px-4'>
        <div className='h-48 w-full flex-shrink-0 overflow-hidden rounded-md border dark:border-slate-800 sm:h-24 sm:w-24'>
          <Image
            src={getProductImage(item.product)}
            alt={item.product.title}
            width={96}
            height={96}
            className='h-full w-full object-cover'
          />
        </div>
        <div className='mt-4 flex flex-1 flex-col sm:ml-4 sm:mt-0'>
          <div>
            <div className='flex flex-col justify-between text-base font-medium text-slate-900 dark:text-white sm:flex-row'>
              <h3>
                <Link
                  href={`/products/${item.productId}`}
                  className='hover:underline'
                >
                  {item.product.title}
                </Link>
              </h3>
              <p className='mt-1 flex-shrink-0 sm:ml-4 sm:mt-0'>
                {formatPrice(item.product.price * item.quantity)}
              </p>
            </div>
            {Object.keys(options).length > 0 && (
              <div className='mt-1 flex flex-wrap gap-x-3 text-sm text-slate-500 dark:text-slate-400'>
                {Object.entries(options).map(([name, value]) => (
                  <span key={name}>
                    {name}: {value as string}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className='flex flex-1 flex-col items-start gap-4 pt-4 text-sm sm:flex-row sm:items-end sm:justify-between sm:pt-0'>
            <div className='flex items-center rounded-md border dark:border-slate-700'>
              <Button
                variant='ghost'
                size='icon'
                className='h-8 w-8'
                onClick={handleQuantityDecrease}
                aria-label='Decrease quantity'
                disabled={isPending || item.quantity <= 1}
              >
                <Minus className='h-4 w-4' />
              </Button>
              <span
                className='w-8 text-center dark:text-white'
                aria-live='polite'
              >
                {item.quantity}
              </span>
              <Button
                variant='ghost'
                size='icon'
                className='h-8 w-8'
                onClick={handleQuantityIncrease}
                aria-label='Increase quantity'
                disabled={isPending || item.quantity >= item.product.stock}
              >
                <Plus className='h-4 w-4' />
              </Button>
            </div>
            <div className='flex gap-2'>
              <Button
                variant='link'
                size='sm'
                onClick={handleSaveForLater}
                disabled={isPending}
              >
                Save for Later
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant='link'
                    size='sm'
                    className='font-medium text-red-600 hover:text-red-500 -mx-2.5'
                    disabled={isPending}
                  >
                    <Trash2 className='h-4 w-4' />
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
                    <AlertDialogAction onClick={handleRemove}>
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