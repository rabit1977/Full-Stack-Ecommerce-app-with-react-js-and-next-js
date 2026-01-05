import { getProductByIdAction } from '@/actions/product-actions';
import { ProductCartImage } from '@/components/product/product-image-carousel';
import { RelatedProducts } from '@/components/product/related-products';
import { ReviewsSection } from '@/components/product/reviews-section';
import { notFound } from 'next/navigation';
import { ProductPurchaseManager } from './ProductPurchaseManager';

export async function ProductDetailContent({
  productId,
}: {
  productId: string;
}) {
  const product = await getProductByIdAction(productId);

  if (!product) {
    notFound();
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        <div>
          <ProductCartImage product={product} />
        </div>
        <div>
          <ProductPurchaseManager product={product} />
        </div>
      </div>
      <div className='mt-16'>
        <ReviewsSection productId={product.id} />
      </div>
      <div className='mt-16'>
        <RelatedProducts currentProduct={product} />
      </div>
    </div>
  );
}
