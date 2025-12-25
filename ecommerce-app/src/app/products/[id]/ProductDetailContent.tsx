// app/products/[id]/ProductDetailContent.tsx
'use client';

import { ProductPurchasePanel } from '@/components/product/product-purchase-panel';
import { RelatedProducts } from '@/components/product/related-products';
import { ReviewsSection } from '@/components/product/reviews-section';
import { ProductImageGallery } from '@/components/shared/product-image-gallery';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useProducts } from '@/lib/hooks/useProducts';
import { Product } from '@/lib/types';
import { staggerContainer, staggerItem } from '@/lib/constants/animations';
import { motion } from 'framer-motion';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { AlertCircle, ChevronLeft } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react'; // ✅ Correct import
import { ProductDetailSkeleton } from './ProductDetailSkeleton';

/**
 * Initialize default selected options from product
 */
const getDefaultOptions = (
  product: Product | undefined
): Record<string, string> => {
  if (!product?.options || product.options.length === 0) {
    return {};
  }

  return product.options.reduce<Record<string, string>>((acc, opt) => {
    const firstVariant = opt.variants?.[0]?.value ?? '';
    return {
      ...acc,
      [opt.name]: firstVariant,
    };
  }, {});
};

/**
 * Get active image based on selected color option
 */
const getActiveImage = (
  product: Product,
  selectedOptions: Record<string, string>
): string => {
  const colorOption = product.options?.find((opt) => opt.type === 'color');
  if (colorOption) {
    const selectedColor = selectedOptions[colorOption.name];
    const selectedVariant = colorOption.variants.find(
      (v) => v.value === selectedColor
    );
    return (
      selectedVariant?.image || product.images?.[0] || '/images/placeholder.jpg'
    );
  }
  return product.images?.[0] || '/images/placeholder.jpg';
};

/**
 * Product detail page component with animations
 */
export const ProductDetailContent = () => {
  const params = useParams();
  const router = useRouter();
  const { products, isLoading, error } = useProducts();

  // Find current product
  const product = useMemo(
    () => products.find((p) => p.id === params.id),
    [products, params.id]
  );

  // ✅ CORRECT: Centralized state for selected product options
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Compute active image based on selected options
  const activeImage = useMemo(() => {
    if (!product) return '/images/placeholder.jpg';
    return getActiveImage(product, selectedOptions);
  }, [product, selectedOptions]);

  // Initialize selected options when product loads
  useEffect(() => {
    if (product && !isInitialized) {
      setSelectedOptions(getDefaultOptions(product));
      setIsInitialized(true);
    }
  }, [product, isInitialized]);

  // Handle option changes
  const handleOptionChange = useCallback(
    (optionName: string, optionValue: string) => {
      setSelectedOptions((prev) => ({
        ...prev,
        [optionName]: optionValue,
      }));
    },
    []
  );

  // Navigation handlers
  const handleBackToProducts = useCallback(() => {
    router.push('/products');
  }, [router]);

  // Loading state
  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  // Error state
  if (error) {
    return (
      <div className='bg-white dark:bg-slate-900 min-h-screen'>
        <div className='container mx-auto px-4 py-16'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Alert variant='destructive'>
              <AlertCircle className='h-4 w-4' />
              <AlertTitle>Error Loading Product</AlertTitle>
              <AlertDescription>
                {error ||
                  'An unexpected error occurred while loading the product.'}
              </AlertDescription>
            </Alert>
            <div className='mt-6 flex justify-center'>
              <Button onClick={handleBackToProducts} variant='outline'>
                <ChevronLeft className='mr-2 h-4 w-4' />
                Back to Products
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Product not found state
  if (!product) {
    return (
      <div className='bg-white dark:bg-slate-900 min-h-screen'>
        <div className='container mx-auto px-4 py-16'>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className='text-center space-y-6'
          >
            <div className='flex justify-center'>
              <div className='rounded-full bg-muted p-4'>
                <AlertCircle className='h-12 w-12 text-muted-foreground' />
              </div>
            </div>

            <div className='space-y-2'>
              <h1 className='text-3xl font-bold tracking-tight'>
                Product Not Found
              </h1>
              <p className='text-lg text-muted-foreground max-w-md mx-auto'>
                The product you&apos;re looking for doesn&apos;t exist or may have
                been removed.
              </p>
            </div>

            <div className='flex flex-col sm:flex-row gap-3 justify-center'>
              <Button onClick={handleBackToProducts} size='lg'>
                <ChevronLeft className='mr-2 h-4 w-4' />
                Back to Products
              </Button>
              <Button
                variant='outline'
                size='lg'
                onClick={() => router.push('/')}
              >
                Go to Homepage
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Main product detail view with animations
  return (
    <motion.div
      initial='hidden'
      animate='visible'
      variants={staggerContainer}
      className='bg-white dark:bg-slate-900 min-h-screen'
    >
      <div className='container mx-auto px-4 py-8 sm:py-12'>
        {/* Breadcrumb Navigation */}
        <motion.nav
          variants={staggerItem}
          className='mb-6 sm:mb-8'
          aria-label='Breadcrumb'
        >
          <Button
            variant='ghost'
            onClick={handleBackToProducts}
            className='gap-2 -ml-2'
          >
            <ChevronLeft className='h-4 w-4' />
            Back to Products
          </Button>
        </motion.nav>

        {/* Product Main Content */}
        <motion.div
          variants={staggerItem}
          className='grid gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16'
        >
          {/* Product Image Gallery */}
          <ProductImageGallery
            product={product}
            activeImage={activeImage}
            selectedOptions={selectedOptions}
            onOptionChange={handleOptionChange}
          />

          {/* Product Purchase Panel */}
          <ProductPurchasePanel
            product={product}
            selectedOptions={selectedOptions}
            onOptionChange={handleOptionChange}
          />
        </motion.div>

        {/* Separator */}
        <Separator className='my-12 sm:my-16' />

        {/* Product Details Tabs/Sections */}
        <div className='space-y-12 sm:space-y-16'>
          {/* Reviews Section */}
          <motion.section
            variants={staggerItem}
            aria-labelledby='reviews-heading'
          >
            <ReviewsSection productId={product.id} />
          </motion.section>

          {/* Separator */}
          <Separator />

          {/* Related Products */}
          <motion.section
            variants={staggerItem}
            aria-labelledby='related-products-heading'
          >
            <RelatedProducts currentProduct={product} />
          </motion.section>
        </div>
      </div>
    </motion.div>
  );
};