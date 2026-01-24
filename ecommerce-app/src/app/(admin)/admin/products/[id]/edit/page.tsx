import { getProductsByIdsAction } from '@/actions/product-actions';
import { EditProductForm } from '@/components/admin/edit-product-form';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Settings } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Edit product skeleton
 */
function EditProductSkeleton() {
  return (
    <div className='space-y-6'>
      <Skeleton className='h-8 w-48' />
      <div className='space-y-4'>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className='h-10 w-full' />
        ))}
      </div>
    </div>
  );
}

/**
 * Edit product content
 */
async function EditProductContent({ productId }: { productId: string }) {
  const product = await getProductsByIdsAction([productId]).then(
    (res) => res[0],
  );

  if (!product) {
    notFound();
  }

  return (
    <div className='max-w-4xl mx-auto pb-20'>
      {/* Header */}
      <div className='mb-8 animate-in fade-in slide-in-from-top-4 duration-500'>
        <Button variant='ghost' asChild className='hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full mb-6 -ml-3'>
          <Link href='/admin/products'>
            <ArrowLeft className='h-4 w-4 mr-2' />
            Back to Products
          </Link>
        </Button>
        <div className='flex items-center gap-4'>
           <div className='h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center shadow-lg shadow-primary/25'>
             <Settings className='h-6 w-6 text-white' /> {/* Using Settings for Edit */}
           </div>
           <div>
              <h1 className='text-3xl sm:text-4xl font-black tracking-tight text-foreground'>
                Edit Product
              </h1>
              <p className='text-lg text-muted-foreground font-medium mt-1'>
                 Update &quot;{product.title}&quot; details
              </p>
           </div>
        </div>
      </div>

      {/* Form */}
      <div className='glass-card rounded-[2.5rem] p-8 sm:p-10 shadow-xl shadow-black/5 border border-border/60 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100'>
         <EditProductForm product={product} />
      </div>
    </div>
  );
}

/**
 * Edit product page with Suspense
 */
export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { id } = await params;

  return (
    <Suspense fallback={<EditProductSkeleton />}>
      <EditProductContent productId={id} />
    </Suspense>
  );
}
