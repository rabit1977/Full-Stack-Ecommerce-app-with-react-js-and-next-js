'use client';

import { Badge } from '@/components/ui/badge';
import { ProductWithRelations } from '@/lib/types';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useMemo, useState } from 'react';

interface ProductImageCarouselProps {
  product: ProductWithRelations;
}

export function ProductImageCarousel({ product }: ProductImageCarouselProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // Get all available images from thumbnail and images relation
  const images = useMemo(() => {
    const imageUrls = product.images?.map((image) => image.url) ?? [];
    if (product.thumbnail) {
      imageUrls.unshift(product.thumbnail);
    }
    // Remove duplicates and return, or provide a placeholder
    const uniqueImages = [...new Set(imageUrls)];
    return uniqueImages.length > 0 ? uniqueImages : ['/images/placeholder.jpg'];
  }, [product.thumbnail, product.images]);

  const currentImage = images[activeImageIndex];
  const hasMultipleImages = images.length > 1;

  const handleDotClick = useCallback((e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImageIndex(index);
    setIsImageLoaded(false);
  }, []);

  // Check stock status
  const stockStatus = useMemo(() => {
    if (product.stock === 0)
      return { label: 'Out of Stock', variant: 'destructive' as const };
    if (product.stock < 10)
      return {
        label: `Only ${product.stock} left`,
        variant: 'secondary' as const,
      };
    return null;
  }, [product.stock]);

  return (
    <div className='relative aspect-square h-80 w-full overflow-hidden bg-slate-100 dark:bg-slate-600'>
      {/* Main Image */}
      <Link
        href={`/products/${product.id}`}
        className='relative block h-full w-full'
      >
        <Image
          src={currentImage as string}
          alt={`${product.title} - Image ${activeImageIndex + 1}`}
          fill
          priority={true}
          className={cn(
            'object-cover transition-all duration-500',
            isImageLoaded ? 'scale-100 opacity-100' : 'scale-95 opacity-0',
            'group-hover:scale-105',
          )}
          onLoad={() => setIsImageLoaded(true)}
          priority={activeImageIndex === 0}
        />
      </Link>
      {/* Stock Status Badge */}
      {stockStatus && (
        <Badge
          variant={stockStatus.variant}
          className='absolute top-3 left-3 z-10 shadow-md'
        >
          {stockStatus.label}
        </Badge>
      )}
      {/* Dot Indicators */}
      {hasMultipleImages && (
        <div className='absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10'>
          {images.map((_, index) => (
            <button
              key={index}
              onClick={(e) => handleDotClick(e, index)}
              aria-label={`View image ${index + 1}`}
              className={cn(
                'h-1.5 rounded-full cursor-pointer transition-all duration-300',
                activeImageIndex === index
                  ? 'w-6 bg-white shadow-md'
                  : 'w-1.5 bg-white/60 hover:bg-white/80',
              )}
            />
          ))}
        </div>
      )}
      {/* Image Counter */}
      {hasMultipleImages && (
        <div className='absolute top-3 right-3 z-10'>
          <Badge variant='secondary' className='text-xs backdrop-blur-sm'>
            {activeImageIndex + 1} / {images.length}
          </Badge>
        </div>
      )}
    </div>
  );
}
