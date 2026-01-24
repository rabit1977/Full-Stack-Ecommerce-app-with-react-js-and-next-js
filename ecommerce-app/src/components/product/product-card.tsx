'use client';

import { addItemToCartAction } from '@/actions/cart-actions';
import { toggleWishlistAction } from '@/actions/wishlist-actions';
import { useQuickView } from '@/lib/context/quick-view-context';
import { ProductWithRelations } from '@/lib/types';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/utils/formatters';
import { motion } from 'framer-motion';
import { Eye, Heart, ShoppingBag, Sparkles, Star, Zap } from 'lucide-react';
import Link from 'next/link';
import { memo, useCallback, useMemo, useOptimistic, useState, useTransition } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { ProductImageCarousel } from './product-image-carousel';

interface ProductCardProps {
  product: ProductWithRelations;
  initialIsWished?: boolean;
}

export const ProductCard = memo(
  ({ product, initialIsWished = false }: ProductCardProps) => {
    const [isPending, startTransition] = useTransition();
    const [isWished, setIsWished] = useState(initialIsWished);
    const [optimisticIsWished, toggleOptimisticIsWished] = useOptimistic(
      isWished,
      (state: boolean, _: unknown) => !state
    );

    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const { openModal } = useQuickView();

    const [optimisticStock, addOptimisticStock] = useOptimistic(
      product.stock,
      (state: number, amount: number) => Math.max(0, state + amount)
    );

    const isOutOfStock = useMemo(() => optimisticStock === 0, [optimisticStock]);
    const isLowStock = useMemo(
      () => !isOutOfStock && optimisticStock < 10,
      [isOutOfStock, optimisticStock],
    );

    const discount = useMemo(() => {
      if (product.discount && product.discount > 0) {
        return {
          percentage: product.discount,
          originalPrice: product.price,
          discountedPrice: product.price * (1 - product.discount / 100),
        };
      }
      return null;
    }, [product.price, product.discount]);

    // Calculate average rating
    const avgRating = useMemo(() => {
      if (!product.reviews || product.reviews.length === 0) return 0;
      return product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;
    }, [product.reviews]);

    const handleQuickView = useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        openModal(product);
      },
      [openModal, product],
    );

    const handleToggleWishlist = useCallback(
      async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        startTransition(async () => {
          toggleOptimisticIsWished(null);
          const result = await toggleWishlistAction(product.id);
          if (result.success) {
            setIsWished((prev) => !prev);
            toast.success(
              !isWished ? 'Added to wishlist' : 'Removed from wishlist',
            );
          } else {
            toast.error(
              result.error || 'Please log in to manage your wishlist.',
            );
          }
        });
      },
      [product.id, isWished, toggleOptimisticIsWished],
    );

    const handleAddToCart = useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isOutOfStock) return;
        setIsAddingToCart(true);
        startTransition(async () => {
          addOptimisticStock(-1);
          const result = await addItemToCartAction(product.id, 1);
          if (result.success) {
            toast.success('Added to cart!');
          } else {
            toast.error(result.message || 'Failed to add to cart.');
          }
          setIsAddingToCart(false);
        });
      },
      [product.id, isOutOfStock],
    );

    const effectivePrice = discount ? discount.discountedPrice : product.price;

    return (
      <motion.div
        layoutId={`product-card-${product.id}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        className='group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-lg hover:border-primary/30 hover:-translate-y-1'
      >
        {/* --- Image Section --- */}
        <div className='relative aspect-square w-full overflow-hidden bg-muted'>
          <ProductImageCarousel product={product} />

          {/* Gradient Overlay on Hover */}
          <div className='absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />

          {/* Badges (Top Left) */}
          <div className='absolute left-3 top-3 z-10 flex flex-col gap-2'>
            {discount && (
              <motion.span 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className='inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-rose-500 to-pink-500 px-2.5 py-1 text-xs font-bold text-white shadow-lg'
              >
                <Sparkles className='h-3 w-3' />
                -{Math.round(discount.percentage)}%
              </motion.span>
            )}
            {isLowStock && (
              <span className='inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-2.5 py-1 text-xs font-bold text-white shadow-lg'>
                <Zap className='h-3 w-3' />
                Low Stock
              </span>
            )}
            {isOutOfStock && (
              <span className='inline-flex items-center rounded-lg bg-gray-900 px-2.5 py-1 text-xs font-bold text-white'>
                Out of Stock
              </span>
            )}
          </div>

          {/* Floating Actions (Top Right) */}
          <div className='absolute right-3 top-3 z-10 flex flex-col gap-2 md:translate-x-14 md:opacity-0 transition-all duration-300 md:group-hover:translate-x-0 md:group-hover:opacity-100'>
            <Button
              size='icon'
              variant='secondary'
              className='h-9 w-9 rounded-full bg-white shadow-md hover:bg-primary/10 hover:text-primary dark:bg-card dark:hover:bg-primary/20 transition-all duration-200'
              onClick={handleQuickView}
              title='Quick View'
            >
              <Eye className='h-4 w-4' />
            </Button>
            <Button
              size='icon'
              variant='secondary'
              className={cn(
                'h-9 w-9 rounded-full bg-white shadow-md transition-all duration-200 dark:bg-card',
                optimisticIsWished 
                  ? 'bg-red-50 text-red-500 hover:bg-red-100 dark:bg-red-950 dark:hover:bg-red-900'
                  : 'hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20',
              )}
              onClick={handleToggleWishlist}
              disabled={isPending}
              title={optimisticIsWished ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart
                className={cn(
                  'h-4 w-4 transition-all',
                  optimisticIsWished && 'fill-current'
                )}
              />
            </Button>
          </div>
        </div>

        {/* --- Content Section --- */}
        <div className='flex flex-1 flex-col p-4 sm:p-5'>
          {/* Brand & Rating */}
          <div className='flex items-center justify-between gap-2'>
            <p className='text-[11px] font-semibold uppercase tracking-wider text-primary'>
              {product.brand}
            </p>
            {avgRating > 0 && (
              <div className='flex items-center gap-1'>
                <Star className='h-3.5 w-3.5 fill-amber-400 text-amber-400' />
                <span className='text-xs font-medium text-muted-foreground'>
                  {avgRating.toFixed(1)}
                </span>
              </div>
            )}
          </div>

          {/* Title */}
          <Link href={`/products/${product.id}`} className='block group/title mt-1.5'>
            <h3 className='line-clamp-2 text-sm sm:text-base font-semibold text-foreground transition-colors group-hover/title:text-primary leading-snug'>
              {product.title}
            </h3>
          </Link>

          {/* Spacer */}
          <div className='flex-1 min-h-2' />

          {/* Price Area */}
          <div className='mt-3 flex items-end justify-between gap-2'>
            <div className='space-y-0.5'>
              <div className='flex items-baseline gap-2'>
                <span className='text-lg sm:text-xl font-bold text-foreground'>
                  {formatPrice(effectivePrice)}
                </span>
                {discount && (
                  <span className='text-xs text-muted-foreground line-through'>
                    {formatPrice(discount.originalPrice)}
                  </span>
                )}
              </div>
              {!isOutOfStock && (
                <p className='text-[11px] text-muted-foreground'>
                  <span className='text-primary font-medium'>
                    {optimisticStock}
                  </span>{' '}
                  in stock
                </p>
              )}
            </div>
          </div>

          {/* --- Footer Action --- */}
          <div className='mt-4'>
            <Button
              className={cn(
                'h-11 w-full rounded-xl font-semibold transition-all duration-300',
                isOutOfStock
                  ? 'cursor-not-allowed bg-muted text-muted-foreground hover:bg-muted'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98]',
              )}
              onClick={handleAddToCart}
              disabled={isOutOfStock || isPending}
            >
              {isOutOfStock ? (
                'Out of Stock'
              ) : isAddingToCart ? (
                <span className='flex items-center gap-2'>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className='h-4 w-4 border-2 border-white/30 border-t-white rounded-full'
                  />
                  Adding...
                </span>
              ) : (
                <>
                  <ShoppingBag className='mr-2 h-4 w-4' />
                  Add to Cart
                </>
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    );
  },
);

ProductCard.displayName = 'ProductCard';
