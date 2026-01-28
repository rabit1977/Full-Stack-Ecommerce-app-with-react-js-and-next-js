import { getFrequentlyBoughtTogetherAction } from '@/actions/product-relation-actions';
import { ProductCard } from '@/components/product/product-card';
import { Plus, ShoppingBag } from 'lucide-react';

interface FrequentlyBoughtTogetherProps {
  productId: string;
}

export async function FrequentlyBoughtTogether({ productId }: FrequentlyBoughtTogetherProps) {
  const { products } = await getFrequentlyBoughtTogetherAction(productId);

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className='py-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200'>
       <div className='flex items-center gap-2 mb-6'>
          <ShoppingBag className='h-5 w-5 text-primary' />
          <h2 className='text-xl sm:text-2xl font-bold'>Frequently Bought Together</h2>
       </div>

       <div className='bg-secondary/20 rounded-2xl p-6 border border-border/50'>
          <div className='flex flex-col md:flex-row items-center gap-6 md:gap-8'>
             {/* List */}
             <div className='flex items-center gap-4 overflow-x-auto pb-4 md:pb-0 w-full md:w-auto'>
                {products.map((product, idx) => (
                    <div key={product.id} className='flex items-center gap-4 shrink-0'>
                        {idx > 0 && <Plus className='h-5 w-5 text-muted-foreground' />}
                        <div className="w-40 sm:w-48">
                             <ProductCard product={product as any} />
                        </div>
                    </div>
                ))}
             </div>
             
             {/* Summary / Action (Future: "Add all to cart") */}
             <div className='hidden md:block w-px h-32 bg-border/60 mx-4' />
             
             <div className='bg-background p-6 rounded-xl border border-border/40 shadow-sm min-w-[200px] text-center'>
                 <p className='text-muted-foreground text-sm mb-2'>Combine & Save</p>
                 <div className='text-lg font-bold mb-4'>
                    Buy {products.length} items
                 </div>
                 {/* Placeholder for "Add All" functionality */}
                 <button className='w-full py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors' disabled>
                    Add Bundle (Coming Soon)
                 </button>
             </div>
          </div>
       </div>
    </section>
  );
}
