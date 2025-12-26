'use client';

import { getProductByIdAction } from '@/actions/product-actions';
import { ProductImageCarousel } from '@/components/product/product-image-carousel';
import { ProductPurchasePanel } from '@/components/product/product-purchase-panel';
import { RelatedProducts } from '@/components/product/related-products';
import { ReviewsSection } from '@/components/product/reviews-section';
import { Product } from '@prisma/client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export function ProductDetailContent() {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const productId = params.id as string;

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const fetchedProduct = await getProductByIdAction(productId);
        if (!fetchedProduct) {
          toast({
            title: 'Error',
            description: 'Product not found.',
            variant: 'destructive',
          });
          setProduct(null);
        } else {
          setProduct(fetchedProduct);
        }
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch product details.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        <div>
          <ProductImageCarousel product={product} />
        </div>
        <div>
          <h1 className='text-3xl font-bold mb-4'>{product.name}</h1>
          <ProductPurchasePanel product={product} />
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
