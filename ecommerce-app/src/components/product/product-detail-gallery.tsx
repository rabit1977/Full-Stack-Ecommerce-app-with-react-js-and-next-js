'use client';

import { Badge } from '@/components/ui/badge';
import { ProductWithRelations } from '@/lib/types';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';

interface ProductDetailGalleryProps {
  product: ProductWithRelations;
}

export function ProductDetailGallery({ product }: ProductDetailGalleryProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Get all available images
  const images = useMemo(() => {
    const imageUrls = product.images?.map((image) => image.url) ?? [];
    if (product.thumbnail) {
      imageUrls.unshift(product.thumbnail);
    }
    const uniqueImages = [...new Set(imageUrls)];
    return uniqueImages.length > 0 ? uniqueImages : ['/images/placeholder.jpg'];
  }, [product.thumbnail, product.images]);

  const currentImage = images[activeImageIndex];

  const handleNext = () => {
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePosition({ x, y });
  };

  // Reset zoom on image change
  useEffect(() => {
    setIsZoomed(false);
  }, [activeImageIndex]);

  return (
    <div className='flex flex-col gap-6 select-none'>
        {/* Main Image Stage */}
        <div 
          className='group relative aspect-square w-full overflow-hidden rounded-3xl border border-border bg-secondary/20 shadow-sm'
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
          role="region"
          aria-label="Product image gallery"
        >
           <AnimatePresence mode='wait'>
             <motion.div
               key={currentImage}
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               transition={{ duration: 0.3 }}
               className='relative h-full w-full'
             >
               <Image
                 src={currentImage}
                 alt={product.title}
                 fill
                 className={cn(
                   'object-cover transition-transform duration-200',
                   isZoomed ? 'scale-150' : 'scale-100'
                 )}
                 style={isZoomed ? {
                   transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                   cursor: 'zoom-in'
                 } : undefined}
                 priority
               />
             </motion.div>
           </AnimatePresence>

           {/* Overlay Controls */}
           <div className='absolute inset-0 pointer-events-none flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity'>
              {images.length > 1 && (
                <>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                    className='pointer-events-auto h-10 w-10 rounded-full bg-black/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/40 transition-colors'
                  >
                    <ChevronLeft className='h-6 w-6' />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleNext(); }}
                    className='pointer-events-auto h-10 w-10 rounded-full bg-black/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/40 transition-colors'
                  >
                    <ChevronRight className='h-6 w-6' />
                  </button>
                </>
              )}
           </div>
           
           <div className='absolute top-4 right-4 pointer-events-none'>
             <Badge variant='secondary' className='backdrop-blur-md bg-white/70'>
               <ZoomIn className='h-3 w-3 mr-1' />
               Hover to Zoom
             </Badge>
           </div>
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className='scrollbar-hide flex gap-3 overflow-x-auto pb-2'>
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={cn(
                  'relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border transition-all hover:opacity-100',
                  activeImageIndex === idx
                    ? 'border-primary ring-2 ring-primary/20 opacity-100'
                    : 'border-transparent opacity-60 hover:border-border'
                )}
              >
                <Image
                  src={img}
                  alt={`${product.title} thumbnail ${idx + 1}`}
                  fill
                  className='object-cover'
                />
              </button>
            ))}
          </div>
        )}
    </div>
  );
}
