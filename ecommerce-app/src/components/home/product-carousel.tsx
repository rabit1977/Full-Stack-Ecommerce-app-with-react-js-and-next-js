'use client';

import { Button } from '@/components/ui/button';
import { ProductWithRelations } from '@/lib/types'; // ✅ Changed import
import { formatPrice } from '@/lib/utils/formatters';
import { getProductImage } from '@/lib/utils/product-images';
import { AnimatePresence, motion, PanInfo, Variants } from 'framer-motion';
import { ChevronLeft, ChevronRight, Pause, Play, Star } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

interface ProductCarouselProps {
  products: ProductWithRelations[]; // ✅ Changed type
  carouselLimit?: number;
  autoPlayInterval?: number;
}

const slideVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.32, 0.72, 0, 1],
    },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
    transition: {
      duration: 0.6,
      ease: [0.32, 0.72, 0, 1],
    },
  }),
};

const SWIPE_CONFIDENCE_THRESHOLD = 10000;

/**
 * Product Carousel Component
 * 
 * Interactive carousel for showcasing featured products
 * 
 * Features:
 * - Auto-play with pause on hover
 * - Swipe/drag support
 * - Keyboard navigation (arrow keys)
 * - Responsive design
 * - Smooth animations
 * - Accessible controls
 */
