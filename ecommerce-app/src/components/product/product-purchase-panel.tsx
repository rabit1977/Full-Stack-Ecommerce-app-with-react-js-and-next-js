'use client';

import { Button } from '@/components/ui/button';
import { Stars } from '@/components/ui/stars';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { addToCart, toggleWishlist } from '@/lib/store/thunks/cartThunks';
import { CartItem, Product } from '@/lib/types';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/utils/formatters';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Check,
  Heart,
  Minus,
  Plus,
  RotateCcw,
  ShoppingCart,
} from 'lucide-react';
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from 'react'; // ✅ Added useEffect

interface ProductPurchasePanelProps {
  product: Product;
  selectedOptions: Record<string, string>;
  onOptionChange: (optionName: string, optionValue: string) => void;
}

export function ProductPurchasePanel({
  product,
  selectedOptions,
  onOptionChange,
}: ProductPurchasePanelProps) {
  const dispatch = useAppDispatch();
  const { itemIds: wishlistItems } = useAppSelector((state) => state.wishlist);
  const cart = useAppSelector((state) => state.cart);
  const cartItems = cart?.cart || [];
  const [isPending, startTransition] = useTransition();
  const [quantity, setQuantity] = useState(product.stock > 0 ? 1 : 0);
  const [addedToCart, setAddedToCart] = useState(false);

  const isWished = useMemo(
    () => wishlistItems.includes(product.id),
    [wishlistItems, product.id]
  );

  // Calculate how many items of this product are already in the cart
  const quantityInCart = useMemo(() => {
    if (!cartItems || !Array.isArray(cartItems)) return 0;
    const cartItem = cartItems.find((item: CartItem) => item.id === product.id);
    return cartItem?.quantity || 0;
  }, [cartItems, product.id]);

  // Calculate remaining stock available to add
  const availableStock = useMemo(() => {
    return Math.max(0, product.stock - quantityInCart);
  }, [product.stock, quantityInCart]);

  const isOutOfStock = useMemo(() => availableStock === 0, [availableStock]);

  // ✅ FIXED: Reset quantity when available stock changes (use useEffect instead of useMemo)
  useEffect(() => {
    if (quantity > availableStock && availableStock > 0) {
      setQuantity(availableStock);
    } else if (availableStock === 0) {
      setQuantity(0);
    } else if (quantity === 0 && availableStock > 0) {
      // Reset to 1 when stock becomes available again
      setQuantity(1);
    }
  }, [availableStock, quantity]);

  const handleAddToCart = useCallback(() => {
    // Prevent adding if no stock available
    if (availableStock === 0 || quantity === 0) {
      return;
    }

    startTransition(() => {
      dispatch(
        addToCart({
          id: product.id,
          quantity,
          title: product.title,
          price: product.price,
          options: selectedOptions,
        })
      );
      setAddedToCart(true);

      // Calculate remaining stock after this addition
      const remainingStock = availableStock - quantity;

      // Reset quantity to 1 or available stock
      setQuantity(remainingStock > 0 ? Math.min(1, remainingStock) : 0);

      setTimeout(() => setAddedToCart(false), 2000);
    });
  }, [product, quantity, selectedOptions, dispatch, availableStock]);

  return (
    <div>
      <div className='text-sm uppercase tracking-wide text-slate-500 dark:text-slate-400'>
        {product.brand}
      </div>
      <h1 className='mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl'>
        {product.title}
      </h1>

      <div className='mt-4 flex items-center gap-4'>
        <div className='flex items-center gap-2'>
          <Stars value={product.rating} />
          <span className='text-sm text-slate-600 dark:text-slate-400'>
            {product.rating} ({product.reviewCount} reviews)
          </span>
        </div>
      </div>

      <div className='mt-6 flex items-baseline gap-3'>
        <span className='text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl'>
          {formatPrice(product.price)}
        </span>
      </div>

      <div className='mt-4'>
        {isOutOfStock ? (
          <p className='font-semibold text-red-500'>
            All items are already in your cart
          </p>
        ) : (
          <p className='text-sm text-slate-600 dark:text-slate-400'>
            Available to add: {availableStock} items
            {quantityInCart > 0 && (
              <span className='ml-1 text-slate-500'>
                ({quantityInCart} already in cart)
              </span>
            )}
          </p>
        )}
      </div>

      <p className='mt-6 leading-relaxed text-slate-600 dark:text-slate-300'>
        {product.description}
      </p>

      {product.options && product.options.length > 0 && (
        <div className='mt-6 space-y-4'>
          {product.options.map((option) => (
            <div key={option.name}>
              <h3 className='text-sm font-medium dark:text-white'>
                {option.name}
              </h3>
              <div className='mt-2 flex flex-wrap gap-2'>
                {option.variants.map((variant) => (
                  <button
                    key={variant.value}
                    type='button'
                    onClick={() => onOptionChange(option.name, variant.value)}
                    className={cn(
                      'relative flex items-center justify-center rounded-md p-0.5',
                      'focus:outline-none focus:ring-2 focus:ring-offset-2',
                      selectedOptions[option.name] === variant.value
                        ? 'ring-slate-900 dark:ring-slate-50'
                        : 'ring-transparent',
                      option.type === 'color'
                        ? 'h-8 w-8'
                        : 'h-10 px-4 text-sm font-medium border border-slate-200 dark:border-slate-700'
                    )}
                  >
                    {option.type === 'color' && (
                      <span
                        className='block h-full w-full rounded-md border border-gray-200'
                        style={{ backgroundColor: variant.value }}
                        title={variant.name}
                      />
                    )}
                    {option.type === 'size' && (
                      <span className='text-slate-900 dark:text-white'>
                        {variant.name}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className='mt-8 flex flex-col items-center gap-4 sm:flex-row'>
        <div className='flex items-center rounded-md border dark:border-slate-700'>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={isOutOfStock || quantity <= 1}
            aria-label='Decrease quantity'
          >
            <Minus className='h-4 w-4' />
          </Button>
          <span className='w-8 text-center dark:text-white'>{quantity}</span>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => setQuantity((q) => Math.min(availableStock, q + 1))}
            disabled={quantity >= availableStock}
            aria-label='Increase quantity'
          >
            <Plus className='h-4 w-4' />
          </Button>
        </div>

        <Button
          className='w-full sm:w-auto sm:flex-1'
          onClick={handleAddToCart}
          disabled={isOutOfStock || isPending || quantity === 0}
        >
          <AnimatePresence mode='wait' initial={false}>
            <motion.span
              key={addedToCart ? 'added' : isPending ? 'adding' : 'add'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className='flex items-center justify-center gap-2'
            >
              {addedToCart ? (
                <>
                  <Check className='h-5 w-5 text-green-400' /> Added!
                </>
              ) : isPending ? (
                <>
                  <RotateCcw className='h-5 w-5 animate-spin' /> Adding...
                </>
              ) : (
                <>
                  <ShoppingCart className='h-5 w-5' />{' '}
                  {isOutOfStock ? 'All in Cart' : 'Add to Cart'}
                </>
              )}
            </motion.span>
          </AnimatePresence>
        </Button>

        <Button
          variant={isWished ? 'secondary' : 'outline'}
          size='lg'
          onClick={() => dispatch(toggleWishlist(product.id))}
          aria-label={isWished ? 'Remove from wishlist' : 'Add to wishlist'}
          className='w-full sm:w-auto'
        >
          <Heart
            className={cn(
              'h-6 w-6 transition-colors',
              isWished ? 'fill-red-500 text-red-500' : ''
            )}
          />
        </Button>
      </div>
    </div>
  );
}
