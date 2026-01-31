'use client';

import { addItemToCartAction } from '@/actions/cart-actions';
import { Button } from '@/components/ui/button';
import { ProductWithRelations } from '@/lib/types';
import { formatPrice } from '@/lib/utils/formatters';
import { getProductImage } from '@/lib/utils/product-images';
import { AnimatePresence, motion, PanInfo, Variants } from 'framer-motion';
import {
    ChevronLeft,
    ChevronRight,
    Pause,
    Play,
    ShoppingCart,
    Star,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState, useTransition } from 'react';
import { toast } from 'sonner';

interface ProductCarouselProps {
	products: ProductWithRelations[];
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
	const [isPending, startTransition] = useTransition();
	const carouselProducts = useMemo(
		() => products.slice(0, carouselLimit),
		[products, carouselLimit]
	);

	const [[page, direction], setPage] = useState([0, 0]);
	const [isPaused, setIsPaused] = useState(false);

	const productIndex = page % carouselProducts.length;
	const currentProduct = carouselProducts[productIndex];

	const paginate = useCallback(
		(newDirection: number) => {
			setPage(([prevPage]) => [prevPage + newDirection, newDirection]);
		},
		[]
	);

	const goToSlide = useCallback(
		(slideIndex: number) => {
			const newDirection = slideIndex > page ? 1 : -1;
			setPage([slideIndex, newDirection]);
		},
		[page]
	);

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

	const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		startTransition(async () => {
			const result = await addItemToCartAction(currentProduct.id, 1);
			if (result.success) {
				toast.success(result.message);
			} else {
				toast.error(result.message);
			}
		});
	};

	if (carouselProducts.length === 0) {
		return null;
	}

	return (
		<div
			className='relative group w-full aspect-video sm:aspect-21/9 max-h-150 overflow-hidden bg-black focus:outline-none'
			onMouseEnter={() => setIsPaused(true)}
			onMouseLeave={() => setIsPaused(false)}
			onKeyDown={handleKeyDown}
			tabIndex={0}
			role='region'
			aria-label='Featured products carousel'
			aria-live='polite'
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
						role='button'
						tabIndex={-1}
						aria-label={`View ${currentProduct.title}`}
					>
						<Image
							// eslint-disable-next-line @typescript-eslint/no-explicit-any
							src={getProductImage(currentProduct as any)}
							alt={currentProduct.title}
							fill
							className='object-cover'
							priority={productIndex === 0}
							sizes='100vw'
							quality={90}
						/>
						<div className='absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 sm:opacity-60 transition-opacity duration-300' />

						<div className='absolute inset-0 flex flex-col justify-end p-4 sm:p-10 lg:p-16'>
							<div className='max-w-3xl w-full space-y-3 sm:space-y-5 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100'>
								
                                <div className="flex items-center gap-3">
                                    {currentProduct.category && (
                                        <span className='backdrop-blur-md bg-white/10 border border-white/20 text-white px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest shadow-sm'>
                                            {currentProduct.category}
                                        </span>
                                    )}
                                    {currentProduct.rating > 0 && (
										<div className='flex items-center gap-1 bg-black/20 backdrop-blur-md rounded-full px-2 py-1 border border-white/10'>
											<Star className='h-3 w-3 fill-yellow-400 text-yellow-400' />
											<span className='text-[10px] sm:text-xs font-bold text-white'>
												{currentProduct.rating.toFixed(1)}
											</span>
										</div>
									)}
                                </div>

								<h2 className='text-3xl sm:text-5xl lg:text-7xl font-black text-white leading-[0.9] tracking-tight drop-shadow-xl'>
									{currentProduct.title}
								</h2>

								<div className='flex items-center gap-3 sm:gap-4'>
									{currentProduct.discount > 0 ? (
										<div className="flex items-baseline gap-2">
											<span className='text-2xl sm:text-4xl font-bold text-white drop-shadow-md'>
												{formatPrice(
													currentProduct.price *
														(1 - currentProduct.discount / 100)
												)}
											</span>
											<span className='text-sm sm:text-lg text-white/50 line-through font-medium'>
												{formatPrice(currentProduct.price)}
											</span>
                                            <span className='text-[10px] sm:text-xs font-bold bg-red-500/90 backdrop-blur-sm text-white px-2 py-0.5 rounded-full'>
												-{currentProduct.discount}%
											</span>
										</div>
									) : (
										<span className='text-2xl sm:text-4xl font-bold text-white drop-shadow-md'>
											{formatPrice(currentProduct.price)}
										</span>
									)}
								</div>

                                <p className='text-sm sm:text-lg text-white/75 font-medium max-w-xl line-clamp-2 leading-relaxed drop-shadow-sm hidden xs:block'>
									{currentProduct.description}
								</p>

								<div className='w-full sm:w-auto pt-2 sm:pt-4 pb-6 sm:pb-8 grid grid-cols-2 sm:flex gap-3 sm:gap-4'>
									<Button
										size='default'
										onClick={(e) => {
											e.stopPropagation();
											navigateToProduct(currentProduct.id);
										}}
										className='w-full sm:w-auto h-10 sm:h-12 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-xs sm:text-sm shadow-xl border-0'
									>
										View Details
									</Button>
									<Button
										size='default'
										variant='outline'
										onClick={handleAddToCart}
										disabled={isPending}
										className='w-full sm:w-auto h-10 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-md font-bold text-xs sm:text-sm hover:text-white hover:border-white/40'
									>
										<ShoppingCart className='h-3.5 w-3.5 mr-2' />
										{isPending ? 'Adding...' : 'Add to Cart'}
									</Button>
								</div>
							</div>
						</div>
					</div>
				</motion.div>
			</AnimatePresence>

			{carouselProducts.length > 1 && (
				<>
					<button
						onClick={(e) => {
                            e.stopPropagation();
                            paginate(-1);
                        }}
						className='absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-md border border-white/10 transition-all duration-300 z-10 focus:outline-none focus:ring-2 focus:ring-white/50 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0'
						aria-label='Previous product'
					>
						<ChevronLeft className='h-6 w-6' />
					</button>

					<button
						onClick={(e) => {
                            e.stopPropagation();
                            paginate(1);
                        }}
						className='absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-md border border-white/10 transition-all duration-300 z-10 focus:outline-none focus:ring-2 focus:ring-white/50 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0'
						aria-label='Next product'
					>
						<ChevronRight className='h-6 w-6' />
					</button>

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
