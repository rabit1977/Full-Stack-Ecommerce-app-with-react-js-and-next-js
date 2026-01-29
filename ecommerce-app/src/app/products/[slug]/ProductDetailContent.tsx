import { getMeAction } from '@/actions/auth-actions';
import { getCartAction } from '@/actions/cart-actions';
import { getWishlistAction } from '@/actions/wishlist-actions';
import { BundleDetails } from '@/components/product/bundle-details';
import { FrequentlyBoughtTogether } from '@/components/product/frequently-bought-together';
import { ProductDetailGallery } from '@/components/product/product-detail-gallery';
import { ProductInfoTabs } from '@/components/product/product-info-tabs';
import { QuestionsSection } from '@/components/product/questions-section';
import { RecentlyViewedProducts } from '@/components/product/recently-viewed-products';
import { RelatedProducts } from '@/components/product/related-products';
import { ReviewsSection } from '@/components/product/reviews-section';
import { ProductWithRelations } from '@/lib/types';
import { ProductPurchaseManager } from './ProductPurchaseManager';

export async function ProductDetailContent({
  product,
}: {
  product: ProductWithRelations;
}) {
  const { wishlist } = await getWishlistAction();
  const cart = await getCartAction();
  const { user } = await getMeAction();

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

      <div className='mt-16 sm:mt-24 space-y-16 sm:space-y-24'>
         {product.inBundles && product.inBundles.length > 0 && (
             <BundleDetails product={product} />
         )}
         <ProductInfoTabs product={product} />
      </div>

      <div className='mt-12 sm:mt-16'>
          <FrequentlyBoughtTogether productId={product.id} />
      </div>

      <div className='mt-20 sm:mt-24 lg:mt-32'>
        <QuestionsSection productId={product.id} />
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

      <div className='mt-20 sm:mt-24 lg:mt-32'>
        <RecentlyViewedProducts currentProduct={product} />
      </div>
    </div>
  );
}
