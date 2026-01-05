// app/products/[id]/page.tsx
import { Suspense } from 'react';
import { ProductDetailContent } from './ProductDetailContent';
import { ProductDetailSkeleton } from './ProductDetailSkeleton';

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

const ProductDetailPage = async ({ params }: ProductDetailPageProps) => {
  // ✅ Await params in Next.js 15
  const { id } = await params;

  return (
    <Suspense fallback={<ProductDetailSkeleton />}>
      <ProductDetailContent productId={id} />
    </Suspense>
  );
};

export default ProductDetailPage;