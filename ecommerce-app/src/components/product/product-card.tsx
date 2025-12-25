'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCart } from '@/lib/hooks/useCart';
import { useUI } from '@/lib/hooks/useUI';
import { Product } from '@/lib/types';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/utils/formatters';
import { motion } from 'framer-motion';
import { Eye, Heart, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { memo, useCallback, useMemo, useTransition } from 'react';
import { toast } from 'sonner';
import { ProductImageCarousel } from './product-image-carousel';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = memo(({ product }: ProductCardProps) => {
  const { setQuickViewProductId } = useUI();
  const { wishlistItems, toggleWishlist, addToCart } = useCart();
  const [isPending, startTransition] = useTransition();

  const isWished = useMemo(
    () => wishlistItems.includes(product.id),
    [wishlistItems, product.id]
  );

  const isOutOfStock = useMemo(() => product.stock === 0, [product.stock]);

  const isLowStock = useMemo(
    () => !isOutOfStock && product.stock < 10,
    [isOutOfStock, product.stock]
  );

  // Discount calculation
  const discount = useMemo(() => {
    if (product.discount && product.discount > 0) {
      const discountedPrice = product.price * (1 - product.discount / 100);
      return {
        percentage: product.discount,
        originalPrice: product.price,
        discountedPrice,
      };
    }
    return null;
  }, [product.price, product.discount]);

  const handleQuickView = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setQuickViewProductId(product.id);
    },
    [product.id, setQuickViewProductId]
  );

  const handleToggleWishlist = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      startTransition(() => {
        toggleWishlist(product.id);
        toast.success(
          isWished ? 'Removed from wishlist' : 'Added to wishlist',
          { duration: 2000 }
        );
      });
    },
    [product.id, toggleWishlist, isWished]
  );

  const handleAddToCart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      if (isOutOfStock) return;

      startTransition(() => {
        addToCart({
          id: product.id,
          title: product.title,
          price: discount?.discountedPrice || product.price,
          quantity: 1,
        });
        toast.success('Added to cart', { duration: 2000 });
      });
    },
    [product, isOutOfStock, discount, addToCart]
  );

  return (
    <motion.div
      layoutId={`product-card-${product.id}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className='w-full'
    >
      <div className='group relative h-full overflow-hidden rounded-xl border bg-white shadow-sm transition-all duration-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900'>
        {/* Image Carousel */}
        <ProductImageCarousel product={product} />

        {/* Discount Badge */}
        {discount && (
          <Badge className='absolute top-3 left-3 z-20 bg-red-500 text-white shadow-lg'>
            -{discount.percentage}%
          </Badge>
        )}

        {/* Quick Actions */}
        <div className='absolute right-3 top-3 z-20 flex gap-1'>
          <Button
            size='icon'
            variant='secondary'
            className='h-7 w-7 rounded-full shadow-lg backdrop-blur-sm opacity-0 transition-all duration-300 group-hover:opacity-100'
            onClick={handleQuickView}
            aria-label='Quick view'
          >
            <Eye className='size-3.5' />
          </Button>
          <Button
            size='icon'
            variant={isWished ? 'default' : 'secondary'}
            className={cn(
              'h-7 w-7 rounded-full shadow-lg backdrop-blur-sm transition-all duration-300',
              isWished && 'bg-red-500 hover:bg-red-600'
            )}
            onClick={handleToggleWishlist}
            disabled={isPending}
            aria-label={isWished ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart
              className={cn(
                'size-3.5 transition-all',
                isWished && 'fill-white text-white'
              )}
            />
          </Button>
        </div>

        {/* Product Info */}
        <div className='p-4 space-y-3'>
          {/* Brand & Category */}
          <div className='flex items-center justify-between'>
            <span className='text-xs font-medium uppercase tracking-wider text-slate-600 dark:text-slate-400'>
              {product.brand}
            </span>
            <Badge variant='outline' className='text-xs'>
              {product.category}
            </Badge>
          </div>

          {/* Title */}
          <Link href={`/products/${product.id}`}>
            <h3 className='line-clamp-2 text-base font-semibold leading-tight text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors'>
              {product.title}
            </h3>
          </Link>

          {/* Price & Stock */}
          <div className='flex items-end justify-between pt-2'>
            <div className='flex flex-col gap-1'>
              {discount ? (
                <>
                  <span className='text-lg font-bold text-slate-900 dark:text-white'>
                    {formatPrice(discount.discountedPrice)}
                  </span>
                  <span className='text-sm text-slate-500 line-through dark:text-slate-400'>
                    {formatPrice(discount.originalPrice)}
                  </span>
                </>
              ) : (
                <span className='text-lg font-bold text-slate-900 dark:text-white'>
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            {isLowStock && !isOutOfStock && (
              <Badge variant='secondary' className='text-xs'>
                Only {product.stock} left
              </Badge>
            )}
          </div>

          {/* Add to Cart Button */}
          <Button
            className={cn(
              'w-full transition-all duration-300',
              isOutOfStock && 'opacity-50 cursor-not-allowed'
            )}
            onClick={handleAddToCart}
            disabled={isOutOfStock || isPending}
          >
            <ShoppingCart className='h-4 w-4 mr-2' />
            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </div>
      </div>
    </motion.div>
  );
});

ProductCard.displayName = 'ProductCard';
