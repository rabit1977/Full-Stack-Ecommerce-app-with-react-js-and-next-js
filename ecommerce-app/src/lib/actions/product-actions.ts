'use server';

import { initialProducts } from '@/lib/constants/products';
import { productFormSchema } from '@/lib/schemas/product-schema';
import { Product } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

/**
 * Server action result type
 */
type ActionResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string };

/**
 * Generate unique product ID
 */
const generateProductId = (): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `sku-${timestamp}-${random}`;
};

/**
 * Add a new product
 */
export async function addProduct(formData: FormData) {
  try {
    // Extract and parse form data
    const rawData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
      stock: parseInt(formData.get('stock') as string, 10),
      brand: formData.get('brand') as string,
      category: formData.get('category') as string,
    };

    // Validate input
    const validatedFields = productFormSchema.safeParse(rawData);

    if (!validatedFields.success) {
      return {
        success: false,
        error: validatedFields.error.issues[0]?.message || 'Invalid fields!',
      };
    }

    const { title, description, price, stock, brand, category } =
      validatedFields.data;

    // Create new product
    const newProduct: Product = {
      id: generateProductId(),
      title,
      description,
      price,
      stock,
      brand,
      category,
      rating: 0,
      reviewCount: 0,
      images: ['/images/placeholder.jpg'],
      reviews: [],
      // Optional fields can be omitted or included
      thumbnail: '/images/placeholder.jpg',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // TODO: Replace with database call
    initialProducts.unshift(newProduct);

    // Revalidate cache
    revalidatePath('/admin/products');
    revalidatePath('/');
  } catch (error) {
    console.error('Error adding product:', error);
    return {
      success: false,
      error: 'Failed to add product. Please try again.',
    };
  }

  // Redirect after successful creation
  redirect('/admin/products');
}

/**
 * Update an existing product
 */
export async function updateProduct(productId: string, formData: FormData) {
  try {
    // Extract and parse form data
    const rawData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
      stock: parseInt(formData.get('stock') as string, 10),
      brand: formData.get('brand') as string,
      category: formData.get('category') as string,
    };

    // Validate input
    const validatedFields = productFormSchema.safeParse(rawData);

    if (!validatedFields.success) {
      // Get all error messages
      const errorMessages = validatedFields.error.issues
        .map((issue) => issue.message)
        .join(', ');

      return {
        success: false,
        error: errorMessages || 'Invalid fields!',
      };
    }

    // Find product
    const productIndex = initialProducts.findIndex((p) => p.id === productId);

    if (productIndex === -1) {
      return {
        success: false,
        error: 'Product not found!',
      };
    }

    // Update product while preserving other fields
    initialProducts[productIndex] = {
      ...initialProducts[productIndex],
      ...validatedFields.data,
    };

    // Revalidate cache
    revalidatePath('/admin/products');
    revalidatePath(`/products/${productId}`);
    revalidatePath('/');
  } catch (error) {
    console.error('Error updating product:', error);
    return {
      success: false,
      error: 'Failed to update product. Please try again.',
    };
  }

  // Redirect after successful update
  redirect('/admin/products');
}

/**
 * Delete a product
 */
export async function deleteProduct(productId: string): Promise<ActionResult> {
  try {
    const index = initialProducts.findIndex((p) => p.id === productId);

    if (index === -1) {
      return {
        success: false,
        error: 'Product not found!',
      };
    }

    initialProducts.splice(index, 1);

    revalidatePath('/admin/products');
    revalidatePath('/');

    return { success: true };
  } catch (error) {
    console.error('Error deleting product:', error);
    return {
      success: false,
      error: 'Failed to delete product. Please try again.',
    };
  }
}

/**
 * Bulk delete products
 */
export async function bulkDeleteProducts(
  productIds: string[]
): Promise<ActionResult<{ count: number }>> {
  try {
    if (!productIds.length) {
      return {
        success: false,
        error: 'No products selected',
      };
    }

    let deletedCount = 0;

    for (let i = initialProducts.length - 1; i >= 0; i--) {
      if (productIds.includes(initialProducts[i].id)) {
        initialProducts.splice(i, 1);
        deletedCount++;
      }
    }

    revalidatePath('/admin/products');
    revalidatePath('/');

    return {
      success: true,
      data: { count: deletedCount },
    };
  } catch (error) {
    console.error('Error bulk deleting products:', error);
    return {
      success: false,
      error: 'Failed to delete products. Please try again.',
    };
  }
}
