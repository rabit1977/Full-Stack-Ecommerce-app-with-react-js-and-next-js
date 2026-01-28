'use client';

import { getRecentlyViewedAction, recordViewAction } from '@/actions/recently-viewed-actions';
import { ProductCard } from '@/components/product/product-card';
import { ProductWithRelations } from '@/lib/types';
import { History } from 'lucide-react';
import { useEffect, useState } from 'react';

interface RecentlyViewedProductsProps {
  currentProduct: ProductWithRelations;
}

export function RecentlyViewedProducts({ currentProduct }: RecentlyViewedProductsProps) {
  const [products, setProducts] = useState<any[]>([]); // Use appropriate type if available or cast
  const [isLoading, setIsLoading] = useState(true);

  // 1. Record the view (side effect)
  useEffect(() => {
    if (currentProduct?.id) {
        // Record non-blocking
        recordViewAction(currentProduct.id).catch(err => 
            console.error('Failed to record view:', err)
        );
    }
  }, [currentProduct?.id]);

  // 2. Fetch history
  useEffect(() => {
    let isMounted = true;
    
    async function fetchHistory() {
      if (!currentProduct?.id) return;
      
      // Delay slightly to ensure the backend record isn't racing (though upsert is atomic, finding might miss it if immediate)
      // Actually we want previous history, excluding current? 
      // Usually "Recently Viewed" excludes the one you are looking at now, because you are looking at it.
      
      const res = await getRecentlyViewedAction(5, currentProduct.id);
      
      if (isMounted) {
        if (res.success && res.products) {
            setProducts(res.products);
        }
        setIsLoading(false);
      }
    }

    fetchHistory();

    return () => { isMounted = false; };
  }, [currentProduct?.id]);

  if (!isLoading && products.length === 0) {
    return null;
  }

  // Cast product for ProductCard (it expects specific structure)
  // getRecentlyViewedAction returns compatible structure mostly
  
  return (
    <div className='w-full space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500'>
      <div className="flex items-center gap-2 mb-4">
        <History className="h-5 w-5 text-primary" />
        <h2 className='text-2xl font-bold tracking-tight'>Recently Viewed</h2>
      </div>
      
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6'>
        {isLoading ? (
           // Skeleton
           Array.from({ length: 4 }).map((_, i) => (
             <div key={i} className="aspect-[3/4] rounded-2xl bg-muted/30 animate-pulse" />
           ))
        ) : (
           products.map((product) => (
             <ProductCard 
                key={product.id} 
                product={product as any} 
                initialIsWished={false} // We don't know wishlist status here easily without fetching
             />
           ))
        )}
      </div>
    </div>
  );
}
