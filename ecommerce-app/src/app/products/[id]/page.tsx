// app/products/[id]/page.tsx
import { Suspense } from 'react';
import { ProductDetailContent } from './ProductDetailContent';
import { ProductDetailSkeleton } from './ProductDetailSkeleton';

const ProductDetailPage = () => {
  return (
    <Suspense fallback={<ProductDetailSkeleton />}>
      <ProductDetailContent />
    </Suspense>
  );
};

export default ProductDetailPage;