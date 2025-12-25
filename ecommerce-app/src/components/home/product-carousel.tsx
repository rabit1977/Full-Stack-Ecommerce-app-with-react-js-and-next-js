'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Product } from '@/lib/types';
import { formatPrice } from '@/lib/utils/formatters';
import { getProductImage } from '@/lib/utils/product-images';
import {
  AnimatePresence,
  motion,
  PanInfo,
  Variants,
} from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Star,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

interface ProductCarouselProps {
  products: Product[];
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

export const ProductCarousel = ({
  products,
  carouselLimit = 8,
  autoPlayInterval = 5000,
}: ProductCarouselProps) => {
  const router = useRouter();
  const carouselProducts = useMemo(
    () => products.slice(0, carouselLimit),
    [products, carouselLimit]
  );

  const [[page, direction], setPage] = useState([0, 0]);
  const [isPaused, setIsPaused] = useState(false);

  const productIndex = page % carouselProducts.length;
  const currentProduct = carouselProducts[productIndex];

  const paginate = useCallback((newDirection: number) => {
    setPage(([prevPage]) => [prevPage + newDirection, newDirection]);
  }, []);

  const goToSlide = useCallback((slideIndex: number) => {
    const newDirection = slideIndex > page ? 1 : -1;
    setPage([slideIndex, newDirection]);
  }, [page]);

  const navigateToProduct = useCallback(
    (productId: string) => {
      router.push(`/products/${productId}`);
    },
    [router]
  );

  useEffect(() => {
    if (carouselProducts.length <= 1 || isPaused) return;
    const timer = setInterval(() => paginate(1), autoPlayInterval);
    return () => clearInterval(timer);
  }, [isPaused, autoPlayInterval, paginate, carouselProducts.length]);

  const handleDragEnd = (
    e: MouseEvent | TouchEvent | PointerEvent,
    { offset, velocity }: PanInfo
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
      className='relative w-full aspect-[16/9] sm:aspect-[21/9] max-h-[600px] overflow-hidden bg-slate-900 focus:outline-none'
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role='region'
      aria-label='Featured products carousel'
    >
      <AnimatePresence initial={false} custom={direction}>
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
            <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent' />
            <div className='absolute inset-0 flex flex-col justify-end p-6 sm:p-8 lg:p-12'>
              <div className='max-w-4xl space-y-4'>
                {currentProduct.category && (
                  <Badge variant='secondary' className='w-fit backdrop-blur-sm'>
                    {currentProduct.category}
                  </Badge>
                )}
                <h2 className='text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight'>
                  {currentProduct.title}
                </h2>
                <p className='text-sm sm:text-base lg:text-lg text-slate-200 max-w-2xl line-clamp-2'>
                  {currentProduct.description}
                </p>
                <div className='flex items-center gap-4 flex-wrap'>
                  <span className='text-2xl sm:text-3xl font-bold text-white'>
                    {formatPrice(currentProduct.price)}
                  </span>
                  {currentProduct.rating && (
                    <div className='flex items-center gap-1 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1'>
                      <Star className='h-4 w-4 fill-yellow-400 text-yellow-400' />
                      <span className='text-sm font-medium text-white'>
                        {currentProduct.rating.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
                <Button
                  size='lg'
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateToProduct(currentProduct.id);
                  }}
                  className='w-fit gap-2'
                >
                  View Product
                  <ChevronRight className='h-4 w-4' />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {carouselProducts.length > 1 && (
        <>
          <button
            onClick={() => paginate(-1)}
            className='absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-all duration-200 z-10 group'
            aria-label='Previous product'
          >
            <ChevronLeft className='h-6 w-6 group-hover:scale-110 transition-transform' />
          </button>
          <button
            onClick={() => paginate(1)}
            className='absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-all duration-200 z-10 group'
            aria-label='Next product'
          >
            <ChevronRight className='h-6 w-6 group-hover:scale-110 transition-transform' />
          </button>
          <div className='absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10'>
            {carouselProducts.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === productIndex
                    ? 'w-8 bg-white'
                    : 'w-2 bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={index === productIndex ? 'true' : 'false'}
              />
            ))}
          </div>
          <div className='absolute top-4 right-4 flex items-center gap-2 z-10'>
            {isPaused && (
              <div className='bg-black/40 backdrop-blur-sm rounded-full px-3 py-1 text-white text-sm'>
                Paused
              </div>
            )}
            <button
              onClick={() => setIsPaused(!isPaused)}
              className='p-2 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-colors'
              aria-label={isPaused ? 'Play carousel' : 'Pause carousel'}
            >
              {isPaused ? (
                <Play className='h-5 w-5' />
              ) : (
                <Pause className='h-5 w-5' />
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
};
