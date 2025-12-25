'use client';

import AuthGuard from '@/components/auth/auth-guard';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import {
    addToCart,
    clearWishlist,
    toggleWishlist,
} from '@/lib/store/thunks/cartThunks';
import { Product } from '@/lib/types';
import { formatPrice } from '@/lib/utils/formatters';
import { getProductImage } from '@/lib/utils/product-images';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

const WishlistPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { itemIds: wishlist } = useAppSelector((state) => state.wishlist);
  const { products } = useAppSelector((state) => state.products);

  const wishlistedProducts = useMemo(
    () => products.filter((p: Product) => (wishlist || []).includes(p.id)),
    [wishlist, products]
  );
  const viewProduct = (productId: string) => {
    router.push(`/products/${productId}`);
  };

  const handleAddToCart = (productId: string) => {
    const product = products.find((p: Product) => p.id === productId);
    if (product) {
      dispatch(
        addToCart({
          id: product.id,
          quantity: 1,
          title: product.title,
          price: product.price,
        })
      );
      dispatch(toggleWishlist(product.id));
    }
  };

  const handleClearWishlist = () => {
    dispatch(clearWishlist());
  };

  return (
    <AuthGuard>
      {wishlistedProducts.length === 0 ? (
        <div className='container mx-auto px-4 py-16 text-center'>
          <Heart className='mx-auto h-24 w-24 text-slate-300 dark:text-slate-700' />
          <h2 className='mt-6 text-2xl font-bold dark:text-white'>
            Your Wishlist is empty
          </h2>
          <p className='mt-2 text-slate-500 dark:text-slate-400'>
            Browse products and save your favorites for later.
          </p>
          <Button
            size='lg'
            onClick={() => router.push('/products')}
            className='mt-8'
          >
            Find Products
          </Button>
        </div>
      ) : (
        <div className='bg-slate-50 min-h-[70vh] dark:bg-slate-900'>
          <div className='container mx-auto px-4 py-12'>
            <div className='flex items-center justify-between mb-8'>
              <div className='flex items-baseline gap-4'>
                <h1 className='text-3xl font-bold tracking-tight dark:text-white'>
                  Your Wishlist
                </h1>
                <span className='text-slate-600 dark:text-slate-300'>
                  {wishlistedProducts.length} item
                  {wishlistedProducts.length !== 1 ? 's' : ''}
                </span>
              </div>
              <Button variant='outline' onClick={handleClearWishlist}>
                <Trash2 className='mr-2 h-4 w-4' />
                Clear Wishlist
              </Button>
            </div>

            <div className='grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              {wishlistedProducts.map((product: Product) => (
                <div
                  key={product.id}
                  className='border rounded-2xl bg-white shadow-sm overflow-hidden flex flex-col dark:bg-slate-900 dark:border-slate-800'
                >
                  <div className='h-48 w-full overflow-hidden relative'>
                    <Image
                      src={getProductImage(product)}
                      alt={product.title}
                      width={300}
                      height={300}
                      className='object-cover hover:scale-110 transition-transform duration-300'
                      sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                    />
                  </div>
                  <div className='p-4 flex flex-col flex-grow'>
                    <h3 className='font-semibold text-slate-800 dark:text-white'>
                      <Link
                        href='#'
                        onClick={(e) => {
                          e.preventDefault();
                          viewProduct(product.id);
                        }}
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
                      >
                        <ShoppingCart className='h-4 w-4 mr-2' />
                        Add to Cart
                      </Button>
                      <Button
                        variant='outline'
                        onClick={() => dispatch(toggleWishlist(product.id))}
                        className='w-full'
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
      )}
    </AuthGuard>
  );
};

export default WishlistPage;
