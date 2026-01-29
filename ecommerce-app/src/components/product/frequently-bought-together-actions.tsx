'use client';

import { addItemToCartAction } from '@/actions/cart-actions';
import { ProductWithRelations } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Plus, ShoppingBag } from 'lucide-react';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { ProductCard } from './product-card';

interface FrequentlyBoughtTogetherActionsProps {
  products: ProductWithRelations[];
}

export function FrequentlyBoughtTogetherActions({
  products,
}: FrequentlyBoughtTogetherActionsProps) {
  const [isPending, startTransition] = useTransition();
  const [added, setAdded] = useState(false);

  const totalPrice = products.reduce((acc, p) => acc + p.price, 0);

  const handleAddAll = () => {
    startTransition(async () => {
      let successCount = 0;
      let failureCount = 0;

      // Add items sequentially to avoid race conditions with cart state if any
      // or parallel if the action is robust. Parallel is faster.
      // addItemToCartAction uses transactions, so parallel might be tricky if they lock same cart.
      // Better to do sequential for safety.
      
      for (const product of products) {
        if (product.stock <= 0) {
            failureCount++;
            continue;
        }

        const res = await addItemToCartAction(product.id, 1);
        if (res.success) {
          successCount++;
        } else {
          failureCount++;
        }
      }

      if (successCount > 0) {
        setAdded(true);
        toast.success(`Added ${successCount} items to cart!`);
        // Reset added state after a delay or keep it
        setTimeout(() => setAdded(false), 3000);
      } else if (failureCount > 0) {
        toast.error('Failed to add items to cart. Please check stock.');
      }
    });
  };

  return (
    <div className='bg-secondary/20 rounded-2xl p-6 border border-border/50'>
      <div className='flex flex-col md:flex-row items-center gap-6 md:gap-8'>
        {/* List of Products */}
        <div className='flex items-center gap-4 overflow-x-auto pb-4 md:pb-0 w-full md:w-auto scrollbar-hide'>
          {products.map((product, idx) => (
            <div key={product.id} className='flex items-center gap-4 shrink-0'>
              {idx > 0 && <Plus className='h-5 w-5 text-muted-foreground' />}
              <div className='w-40 sm:w-48'>
                <ProductCard product={product} />
              </div>
            </div>
          ))}
        </div>

        {/* Separator */}
        <div className='hidden md:block w-px h-32 bg-border/60 mx-4' />

        {/* Actions Panel */}
        <div className='bg-background p-6 rounded-xl border border-border/40 shadow-sm min-w-[200px] text-center w-full md:w-auto'>
          <p className='text-muted-foreground text-sm mb-2'>Combine & Save</p>
          <div className='mb-4'>
             <div className='text-2xl font-black text-primary'>
                ${totalPrice.toFixed(2)}
             </div>
             <p className='text-xs text-muted-foreground'>
                For {products.length} items
             </p>
          </div>
          
          <Button
            onClick={handleAddAll}
            disabled={isPending || added}
            className={cn(
                'w-full font-bold transition-all duration-300',
                added ? 'bg-green-600 hover:bg-green-700' : 'btn-premium'
            )}
          >
            {isPending ? (
                <span className='flex items-center gap-2'>
                  <div className='h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin' />
                  Adding...
                </span>
            ) : added ? (
                <span className='flex items-center gap-2'>
                    <ShoppingBag className='h-4 w-4' />
                    Added!
                </span>
            ) : (
                'Add All to Cart'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
