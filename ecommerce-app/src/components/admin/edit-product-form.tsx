'use client';

import { updateProductAction } from '@/actions/product-actions';
import { ProductForm } from '@/components/admin/product-form';
import { productFormSchema } from '@/lib/schemas/product-schema';
import { ProductWithRelations } from '@/lib/types';
import { useTransition } from 'react';
import { toast } from 'sonner';
import * as z from 'zod';

interface EditProductFormProps {
  product: ProductWithRelations;
}

export const EditProductForm = ({ product }: EditProductFormProps) => {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (values: z.infer<typeof productFormSchema>) => {
    startTransition(async () => {
      const result = await updateProductAction(product.id, values);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success('Product updated successfully');
      }
    });
  };

  return (
    <ProductForm
      product={product}
      onSubmit={handleSubmit}
      isSubmitting={isPending}
    />
  );
};
