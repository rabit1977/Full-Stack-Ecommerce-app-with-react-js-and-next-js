// app/products/[slug]/page.tsx
import { getProductBySlugAction } from '@/actions/product-actions';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { ProductDetailContent } from './ProductDetailContent';
import { ProductDetailSkeleton } from './ProductDetailSkeleton';

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(
  { params }: ProductDetailPageProps
): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlugAction(slug);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: product.metaTitle || product.title,
    description: product.metaDescription || product.description.slice(0, 160),
    openGraph: {
      images: product.images[0]?.url ? [product.images[0].url] : [],
    },
  };
}

const ProductDetailPage = async ({ params }: ProductDetailPageProps) => {
  const { slug } = await params;
  const product = await getProductBySlugAction(slug);

  if (!product) {
    notFound();
  }

  return (
    <Suspense fallback={<ProductDetailSkeleton />}>
      <ProductDetailContent product={product} />
    </Suspense>
  );
};

export default ProductDetailPage;