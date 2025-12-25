'use client';

import { Product } from '@/lib/types';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useRef, useState } from 'react';

interface ProductImageGalleryProps {
  product: Product;
  activeImage: string;
  selectedOptions: Record<string, string>;
  onOptionChange: (optionName: string, value: string) => void;
}

/**
 * Get safe image URL with fallback
 */
const getSafeImageUrl = (url: string | undefined): string => {
  return url || '/images/placeholder.jpg';
};

/**
 * ProductImageGallery - Displays product images with zoom functionality
 * 
 * Features:
 * - Main image display with zoom on hover
 * - Thumbnail gallery for color variants
 * - 250% zoom with smooth cursor tracking
 * - Lens indicator for zoom area
 */
export function ProductImageGallery({
  product,
  activeImage,
  selectedOptions,
  onOptionChange,
}: ProductImageGalleryProps) {
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Get color option and its variants for thumbnails
  const colorOption = product.options?.find((opt) => opt.type === 'color');
  const thumbnailVariants = colorOption?.variants || [];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;

    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setZoomPosition({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  const handleMouseEnter = () => setShowZoom(true);
  const handleMouseLeave = () => {
    setShowZoom(false);
    setZoomPosition({ x: 50, y: 50 });
  };

  const handleThumbnailClick = (variantValue: string) => {
    if (colorOption) {
      onOptionChange(colorOption.name, variantValue);
    }
  };

  return (
    <div className="space-y-4">
      {/* Main Image Container */}
      <div
        ref={imageContainerRef}
        className="relative h-80 w-full overflow-hidden rounded-xl border dark:border-slate-800 sm:h-[400px] cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Base Image */}
        <Image
          src={getSafeImageUrl(activeImage)}
          alt={product.title}
          width={500}
          height={400}
          className="h-full w-full object-cover"
          priority
        />

        {/* Zoom Overlay */}
        {showZoom && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Zoomed Background Image */}
            <div
              className="absolute inset-0 bg-no-repeat"
              style={{
                backgroundImage: `url(${getSafeImageUrl(activeImage)})`,
                backgroundSize: '250%',
                backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
              }}
            />

            {/* Lens Indicator */}
            <div
              className="absolute w-20 h-20 border-2 border-white/50 rounded-full"
              style={{
                left: `calc(${zoomPosition.x}% - 2.5rem)`,
                top: `calc(${zoomPosition.y}% - 2.5rem)`,
              }}
            />
          </div>
        )}
      </div>

      {/* Thumbnail Gallery */}
      {thumbnailVariants.length > 0 && (
        <div className="grid grid-cols-4 gap-4">
          {thumbnailVariants.map((variant) => {
            const isSelected = colorOption && selectedOptions[colorOption.name] === variant.value;
            
            return (
              <button
                key={variant.value}
                onClick={() => handleThumbnailClick(variant.value)}
                className={cn(
                  'overflow-hidden rounded-lg border transition-all duration-200 dark:border-slate-800',
                  isSelected
                    ? 'ring-2 ring-slate-900 ring-offset-2 dark:ring-slate-50'
                    : 'opacity-70 hover:opacity-100'
                )}
                aria-label={`Select ${variant.name} color`}
              >
                <Image
                  src={getSafeImageUrl(variant.image || product.images?.[0])}
                  alt={variant.name}
                  width={96}
                  height={96}
                  className="h-20 w-full object-cover sm:h-24"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}