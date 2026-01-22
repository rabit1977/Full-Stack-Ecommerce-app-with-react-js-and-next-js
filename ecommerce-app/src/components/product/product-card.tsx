'use client';

import { addItemToCartAction } from '@/actions/cart-actions';
import { toggleWishlistAction } from '@/actions/wishlist-actions';
import { useQuickView } from '@/lib/context/quick-view-context';
import { ProductWithRelations } from '@/lib/types';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/utils/formatters';
import { motion } from 'framer-motion';
import { Eye, Heart, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { memo, useCallback, useMemo, useState, useTransition } from 'react';
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
    const { openModal } = useQuickView();

    const currentStock = useMemo(() => product.stock, [product.stock]);
    const isOutOfStock = useMemo(() => currentStock === 0, [currentStock]);
    const isLowStock = useMemo(
      () => !isOutOfStock && currentStock < 10,
      [isOutOfStock, currentStock],
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
          const result = await toggleWishlistAction(product.id);
          if (result.success) {
            const newWishState = !isWished;
            setIsWished(newWishState);
            toast.success(
              newWishState ? 'Added to wishlist' : 'Removed from wishlist',
            );
          } else {
            toast.error(
              result.error || 'Please log in to manage your wishlist.',
            );
          }
        });
      },
      [product.id, isWished],
    );

    const handleAddToCart = useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isOutOfStock) return;
        startTransition(async () => {
          const result = await addItemToCartAction(product.id, 1);
          if (result.success) {
            toast.success('Added to cart!');
          } else {
            toast.error(result.message || 'Failed to add to cart.');
          }
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
        transition={{ duration: 0.3 }}
        className='group relative flex h-full w-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-lg dark:bg-slate-800 dark:border-slate-800'
      >
        {/* --- Image Section --- */}
        <div className='relative aspect-square h-64 w-full overflow-hidden bg-slate-100 dark:bg-slate-900'>
          <ProductImageCarousel product={product} />

          {/* Badges (Top Left) */}
          <div className='absolute left-2 top-2 sm:left-3 sm:top-3 z-10 flex flex-col gap-1.5'>
            {discount && (
              <span className='inline-flex items-center rounded-md bg-red-600 px-1.5 py-0.5 sm:px-2 sm:py-1 text-[10px] sm:text-xs font-bold text-white shadow-sm'>
                -{Math.round(discount.percentage)}%
              </span>
            )}
            {isLowStock && (
              <span className='inline-flex items-center rounded-md bg-amber-500 px-1.5 py-0.5 sm:px-2 sm:py-1 text-[10px] sm:text-xs font-bold text-white shadow-sm'>
                Low Stock
              </span>
            )}
          </div>

          {/* Floating Actions (Top Right) - Always visible on mobile, hover on desktop */}
          <div className='absolute right-2 top-2 sm:right-3 sm:top-3 z-10 flex flex-col gap-2 md:translate-x-12 md:opacity-0 transition-all duration-300 md:group-hover:translate-x-0 md:group-hover:opacity-100'>
            <Button
              size='icon'
              variant='secondary'
              className='h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-white/95 shadow-md hover:bg-white dark:bg-slate-800/95 dark:hover:bg-slate-800'
              onClick={handleQuickView}
              title='Quick View'
            >
              <Eye className='h-4 w-4 text-slate-700 dark:text-slate-200' />
            </Button>
            <Button
              size='icon'
              variant='secondary'
              className={cn(
                'h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-white/95 shadow-md transition-colors hover:bg-white dark:bg-slate-800/95 dark:hover:bg-slate-800',
                isWished && 'text-red-500 hover:text-red-600',
              )}
              onClick={handleToggleWishlist}
              disabled={isPending}
              title={isWished ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart
                className={cn(
                  'h-4 w-4 transition-all',
                  isWished && 'fill-current',
                )}
              />
            </Button>
          </div>
        </div>

        {/* --- Content Section --- */}
        <div className='flex flex-1 flex-col p-3 sm:p-5'>
          {/* Brand & Title */}
          <Link href={`/products/${product.id}`} className='block group/title'>
            <p className='text-[10px] sm:text-xs font-medium uppercase tracking-wider text-muted-foreground'>
              {product.brand}
            </p>
            <h3 className='mt-0.5 sm:mt-1 line-clamp-1 text-sm sm:text-base font-semibold text-foreground transition-colors group-hover/title:text-primary'>
              {product.title}
            </h3>
          </Link>

          {/* Price Area */}
          <div className='mt-2 sm:mt-3 flex items-center justify-between gap-2'>
            <div className='flex items-center gap-2'>
            <span className='text-base sm:text-lg font-bold text-foreground'>
              {formatPrice(effectivePrice)}
            </span>
            {discount && (
              <span className='text-[10px] sm:text-sm text-muted-foreground line-through decoration-slate-400/60'>
                {formatPrice(discount.originalPrice)}
              </span>
            )}
            </div>
            {product.stock === 0 ? (
              <span className='text-[10px] sm:text-sm text-muted-foreground'>
                Out of Stock
              </span>
            ) : (
              <span className='text-[10px] sm:text-sm text-muted-foreground'>
                In stock <span  className='text-primary font-semibold'>{product.stock}</span>
              </span>
            )}
          </div>

          {/* Spacer to push button to bottom */}
          <div className='flex-1' />

          {/* --- Footer Action --- */}
          <div className='mt-3 sm:mt-5'>
            <Button
              className={cn(
                'h-11 sm:h-10 w-full rounded-lg font-medium shadow-none transition-all',
                isOutOfStock
                  ? 'cursor-not-allowed bg-muted text-muted-foreground hover:bg-muted'
                  : 'bg-primary hover:bg-primary/90 hover:shadow-md active:scale-95 sm:active:scale-100',
              )}
              onClick={handleAddToCart}
              disabled={isOutOfStock || isPending}
            >
              {isOutOfStock ? (
                'Out of Stock'
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
