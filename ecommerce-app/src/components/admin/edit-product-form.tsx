'use client';

import { ProductForm } from '@/components/admin/product-form';
import { updateProduct } from '@/lib/actions/product-actions';
import { productFormSchema } from '@/lib/schemas/product-schema';
import { Product } from '@/lib/types';
import { useTransition } from 'react';
import { toast } from 'sonner';
import * as z from 'zod';

interface EditProductFormProps {
  product: Product;
}

export const EditProductForm = ({ product }: EditProductFormProps) => {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (values: z.infer<typeof productFormSchema>) => {
    const formData = new FormData();
    
    // Append simple fields
    formData.append('title', values.title);
    formData.append('description', values.description);
    formData.append('price', values.price.toString());
    formData.append('stock', values.stock.toString());
    formData.append('brand', values.brand);
    formData.append('category', values.category);
    
    // Append images if they exist
    if (values.images && values.images.length > 0) {
      values.images.forEach((image) => {
        formData.append('images', image);
      });
    }

    startTransition(async () => {
      const result = await updateProduct(product.id, formData);
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