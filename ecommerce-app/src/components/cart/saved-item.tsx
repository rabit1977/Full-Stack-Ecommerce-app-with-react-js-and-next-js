'use client';

import { Button } from '@/components/ui/button';
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
import { CartItemWithProduct } from '@/lib/types/cart';
import { formatPrice } from '@/lib/utils/formatters';
import { getProductImage } from '@/lib/utils/product-images';
import { Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface SavedItemProps {
  item: CartItemWithProduct;
  onMoveToCart: (savedItemId: string) => void;
  onRemove: (savedItemId: string) => void;
  isPending: boolean;
}

export const SavedItem = React.memo(
  ({ item, onMoveToCart, onRemove, isPending }: SavedItemProps) => {
    const handleMoveToCart = () => {
      onMoveToCart(item.id);
    };

    const handleRemove = () => {
      onRemove(item.id);
    };

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
              <p className='mt-1 shrink-0 sm:ml-4 sm:mt-0'>
                {formatPrice(item.product.price)}
              </p>
            </div>
          </div>
          <div className='flex flex-1 items-end justify-between text-sm'>
            <Button
              variant='link'
              size='sm'
              onClick={handleMoveToCart}
              disabled={isPending}
            >
              Move to Cart
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant='link'
                  size='sm'
                  className='font-medium text-red-600 hover:text-red-500 -mr-2.5'
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
                    Are you sure you want to remove this item?
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
      </li>
    );
  }
);

SavedItem.displayName = 'SavedItem';