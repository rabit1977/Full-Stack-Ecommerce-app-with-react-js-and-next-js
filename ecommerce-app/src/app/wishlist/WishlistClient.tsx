'use client';

import { addItemToCartAction } from '@/actions/cart-actions';
import {
  clearWishlistAction,
  toggleWishlistAction,
} from '@/actions/wishlist-actions';
import { Button } from '@/components/ui/button';
import { ProductWithRelations } from '@/lib/types';
import { formatPrice } from '@/lib/utils/formatters';
import { getProductImage } from '@/lib/utils/product-images';
import { ShoppingCart, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { toast } from 'sonner';

export function WishlistClient({
  products,
}: {
  products: ProductWithRelations[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleRemoveFromWishlist = (productId: string) => {
    startTransition(async () => {
      const result = await toggleWishlistAction(productId);
      if (result.success) {
        toast.success(result.success || 'Removed from wishlist');
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to remove from wishlist');
      }
    });
  };

  const handleClearWishlist = () => {
    startTransition(async () => {
      const result = await clearWishlistAction();
      if (result.success) {
        toast.success('Wishlist cleared');
        router.refresh();
      } else {
        toast.error('Failed to clear wishlist');
      }
    });
  };

  const handleAddToCart = (productId: string) => {
    startTransition(async () => {
      const result = await addItemToCartAction(productId, 1);
      if (result.success) {
        toast.success('Added to cart');
        router.refresh(); // Refresh to update cart icon
      } else {
        toast.error(result.message || 'Failed to add to cart');
      }
    });
  };

  return (
    <div className='bg-slate-50 min-h-[70vh] dark:bg-slate-900'>
      <div className='container mx-auto px-4 py-12'>
        <div className='flex items-center justify-between mb-8'>
          <div className='flex items-baseline gap-4'>
            <h1 className='text-3xl font-bold tracking-tight dark:text-white'>
              Your Wishlist
            </h1>
            <span className='text-slate-600 dark:text-slate-300'>
              {products.length} item{products.length !== 1 ? 's' : ''}
            </span>
          </div>
          <Button
            variant='outline'
            onClick={handleClearWishlist}
            disabled={isPending}
          >
            <Trash2 className='mr-2 h-4 w-4' />
            Clear Wishlist
          </Button>
        </div>

        <div className='grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {products.map((product) => (
            <div
              key={product.id}
              className='border rounded-2xl bg-white shadow-sm overflow-hidden flex flex-col dark:bg-slate-900 dark:border-slate-800'
            >
              <div className='h-48 w-full overflow-hidden relative bg-slate-100 dark:bg-slate-800'>
                <Image
                  src={getProductImage(product)}
                  alt={product.title}
                  fill
                  className='object-cover hover:scale-110 transition-transform duration-300'
                  sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw'
                  priority={false}
                />
              </div>
              <div className='p-4 flex flex-col grow'>
                <h3 className='font-semibold text-slate-800 dark:text-white'>
                  <Link
                    href={`/products/${product.id}`}
                    className='hover:underline hover:underline-offset-3   cursor-pointer'
                  >
                    {product.title}
                  </Link>
                </h3>
                <p className='text-slate-500 text-sm dark:text-slate-400'>
                  {product.brand}
                </p>
                <p className='mt-2 text-lg font-bold text-slate-900 dark:text-white'>
                  {formatPrice(product.price)}
                </p>
                <div className='mt-4 pt-4 border-t flex flex-col gap-2  dark:border-slate-800'>
                  <Button
                    onClick={() => handleAddToCart(product.id)}
                    className='w-full'
                    disabled={isPending}
                  >
                    <ShoppingCart className='h-4 w-4 mr-2' />
                    Add to Cart
                  </Button>
                  <Button
                    variant='outline'
                    onClick={() => handleRemoveFromWishlist(product.id)}
                    className='w-full'
                    disabled={isPending}
                  >
                    <Trash2 className='h-4 w-4 mr-2' />
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
