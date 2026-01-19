'use client';

import { addItemToCartAction } from '@/actions/cart-actions';
import { toggleWishlistAction } from '@/actions/wishlist-actions';
import { Separator } from '@/components/ui/separator';
import { useQuickView } from '@/lib/context/quick-view-context';
import { AnimatePresence, motion } from 'framer-motion';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { AddToCartButton } from '../shared/quick-view-modal/AddToCartButton';
import { ModalHeader } from '../shared/quick-view-modal/ModalHeader';
import { ProductInfo } from '../shared/quick-view-modal/ProductInfo';
import { ProductOptions } from '../shared/quick-view-modal/ProductOptions';
import { QuantitySelector } from '../shared/quick-view-modal/QuantitySelector';
import { ProductImageCarousel } from './product-image-carousel';

interface ProductQuickViewProps {
  // You might pass initial wishlist state here if available
  initialIsWished?: boolean;
}

export function QuickViewModal({
  initialIsWished = false,
}: ProductQuickViewProps) {
  const { isOpen, product, closeModal } = useQuickView();
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});
  const [isPending, startTransition] = useTransition();
  const [isWished, setIsWished] = useState(initialIsWished);

  if (!isOpen || !product) {
    return null;
  }

  // 2. The Logic (Identical to your ProductPurchasePanel)
  const handleToggleWishlist = () => {
    startTransition(async () => {
      // Optimistic update (optional, makes it feel faster)
      setIsWished((prev) => !prev);

      const result = await toggleWishlistAction(product.id);

      if (!result.success) {
        // Revert on failure
        setIsWished((prev) => !prev);
        toast.error(result.error ?? 'Wishlist update failed');
        return;
      }

      // Sync with server response
      const wished = result.wishlist.includes(product.id);
      setIsWished(wished);

      toast.success(wished ? 'Added to wishlist' : 'Removed from wishlist');
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard');
  };

  const handleAddToCart = () => {
    startTransition(async () => {
      const result = await addItemToCartAction(
        product.id,
        quantity,
        selectedOptions,
      );
      if (result.success) {
        toast.success('Added to cart');
        closeModal();
      } else {
        toast.error(result.message || 'Failed to add to cart');
      }
    });
  };

  const isOutOfStock = product.stock === 0;
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && product && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm'
          onClick={closeModal}
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
              onClose={closeModal}
              onToggleWishlist={handleToggleWishlist} // TODO
              isWished={isWished} // TODO
              onShare={handleShare} // TODO
            />

            <div className='p-6 flex flex-col md:flex-row gap-8 md:gap-12 shadow-lg rounded-xl border'>
              <div className='h-full w-full md:w-1/2 shrink-0'>
                <ProductImageCarousel product={product} />
              </div>

              <div className='space-y-6'>
                <ProductInfo product={product} />
                <Separator />

                {product.options && (
                  <>
                    <ProductOptions
                      options={product.options as any}
                      selectedOptions={selectedOptions}
                      onOptionChange={(name, value) =>
                        setSelectedOptions((prev) => ({
                          ...prev,
                          [name]: value,
                        }))
                      }
                    />
                    <Separator />
                  </>
                )}

                {!isOutOfStock && (
                  <>
                    <QuantitySelector
                      quantity={quantity}
                      maxStock={product.stock}
                      onQuantityChange={setQuantity}
                      disabled={isPending}
                    />
                    <Separator />
                  </>
                )}

                <AddToCartButton
                  isOutOfStock={isOutOfStock}
                  isAdding={isPending}
                  isAdded={false} // This state seems to be for post-add animation, can be enhanced later
                  onAddToCart={handleAddToCart}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
