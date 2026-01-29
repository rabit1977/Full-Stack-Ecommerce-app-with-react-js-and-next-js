// components/product/related-products.tsx (Server Component Version)

import { getRelatedProductsAction } from '@/actions/product-relation-actions';
import { ProductWithRelations } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';

interface RelatedProductsProps {
  currentProduct: ProductWithRelations;
  limit?: number;
}

/**
 * RelatedProducts Server Component
 */
export async function RelatedProducts({
  currentProduct,
  limit = 4,
}: RelatedProductsProps) {
  // Fetch related products using advanced logic
  const { products } = await getRelatedProductsAction(currentProduct.id, limit);

  // Products are already filtered and prepared by the action
  const relatedProducts = products || [];

  // Don't render if no related products
  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <section className='py-12' aria-labelledby='related-products-heading'>
      <div className='container-wide'>
        <h2
          id='related-products-heading'
          className='mb-8'
        >
          Related Products
        </h2>

        <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-4 sm:gap-6'>
          {relatedProducts.map((product) => (
             <Link 
                key={product.id} 
                href={`/products/${product.slug}`}
                className='group flex bg-card border border-border/50 rounded-xl overflow-hidden hover:border-primary/50 transition-all hover:shadow-lg h-32 sm:h-auto'
             >
                <div className='relative w-28 sm:w-40 shrink-0 bg-muted'>
                   {product.images?.[0]?.url ? (
                       <Image 
                          src={product.images[0].url}
                          alt={product.title}
                          fill
                          className='object-cover group-hover:scale-105 transition-transform duration-500'
                       />
                   ) : (
                       <div className='w-full h-full flex items-center justify-center text-muted-foreground'>
                          <div className='h-8 w-8 rounded-full bg-muted-foreground/20' />
                       </div>
                   )}
                   {product.discount && product.discount > 0 && (
                      <div className='absolute top-2 left-2 bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm shadow-sm'>
                         -{product.discount}%
                      </div>
                   )}
                </div>
                
                <div className='p-4 flex-1 flex flex-col justify-center min-w-0'>
                   <div className='mb-1'>
                      <span className='text-[10px] uppercase font-bold text-muted-foreground tracking-wider'>
                        {product.brand}
                      </span>
                   </div>
                   <h3 className='font-bold text-sm sm:text-base line-clamp-2 group-hover:text-primary transition-colors leading-tight mb-2'>
                      {product.title}
                   </h3>
                   <div className='mt-auto flex items-center justify-between'>
                      <div className='flex flex-col'>
                         <span className='font-black text-base sm:text-lg'>
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(product.price)}
                         </span>
                         {product.discount && product.discount > 0 && (
                            <span className='text-xs text-muted-foreground line-through'>
                               {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(product.price / (1 - product.discount/100))}
                            </span>
                         )}
                      </div>
                      <div className='h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all'>
                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                      </div>
                   </div>
                </div>
             </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
