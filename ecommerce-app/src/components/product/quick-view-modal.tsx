'use client';

import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { setQuickViewProductId } from '@/lib/store/slices/uiSlice';
import { AnimatePresence, motion } from 'framer-motion';

import { Separator } from '@/components/ui/separator';
import { useKeyboardShortcuts } from '@/lib/hooks/useKeyboardShortcuts';
import { useQuickViewHandlers } from '@/lib/hooks/useQuickViewHandlers';
import { useQuickViewState } from '@/lib/hooks/useQuickViewState';
import { AddToCartButton } from '../shared/quick-view-modal/AddToCartButton';

import { ProductImageGallery } from '../shared/product-image-gallery';
import { ModalHeader } from '../shared/quick-view-modal/ModalHeader';
import { ProductInfo } from '../shared/quick-view-modal/ProductInfo';
import { ProductOptions } from '../shared/quick-view-modal/ProductOptions';
import { QuantitySelector } from '../shared/quick-view-modal/QuantitySelector';

const QuickViewModal = () => {
  const dispatch = useAppDispatch();
  const { quickViewProductId } = useAppSelector((state) => state.ui);
  const { products } = useAppSelector((state) => state.products);
  const { itemIds: wishlist } = useAppSelector((state) => state.wishlist);

  const product = products.find((p) => p.id === quickViewProductId);

  const {
    quantity,
    setQuantity,
    adding,
    setAdding,
    added,
    setAdded,
    selectedOptions,
    setSelectedOptions,
    activeImage,
    setActiveImage,
    validationError,
    setValidationError,
  } = useQuickViewState(product);

  const {
    handleAddToCart,
    handleToggleWishlist,
    handleOptionChange,
    handleQuantityChange,
  } = useQuickViewHandlers(
    product,
    quantity,
    selectedOptions,
    setAdding,
    setAdded,
    setActiveImage,
    setValidationError
  );

  const handleClose = () => dispatch(setQuickViewProductId(null));

  useKeyboardShortcuts(
    !!quickViewProductId,
    handleClose,
    !product?.stock ? undefined : handleAddToCart
  );

  // Unified option change handler that updates both state and active image
  const onOptionChange = (optionName: string, optionValue: string) => {
    const newOption = handleOptionChange(optionName, optionValue);
    if (newOption) {
      setSelectedOptions((prev) => ({ ...prev, ...newOption }));
    }
  };

  const onQuantityChange = (newQuantity: number) => {
    const validQuantity = handleQuantityChange(newQuantity);
    setQuantity(validQuantity);
  };

  const handleShare = () => {
    if (navigator.share && product) {
      navigator.share({
        title: product.title,
        text: product.description,
        url: window.location.href,
      });
    }
  };

  if (!product) return null;

  const isWished = wishlist?.includes(product.id);
  const isOutOfStock = product.stock === 0;

  return (
    <AnimatePresence>
      {quickViewProductId && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm'
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className='relative bg-background rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto'
            onClick={(e) => e.stopPropagation()}
          >
            <ModalHeader
              onClose={handleClose}
              onToggleWishlist={handleToggleWishlist}
              isWished={isWished}
              onShare={handleShare}
            />

            <div className='grid md:grid-cols-2 gap-8 p-6 md:p-8'>
              {/* Left Column - Images */}
              <ProductImageGallery
                product={product}
                activeImage={activeImage}
                selectedOptions={selectedOptions}
                onOptionChange={onOptionChange}
              />

              {/* Right Column - Product Details */}
              <div className='space-y-6'>
                <ProductInfo product={product} />

                <Separator />

                {/* Options */}
                {product.options && (
                  <>
                    <ProductOptions
                      options={product.options}
                      selectedOptions={selectedOptions}
                      onOptionChange={onOptionChange}
                      validationError={validationError}
                    />
                    <Separator />
                  </>
                )}

                {/* Quantity Selector */}
                {!isOutOfStock && (
                  <>
                    <QuantitySelector
                      quantity={quantity}
                      maxStock={product.stock}
                      onQuantityChange={onQuantityChange}
                      disabled={adding}
                    />
                    <Separator />
                  </>
                )}

                {/* Add to Cart Button */}
                <AddToCartButton
                  isOutOfStock={isOutOfStock}
                  isAdding={adding}
                  isAdded={added}
                  onAddToCart={handleAddToCart}
                />

                {/* Keyboard Shortcuts Hint */}
                <p className='text-xs text-center text-muted-foreground'>
                  Press{' '}
                  <kbd className='px-1.5 py-0.5 rounded bg-muted font-mono'>
                    Esc
                  </kbd>{' '}
                  to close
                  {!isOutOfStock && (
                    <>
                      {' • '}
                      <kbd className='px-1.5 py-0.5 rounded bg-muted font-mono'>
                        Ctrl+Enter
                      </kbd>{' '}
                      to add to cart
                    </>
                  )}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export { QuickViewModal };
