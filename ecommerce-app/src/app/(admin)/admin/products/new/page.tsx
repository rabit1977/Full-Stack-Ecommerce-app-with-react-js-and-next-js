'use client';

import { createProductAction } from '@/actions/product-actions';
import { ProductForm } from '@/components/admin/product-form';
import { Button } from '@/components/ui/button';
import { type ProductFormValues } from '@/lib/schemas/product-schema';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { toast } from 'sonner';

export default function NewProductPage() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = (values: ProductFormValues) => {
    startTransition(async () => {
      try {
        // Validate that we have at least one image
        if (!values.images || values.images.length === 0) {
          toast.error('Please add at least one product image');
          return;
        }

        // Create product using server action
        const result = await createProductAction({
          title: values.title,
          description: values.description,
          price: values.price,
          stock: values.stock,
          brand: values.brand,
          category: values.category,
          images: values.images,
          discount: values.discount || 0,
        });

        if (result.success) {
          toast.success(result.message || 'Product created successfully!');
          router.push('/admin/products');
          router.refresh();
        } else {
          toast.error(result.error || 'Failed to create product');
        }
      } catch (error) {
        console.error('Create product error:', error);
        toast.error('An unexpected error occurred');
      }
    });
  };

  return (
    <div className='max-w-4xl mx-auto pb-20'>
      <div className='mb-8 animate-in fade-in slide-in-from-top-4 duration-500'>
        <Button
          variant='ghost'
          onClick={() => router.push('/admin/products')}
          className='hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full mb-6 -ml-3'
        >
          <ArrowLeft className='h-4 w-4 mr-2' />
          Back to Products
        </Button>
        <div className='flex items-center gap-4'>
           <div className='h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center shadow-lg shadow-primary/25'>
             <ArrowLeft className='h-6 w-6 text-white rotate-180' /> {/* Just using an icon */}
           </div>
           <div>
              <h1 className='text-3xl sm:text-4xl font-black tracking-tight text-foreground'>
                Add New Product
              </h1>
              <p className='text-lg text-muted-foreground font-medium mt-1'>
                Create a new product in your catalog
              </p>
           </div>
        </div>
      </div>

      <div className='glass-card rounded-[2.5rem] p-8 sm:p-10 shadow-xl shadow-black/5 border border-border/60 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100'>
        <ProductForm onSubmit={handleSubmit} isSubmitting={isPending} />
      </div>
    </div>
  );
}
