'use client';

import { addItemToCartAction } from '@/actions/cart-actions';
import { toggleWishlistAction } from '@/actions/wishlist-actions';
import { useQuickView } from '@/lib/context/quick-view-context';
import { ProductWithRelations } from '@/lib/types';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/utils/formatters';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, Eye, Heart, Package, ShoppingBag, Star, XCircle } from 'lucide-react';
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
      (state: boolean) => !state
    );

    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const { openModal } = useQuickView();

    // Stock status helpers
    const stock = product.stock;
    const isOutOfStock = stock === 0;
    const isLowStock = !isOutOfStock && stock < 10;
    const isVeryLowStock = !isOutOfStock && stock <= 3;

    // Stock status config
    const stockStatus = useMemo(() => {
      if (isOutOfStock) {
        return {
          label: 'Out of Stock',
          color: 'text-red-600 dark:text-red-400',
          bgColor: 'bg-red-500/10',
          dotColor: 'bg-red-500',
          icon: XCircle,
        };
      }
      if (isVeryLowStock) {
        return {
          label: `Only ${stock} left!`,
          color: 'text-orange-600 dark:text-orange-400',
          bgColor: 'bg-orange-500/10',
          dotColor: 'bg-orange-500',
          icon: AlertTriangle,
        };
      }
      if (isLowStock) {
        return {
          label: `${stock} in stock`,
          color: 'text-amber-600 dark:text-amber-400',
          bgColor: 'bg-amber-500/10',
          dotColor: 'bg-amber-500',
          icon: Package,
        };
      }
      return {
        label: `${stock} in stock`,
        color: 'text-emerald-600 dark:text-emerald-400',
        bgColor: 'bg-emerald-500/10',
        dotColor: 'bg-emerald-500',
        icon: CheckCircle,
      };
    }, [stock, isOutOfStock, isLowStock, isVeryLowStock]);

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
    const StockIcon = stockStatus.icon;

    return (
      <motion.div
        layoutId={`product-card-${product.id}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        className='group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-border/50 bg-card shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 hover:-translate-y-1'
      >
        {/* --- Image Section --- */}
        <div className='relative aspect-square w-full overflow-hidden bg-muted/50'>
          <ProductImageCarousel product={product} />

          {/* Gradient Overlay on Hover */}
          <div className='absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />

          {/* Badges (Top Left) */}
          <div className='absolute left-2 top-2 z-10 flex flex-col gap-1.5'>
            {discount && (
              <motion.span 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className='inline-flex items-center gap-1 rounded-md bg-red-500/90 backdrop-blur-md px-1.5 py-0.5 text-[10px] font-bold text-white shadow-sm'
              >
                -{Math.round(discount.percentage)}%
              </motion.span>
            )}
            {isVeryLowStock && (
              <motion.span 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className='inline-flex items-center gap-1 rounded-md bg-orange-500/90 backdrop-blur-md px-1.5 py-0.5 text-[10px] font-bold text-white shadow-sm animate-pulse'
              >
                Only {stock} left
              </motion.span>
            )}
            {isLowStock && !isVeryLowStock && (
              <span className='inline-flex items-center gap-1 rounded-md bg-amber-500/90 backdrop-blur-md px-1.5 py-0.5 text-[10px] font-bold text-white shadow-sm'>
                Low Stock
              </span>
            )}
            {/* Bundle Badge */}
             {product.inBundles && product.inBundles.length > 0 && (
              <motion.span 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className='inline-flex items-center gap-1 rounded-md bg-violet-600/90 backdrop-blur-md px-1.5 py-0.5 text-[10px] font-bold text-white shadow-sm'
              >
                Bundle
              </motion.span>
            )}
          </div>

          {/* Floating Actions (Top Right) */}
          <div className='absolute right-2 top-2 z-10 flex flex-col gap-1.5 md:translate-x-12 md:opacity-0 transition-all duration-300 md:group-hover:translate-x-0 md:group-hover:opacity-100'>
            <Button
              size='icon'
              variant='secondary'
              className='h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:bg-primary hover:text-white dark:bg-black/50 dark:text-white dark:hover:bg-primary transition-all duration-200'
              onClick={handleQuickView}
              title='Quick View'
            >
              <Eye className='h-3.5 w-3.5' />
            </Button>
            <Button
              size='icon'
              variant='secondary'
              className={cn(
                'h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-200 dark:bg-black/50 dark:text-white',
                optimisticIsWished 
                  ? 'bg-red-50 text-red-500 hover:bg-red-100 dark:text-red-400'
                  : 'hover:bg-primary hover:text-white',
              )}
              onClick={handleToggleWishlist}
              disabled={isPending}
              title={optimisticIsWished ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart
                className={cn(
                  'h-3.5 w-3.5 transition-all',
                  optimisticIsWished && 'fill-current'
                )}
              />
            </Button>
          </div>
        </div>

        {/* --- Content Section --- */}
        <div className='flex flex-1 flex-col p-3 sm:p-4'>
          {/* Category & Rating */}
          <div className='flex items-center justify-between gap-2 mb-1'>
            <p className='text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 line-clamp-1'>
               {product.category || product.brand}
            </p>
            {avgRating > 0 && (
              <div className='flex items-center gap-1 bg-secondary/50 px-1.5 py-0.5 rounded-md'>
                <Star className='h-2.5 w-2.5 fill-amber-400 text-amber-400' />
                <span className='text-[10px] font-bold text-foreground'>
                  {avgRating.toFixed(1)}
                </span>
              </div>
            )}
          </div>

          {/* Title */}
          <Link href={`/products/${product.slug || product.id}`} className='block group/title mb-auto'>
            <h3 className='line-clamp-2 text-sm font-bold text-foreground transition-colors group-hover/title:text-primary leading-tight min-h-[2.5em]'>
              {product.title}
            </h3>
          </Link>

          {/* Price & Stock Area */}
          <div className='mt-3 flex items-end justify-between gap-2'>
             <div className='flex flex-col'>
                <div className='flex items-baseline gap-1.5'>
                    <span className='text-lg font-black text-foreground tracking-tight'>
                        {formatPrice(effectivePrice)}
                    </span>
                    {discount && (
                        <span className='text-xs text-muted-foreground line-through font-medium opacity-70'>
                        {formatPrice(discount.originalPrice)}
                        </span>
                    )}
                </div>
                {/* Micro Stock Indicator */}
                 {!isOutOfStock && stockStatus && (
                    <div className={cn('text-[10px] font-medium flex items-center gap-1 truncate mt-0.5', stockStatus.color)}>
                         <span className={cn('h-1 w-1 rounded-full', stockStatus.dotColor)} />
                         {stockStatus.label}
                    </div>
                )}
             </div>
             
             {/* Cart Button */}
             <Button
                size='icon'
                className={cn(
                    'h-9 w-9 rounded-xl shadow-sm transition-all duration-300 shrink-0',
                    isOutOfStock
                    ? 'cursor-not-allowed bg-muted text-muted-foreground hover:bg-muted opacity-50'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md hover:scale-105'
                )}
                onClick={handleAddToCart}
                disabled={isOutOfStock || isPending}
                >
                {isOutOfStock ? (
                    <XCircle className='h-4 w-4' />
                ) : isAddingToCart ? (
                     <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className='h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full'
                    />
                ) : (
                    <ShoppingBag className='h-4 w-4' />
                )}
            </Button>
          </div>
        </div>
      </motion.div>
    );
  },
);

ProductCard.displayName = 'ProductCard';
