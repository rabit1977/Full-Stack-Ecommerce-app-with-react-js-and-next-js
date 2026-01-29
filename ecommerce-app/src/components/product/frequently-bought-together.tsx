import { getFrequentlyBoughtTogetherAction } from '@/actions/product-relation-actions';
import { ShoppingBag } from 'lucide-react';
import { FrequentlyBoughtTogetherActions } from './frequently-bought-together-actions';

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

       <FrequentlyBoughtTogetherActions products={products as any} />
    </section>
  );
}
