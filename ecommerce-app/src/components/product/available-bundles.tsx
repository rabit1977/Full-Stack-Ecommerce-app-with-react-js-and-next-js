import { Badge } from '@/components/ui/badge';
import { ProductWithRelations } from '@/lib/types';
import { formatPrice } from '@/lib/utils/formatters';
import { ArrowRight, Package } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface AvailableBundlesProps {
  product: ProductWithRelations;
}

export function AvailableBundles({ product }: AvailableBundlesProps) {
  if (!product.bundleItems || product.bundleItems.length === 0) {
    return null;
  }

  return (
    <section className='space-y-6'>
       <div className='flex items-center gap-2'>
          <Package className='h-5 w-5 text-primary' />
          <h2 className='text-xl sm:text-2xl font-bold'>Part of these Value Bundles</h2>
       </div>

       <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {product.bundleItems.map((item) => {
             const bundle = item.bundle;
             return (
                 <Link 
                    key={item.id} 
                    href={`/products/${bundle.slug || bundle.id}`}
                    className='group flex bg-card border border-border/50 rounded-xl overflow-hidden hover:border-primary/50 transition-all hover:shadow-lg'
                 >
                    <div className='relative w-32 shrink-0 bg-muted'>
                       {bundle.images?.[0]?.url ? (
                           <Image 
                              src={bundle.images[0].url}
                              alt={bundle.title}
                              fill
                              className='object-cover group-hover:scale-105 transition-transform duration-500'
                           />
                       ) : (
                           <div className='w-full h-full flex items-center justify-center text-muted-foreground'>
                              <Package className='h-8 w-8' />
                           </div>
                       )}
                    </div>
                    
                    <div className='p-4 flex-1 flex flex-col justify-center'>
                       <Badge variant='secondary' className='w-fit mb-2 text-[10px] bg-primary/10 text-primary'>
                          Save with Bundle
                       </Badge>
                       <h3 className='font-bold text-sm sm:text-base line-clamp-2 group-hover:text-primary transition-colors'>
                          {bundle.title}
                       </h3>
                       <div className='mt-2 flex items-center justify-between'>
                          <span className='font-black text-lg'>
                             {formatPrice(bundle.price)}
                          </span>
                          <ArrowRight className='h-4 w-4 -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all text-primary' />
                       </div>
                    </div>
                 </Link>
             );
          })}
       </div>
    </section>
  );
}
