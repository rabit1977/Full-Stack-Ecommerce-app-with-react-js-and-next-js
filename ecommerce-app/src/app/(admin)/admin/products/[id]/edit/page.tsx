import { Suspense } from 'react';
import { getProductById } from '@/lib/data/get-products';
import { notFound } from 'next/navigation';
import { EditProductForm } from '@/components/admin/edit-product-form';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Edit product skeleton
 */
function EditProductSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />
      <div className="space-y-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    </div>
  );
}

/**
 * Edit product content
 */
async function EditProductContent({ productId }: { productId: string }) {
  const product = await getProductById(productId);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <Button variant="ghost" asChild>
          <Link href="/admin/products">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight dark:text-white">
            Edit Product
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Update product information for {product.title}
          </p>
        </div>
      </div>

      {/* Form */}
      <EditProductForm product={product} />
    </div>
  );
}

/**
 * Edit product page with Suspense
 */
export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;

  return (
    <Suspense fallback={<EditProductSkeleton />}>
      <EditProductContent productId={id} />
    </Suspense>
  );
}