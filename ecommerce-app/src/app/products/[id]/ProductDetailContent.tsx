import { getMeAction } from '@/actions/auth-actions';
import { getCartAction } from '@/actions/cart-actions';
import { getProductByIdAction } from '@/actions/product-actions';
import { getWishlistAction } from '@/actions/wishlist-actions';
import { ProductDetailGallery } from '@/components/product/product-detail-gallery';
import { ProductInfoTabs } from '@/components/product/product-info-tabs';
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
  const { wishlist } = await getWishlistAction();
  const cart = await getCartAction();
  const { user } = await getMeAction();

  if (!product) {
    notFound();
  }

  const initialIsWished = wishlist.includes(product.id);
  const initialQuantityInCart =
    cart.items.find((item: { productId: string; quantity: number }) => item.productId === product.id)?.quantity ||
    0;

  return (
    <div className='container-wide py-8 sm:py-12 lg:py-16'>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-16 items-start'>
        <div className='w-full space-y-8'>
          <ProductDetailGallery product={product} />
        </div>
        <div className='w-full lg:sticky lg:top-24'>
          <ProductPurchaseManager
            product={product}
            initialIsWished={initialIsWished}
            initialQuantityInCart={initialQuantityInCart}
          />
        </div>
      </div>

      <div className='mt-16 sm:mt-24'>
         <ProductInfoTabs product={product} />
      </div>

      <div className='mt-20 sm:mt-24 lg:mt-32'>
        <ReviewsSection 
          productId={product.id} 
          product={product} 
          helpfulReviews={user?.helpfulReviews || []} 
        />
      </div>
      <div className='mt-20 sm:mt-24 lg:mt-32'>
        <RelatedProducts currentProduct={product} />
      </div>
    </div>
  );
}
