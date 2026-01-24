'use client';

import { addItemToCartAction } from '@/actions/cart-actions';
import {
    clearWishlistAction,
    toggleWishlistAction,
} from '@/actions/wishlist-actions';
import { Button } from '@/components/ui/button';
import { ProductWithRelations } from '@/lib/types';
import { formatPrice } from '@/lib/utils/formatters';
import { getProductImage } from '@/lib/utils/product-images';
import { ShoppingCart, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useOptimistic, useTransition } from 'react';
import { toast } from 'sonner';


function EmptyWishlist() {
  const router = useRouter();
  
  return (
    <div className='container-wide min-h-[50vh] flex items-center justify-center p-4'>
       <div className='max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-700'>
          <div className="w-24 h-24 bg-secondary/50 rounded-full flex items-center justify-center mx-auto mb-6">
             <Heart className='h-10 w-10 text-muted-foreground' />
          </div>
          <h2 className='text-3xl font-black text-foreground'>Your wishlist is empty</h2>
          <p className="text-muted-foreground text-lg">Start saving items you love to find them easily later.</p>
          <Button onClick={() => router.push('/products')} size="lg" className="btn-premium rounded-full px-8 shadow-lg shadow-primary/20">
             Explore Products
          </Button>
       </div>
    </div>
  );
}

import { Heart } from 'lucide-react';

export function WishlistClient({
  products,
}: {
  products: ProductWithRelations[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [optimisticProducts, removeOptimisticProduct] = useOptimistic(
    products,
    (currentProducts, productId: string) =>
      currentProducts.filter((p) => p.id !== productId)
  );

  const handleRemoveFromWishlist = (productId: string) => {
    startTransition(async () => {
      removeOptimisticProduct(productId);
      const result = await toggleWishlistAction(productId);
      if (result.success) {
        toast.success('Removed from wishlist');
        router.refresh(); 
      } else {
        toast.error(result.error || 'Failed to remove from wishlist');
      }
    });
  };

  const handleClearWishlist = () => {
    startTransition(async () => {
      const result = await clearWishlistAction();
      if (result.success) {
        toast.success('Wishlist cleared');
        router.refresh();
      } else {
        toast.error('Failed to clear wishlist');
      }
    });
  };

  const handleAddToCart = (productId: string) => {
    startTransition(async () => {
      const result = await addItemToCartAction(productId, 1);
      if (result.success) {
        toast.success('Added to cart');
        router.refresh(); 
      } else {
        toast.error(result.message || 'Failed to add to cart');
      }
    });
  };

  if (optimisticProducts.length === 0) {
      return (
         <div className='min-h-screen bg-slate-50 dark:bg-slate-950/50 pb-20 pt-10'>
            <div className='container-wide py-12'>
               <h1 className='text-3xl font-black tracking-tight text-foreground mb-8'>Your Wishlist</h1>
               <EmptyWishlist />
            </div>
         </div>
      );
  }

  return (
    <div className='min-h-screen bg-slate-50 dark:bg-slate-950/50 pb-20'>
      <div className='container-wide py-10 sm:py-16'>
        <div className='flex items-center justify-between mb-10'>
          <div className='space-y-1'>
            <h1 className='text-3xl sm:text-5xl font-black tracking-tight text-foreground'>
              Your Wishlist
            </h1>
            <p className='text-muted-foreground font-medium text-lg'>
              {optimisticProducts.length} item{optimisticProducts.length !== 1 ? 's' : ''} saved for later
            </p>
          </div>
          <Button
            variant='outline'
            onClick={handleClearWishlist}
            disabled={isPending || optimisticProducts.length === 0}
            className="rounded-full border-border/60 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-all font-medium"
          >
            <Trash2 className='mr-2 h-4 w-4' />
            Clear Wishlist
          </Button>
        </div>

        <div className='grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {optimisticProducts.map((product) => (
            <div
              key={product.id}
              className='glass-card group relative flex flex-col overflow-hidden rounded-3xl transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1'
            >
              <div className='aspect-square overflow-hidden relative bg-secondary'>
                <Image
                  src={getProductImage(product)}
                  alt={product.title}
                  fill
                  className='object-cover transition-transform duration-700 group-hover:scale-110'
                  sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw'
                />
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button 
                     size="sm" 
                     className="w-full rounded-full font-bold bg-white text-black hover:bg-white/90"
                     onClick={() => handleAddToCart(product.id)}
                     disabled={isPending}
                    >
                       <ShoppingCart className="h-4 w-4 mr-2" />
                       Add to Cart
                    </Button>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-3 right-3 h-8 w-8 rounded-full bg-black/20 backdrop-blur-md text-white border border-white/20 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all"
                  onClick={() => handleRemoveFromWishlist(product.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className='p-6 flex flex-col grow'>
                <div className="mb-4">
                   <p className='text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1'>
                     {product.brand || 'Brand'}
                   </p>
                   <h3 className='font-bold text-lg text-foreground leading-tight line-clamp-2 mb-2'>
                     <Link href={`/products/${product.id}`} className='hover:text-primary transition-colors'>
                        {product.title}
                     </Link>
                   </h3>
                   <p className='text-xl font-black text-primary'>
                     {formatPrice(product.price)}
                   </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
