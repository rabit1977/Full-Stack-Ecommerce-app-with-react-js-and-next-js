// app/admin/products/[id]/page.tsx
import { getProductById } from '@/lib/data/get-products';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ProductDetailsContent } from './ProductDetailsContent';
import { ProductDetailsSkeleton } from './ProductDetailsSkeleton';

interface ProductDetailsPageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: 'Product Details | Admin',
  description: 'View and manage product details in the admin dashboard.',
};

export default async function ProductDetailsPage({
  params,
}: ProductDetailsPageProps) {
  const { id } = await params;
  const productPromise = getProductById(id);

  return (
    <Suspense fallback={<ProductDetailsSkeleton />}>
      <ProductDetailsContent productPromise={productPromise} />
    </Suspense>
  );
}
