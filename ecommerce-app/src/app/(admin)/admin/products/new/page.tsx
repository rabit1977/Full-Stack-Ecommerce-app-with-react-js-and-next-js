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
          thumbnail: values.imageUrl || values.images[0],
          discount: values.discount || 0,
          rating: 0,
          reviewCount: 0,
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
    <div className="space-y-6">
      <div className="space-y-4">
        <Button
          variant="ghost"
          onClick={() => router.push('/admin/products')}
          className="hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight dark:text-white">
            Add New Product
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Create a new product in your catalog
          </p>
        </div>
      </div>

      <ProductForm onSubmit={handleSubmit} isSubmitting={isPending} />
    </div>
  );
}