export const ProductCarousel = ({
  products,
  carouselLimit = 8,
  autoPlayInterval = 5000,
}: ProductCarouselProps) => {
  const router = useRouter();
  const carouselProducts = useMemo(
    () => products.slice(0, carouselLimit),
    [products, carouselLimit],
  );

  const [[page, direction], setPage] = useState([0, 0]);
  const [isPaused, setIsPaused] = useState(false);

  const productIndex = page % carouselProducts.length;
  const currentProduct = carouselProducts[productIndex];

  const paginate = useCallback((newDirection: number) => {
    setPage(([prevPage]) => [prevPage + newDirection, newDirection]);
  }, []);

  const goToSlide = useCallback(
    (slideIndex: number) => {
      const newDirection = slideIndex > page ? 1 : -1;
      setPage([slideIndex, newDirection]);
    },
    [page],
  );

  const navigateToProduct = useCallback(
    (productId: string) => {
      router.push(`/products/${productId}`);
    },
    [router],
  );

  useEffect(() => {
    if (carouselProducts.length <= 1 || isPaused) return;
    const timer = setInterval(() => paginate(1), autoPlayInterval);
    return () => clearInterval(timer);
  }, [isPaused, autoPlayInterval, paginate, carouselProducts.length]);

  const handleDragEnd = (
    e: MouseEvent | TouchEvent | PointerEvent,
    { offset, velocity }: PanInfo,
  ) => {
    const swipe = Math.abs(offset.x) * velocity.x;
    if (swipe < -SWIPE_CONFIDENCE_THRESHOLD) {
      paginate(1);
    } else if (swipe > SWIPE_CONFIDENCE_THRESHOLD) {
      paginate(-1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      paginate(-1);
    } else if (e.key === 'ArrowRight') {
      paginate(1);
    }
  };

  if (carouselProducts.length === 0) {
    return null;
  }

  return (
    <div
      className='relative w-full aspect-video sm:aspect-21/9 max-h-150 overflow-hidden bg-slate-900 focus:outline-none rounded-xl'
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role='region'
      aria-label='Featured products carousel'
      aria-live='polite'
    >
      <AnimatePresence initial={false} custom={direction} mode='wait'>
        <motion.div
          key={page}
          custom={direction}
          variants={slideVariants}
          initial='enter'
          animate='center'
          exit='exit'
          className='absolute inset-0 flex items-center justify-center overflow-hidden'
          drag='x'
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={handleDragEnd}
        >
          <div
            className='relative w-full h-full cursor-pointer'
            onClick={() => navigateToProduct(currentProduct.id)}
            role='button'
            tabIndex={-1}
            aria-label={`View ${currentProduct.title}`}
          >
            <Image
              src={getProductImage(currentProduct)}
              alt={currentProduct.title}
              fill
              className='object-cover'
              priority={productIndex === 0}
              sizes='100vw'
              quality={90}
            />
            {/* Gradient Overlay */}
            <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent' />
            
            {/* Content */}
            <div className='absolute inset-0 flex flex-col justify-end p-6 sm:p-8 lg:p-12'>
              <div className='max-w-4xl space-y-3 sm:space-y-4'>
                {/* Category Badge */}
                {currentProduct.category && (
                  <div className='w-fit backdrop-blur-sm bg-white/20 text-white px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold uppercase tracking-wide'>
                    {currentProduct.category}
                  </div>
                )}
                
                {/* Title */}
                <h2 className='text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight drop-shadow-lg'>
                  {currentProduct.title}
                </h2>
                
                {/* Description */}
                <p className='text-sm sm:text-base lg:text-lg text-slate-200 max-w-2xl line-clamp-2 drop-shadow-md'>
                  {currentProduct.description}
                </p>
                
                {/* Price & Rating */}
                <div className='flex items-center gap-3 sm:gap-4 flex-wrap'>
                  {currentProduct.discount > 0 ? (
                    <>
                      <span className='text-2xl sm:text-3xl lg:text-4xl font-bold text-white drop-shadow-lg'>
                        {formatPrice(
                          currentProduct.price *
                            (1 - currentProduct.discount / 100),
                        )}
                      </span>
                      <span className='text-base sm:text-lg lg:text-xl text-slate-300 line-through drop-shadow-md'>
                        {formatPrice(currentProduct.price)}
                      </span>
                      <div className='text-xs sm:text-sm font-bold bg-red-500 text-white px-2.5 py-1.5 rounded-lg shadow-lg'>
                        {currentProduct.discount}% OFF
                      </div>
                    </>
                  ) : (
                    <span className='text-2xl sm:text-3xl lg:text-4xl font-bold text-white drop-shadow-lg'>
                      {formatPrice(currentProduct.price)}
                    </span>
                  )}
                  
                  {currentProduct.rating > 0 && (
                    <div className='flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg'>
                      <Star className='h-4 w-4 fill-yellow-400 text-yellow-400' />
                      <span className='text-sm font-semibold text-white'>
                        {currentProduct.rating.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* CTA Button */}
                <Button
                  size='lg'
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateToProduct(currentProduct.id);
                  }}
                  className='w-fit gap-2 mt-2 shadow-xl hover:shadow-2xl transition-shadow'
                >
                  View Product
                  <ChevronRight className='h-4 w-4' />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation & Controls (only show if multiple products) */}
      {carouselProducts.length > 1 && (
        <>
          {/* Previous Button */}
          <button
            onClick={() => paginate(-1)}
            className='absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 transition-all duration-200 z-10 group focus:outline-none focus:ring-2 focus:ring-white/50'
            aria-label='Previous product'
          >
            <ChevronLeft className='h-5 w-5 sm:h-6 sm:w-6 group-hover:scale-110 transition-transform' />
          </button>
          
          {/* Next Button */}
          <button
            onClick={() => paginate(1)}
            className='absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 transition-all duration-200 z-10 group focus:outline-none focus:ring-2 focus:ring-white/50'
            aria-label='Next product'
          >
            <ChevronRight className='h-5 w-5 sm:h-6 sm:w-6 group-hover:scale-110 transition-transform' />
          </button>
          
          {/* Slide Indicators */}
          <div className='absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10'>
            {carouselProducts.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 ${
                  index === productIndex
                    ? 'w-6 sm:w-8 bg-white shadow-lg'
                    : 'w-1.5 sm:w-2 bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={index === productIndex ? 'true' : 'false'}
              />
            ))}
          </div>
          
          {/* Play/Pause Control */}
          <div className='absolute top-2 sm:top-4 right-2 sm:right-4 flex items-center gap-2 z-10'>
            {isPaused && (
              <div className='hidden sm:flex bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 text-white text-sm shadow-lg'>
                Paused
              </div>
            )}
            <button
              onClick={() => setIsPaused(!isPaused)}
              className='p-2 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg'
              aria-label={isPaused ? 'Play carousel' : 'Pause carousel'}
            >
              {isPaused ? (
                <Play className='h-4 w-4 sm:h-5 sm:w-5' />
              ) : (
                <Pause className='h-4 w-4 sm:h-5 sm:w-5' />
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
};