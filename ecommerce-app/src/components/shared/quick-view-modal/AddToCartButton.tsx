import { Button } from '@/components/ui/button';
import { AddToCartButtonProps } from '@/lib/types/quickview';
import { motion } from 'framer-motion';
import { Check, RotateCcw, ShoppingCart } from 'lucide-react';

export const AddToCartButton = ({
  isOutOfStock,
  isAdding,
  isAdded,
  onAddToCart,
}: AddToCartButtonProps) => {
  return (
    <Button
      className='w-full h-12 text-base font-semibold'
      onClick={onAddToCart}
      disabled={isOutOfStock || isAdding}
      size='lg'
    >
      <motion.span
        key={isAdded ? 'added' : isAdding ? 'adding' : 'add'}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className='flex items-center justify-center gap-2'
      >
        {isAdded ? (
          <>
            <Check className='h-5 w-5' />
            Added to Cart!
          </>
        ) : isAdding ? (
          <>
            <RotateCcw className='h-5 w-5 animate-spin' />
            Adding to Cart...
          </>
        ) : (
          <>
            <ShoppingCart className='h-5 w-5' />
            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          </>
        )}
      </motion.span>
    </Button>
  );
};
