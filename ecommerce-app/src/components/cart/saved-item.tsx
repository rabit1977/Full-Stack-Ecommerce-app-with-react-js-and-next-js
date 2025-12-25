'use client';

import { Button } from '@/components/ui/button';
import { useAppDispatch } from '@/lib/store/hooks';
import { moveToCart, removeFromSaved } from '@/lib/store/thunks/cartThunks';
import { CartItem as CartItemType } from '@/lib/types';
import { formatPrice } from '@/lib/utils/formatters';
import { Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useCallback } from 'react';

interface SavedItemProps {
  item: CartItemType;
}

const SavedItem = React.memo(({ item }: SavedItemProps) => {
  const dispatch = useAppDispatch();

  const handleMoveToCart = useCallback(() => {
    dispatch(moveToCart(item.cartItemId));
  }, [item.cartItemId, dispatch]);

  const handleRemove = useCallback(() => {
    dispatch(removeFromSaved(item.cartItemId));
  }, [item.cartItemId, dispatch]);

  return (
    <li className='flex flex-col py-2 sm:flex-row'>
      <div className='h-48 w-full flex-shrink-0 overflow-hidden rounded-md border dark:border-slate-800 sm:h-24 sm:w-24'>
        <Image
          src={item.image || '/images/placeholder.jpg'}
          alt={item.title}
          width={96}
          height={96}
          className='h-full w-full object-cover'
        />
      </div>
      <div className='mt-4 flex flex-1 flex-col sm:ml-4 sm:mt-0'>
        <div>
          <div className='flex flex-col justify-between text-base font-medium text-slate-900 dark:text-white sm:flex-row'>
            <h3>
              <Link href={`/products/${item.id}`} className='hover:underline'>
                {item.title}
              </Link>
            </h3>
            <p className='mt-1 flex-shrink-0 sm:ml-4 sm:mt-0'>
              {formatPrice(item.price)}
            </p>
          </div>
        </div>
        <div className='flex flex-1 items-end justify-between text-sm'>
          <Button variant='link' size='sm' onClick={handleMoveToCart}>
            Move to Cart
          </Button>
          <Button
            variant='link'
            size='sm'
            className='font-medium text-red-600 hover:text-red-500 -mr-2.5'
            onClick={handleRemove}
          >
            <Trash2 className='h-4 w-4' />
            Remove
          </Button>
        </div>
      </div>
    </li>
  );
});

SavedItem.displayName = 'SavedItem';

export { SavedItem };
