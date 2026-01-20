import { getCartAction } from '@/actions/cart-actions';
import { getProductByIdAction } from '@/actions/product-actions';
import { getWishlistAction } from '@/actions/wishlist-actions';
import { ProductImageCarousel } from '@/components/product/product-image-carousel';
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

  if (!product) {
    notFound();
  }

  const initialIsWished = wishlist.includes(product.id);
  const initialQuantityInCart =
    cart.items.find((item: any) => item.productId === product.id)?.quantity ||
    0;

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        <div>
          <ProductImageCarousel product={product} />
        </div>
        <div>
          <ProductPurchaseManager
            product={product}
            initialIsWished={initialIsWished}
            initialQuantityInCart={initialQuantityInCart}
          />
        </div>
      </div>
      <div className='mt-16'>
        <ReviewsSection productId={product.id} product={product} />
      </div>
      <div className='mt-16'>
        <RelatedProducts currentProduct={product} />
      </div>
    </div>
  );
}
