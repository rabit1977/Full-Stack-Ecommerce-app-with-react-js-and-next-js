// app/products/[id]/page.tsx
import { Suspense } from 'react';
import { ProductDetailContent } from './ProductDetailContent';
import { ProductDetailSkeleton } from './ProductDetailSkeleton';

const ProductDetailPage = ({ params }: { params: { id: string } }) => {
  return (
    <Suspense fallback={<ProductDetailSkeleton />}>
      <ProductDetailContent productId={params.id} />
    </Suspense>
  );
};

export default ProductDetailPage;