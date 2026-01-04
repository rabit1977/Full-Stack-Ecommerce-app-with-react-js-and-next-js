'use server';

import { prisma } from '@/lib/db';
import { Product, SortKey } from '@/lib/types';
import { Prisma } from '@prisma/client';

export interface GetProductsOptions {
  query?: string;
  categories?: string;
  brands?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStock?: boolean;
  sort?: SortKey;
  page?: number;
  limit?: number;
}

export interface GetProductsResult {
  products: Product[];
  totalCount: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

export async function getProductsAction(
  options: GetProductsOptions = {}
): Promise<GetProductsResult> {
  const {
    query,
    categories,
    brands,
    minPrice,
    maxPrice,
    minRating,
    inStock,
    sort = 'featured',
    page: rawPage, // 1. Rename incoming variable to "raw"
    limit: rawLimit, // 2. Rename incoming variable to "raw"
  } = options;

  // 3. FORCE CONVERSION: Turn Strings into Numbers immediately
  // This prevents the "Invalid Invocation" crash
  const page = Number(rawPage) || 1;
  const limit = Number(rawLimit) || 12;

  const where: Prisma.ProductWhereInput = {
    AND: [],
  };
  const andarr = where.AND as Prisma.ProductWhereInput[];

  // --- Search Logic ---
  if (query) {
    andarr.push({
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { brand: { contains: query, mode: 'insensitive' } },
        { category: { contains: query, mode: 'insensitive' } },
      ],
    });
  }

  // --- Filters ---
  if (categories) {
    const list = categories
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);
    if (list.length) andarr.push({ category: { in: list } });
  }

  if (brands) {
    const list = brands
      .split(',')
      .map((b) => b.trim())
      .filter(Boolean);
    if (list.length) andarr.push({ brand: { in: list } });
  }

  // Force price/rating to Numbers too
  if (minPrice !== undefined) andarr.push({ price: { gte: Number(minPrice) } });
  if (maxPrice !== undefined) andarr.push({ price: { lte: Number(maxPrice) } });
  if (minRating !== undefined)
    andarr.push({ rating: { gte: Number(minRating) } });

  if (inStock) andarr.push({ stock: { gt: 0 } });

  // --- Sorting ---
  let orderBy: Prisma.ProductOrderByWithRelationInput = {};
  switch (sort) {
    case 'price-asc':
      orderBy = { price: 'asc' };
      break;
    case 'price-desc':
      orderBy = { price: 'desc' };
      break;
    case 'rating':
      orderBy = { rating: 'desc' };
      break;
    case 'newest':
      orderBy = { createdAt: 'desc' };
      break;
    case 'popularity':
      orderBy = { reviewCount: 'desc' };
      break;
    default:
      orderBy = { rating: 'desc' };
      break;
  }

  // 4. Calculate Skip (Now safe because page/limit are real numbers)
  const skip = (page - 1) * limit;

  try {
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit, // <--- This was crashing because it was a string
        include: {
          images: true,
        },
      }),
      prisma.product.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      products: products.map((p) => ({
        ...p,
        images: p.images.map((img) => img.url),
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
      })),
      totalCount,
      page,
      totalPages,
      hasMore: page < totalPages,
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    return {
      products: [],
      totalCount: 0,
      page: 1,
      totalPages: 0,
      hasMore: false,
    };
  }
}
export async function getProductByIdAction(
  id: string
): Promise<Product | null> {
  const product = await prisma.product.findUnique({
    where: { id },
    include: { images: true },
  });

  if (!product) return null;

  return {
    ...product,
    images: product.images.map((img) => img.url),
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };
}

export async function getFiltersAction() {
  const [categories, brands, priceAgg] = await Promise.all([
    prisma.product.groupBy({
      by: ['category'],
    }),
    prisma.product.groupBy({
      by: ['brand'],
    }),
    prisma.product.aggregate({
      _min: { price: true },
      _max: { price: true },
    }),
  ]);

  return {
    categories: categories.map((c) => c.category),
    brands: brands.map((b) => b.brand),
    minPrice: priceAgg._min.price || 0,
    maxPrice: priceAgg._max.price || 0,
  };
}

// ============================================
// ADMIN-ONLY CRUD OPERATIONS
// ============================================

import { auth } from '@/auth';
import {
  productFormSchema,
  ProductFormValues,
} from '@/lib/schemas/product-schema';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Helper to check admin access
async function requireAdmin() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    throw new Error('Unauthorized: Admin access required');
  }
  return session;
}

/**
 * Create new product (admin only)
 */
export async function createProductAction(data: ProductFormValues) {
  try {
    await requireAdmin();

    const validated = productFormSchema.parse(data);
    const { images, ...productData } = validated;

    const product = await prisma.product.create({
      data: {
        ...productData,
        discount: productData.discount || 0,
        images: {
          create: images?.map((url) => ({ url })) || [],
        },
        thumbnail: images?.[0],
      },
      include: {
        images: true,
      },
    });

    revalidatePath('/admin/products');
    revalidatePath('/products');

    return {
      success: true,
      data: product,
      message: 'Product created successfully',
    };
  } catch (error) {
    console.error('Error creating product:', error);
    if (error instanceof z.ZodError) {
      // Return the first validation error message
      return {
        success: false,
        error: error.errors[0]?.message || 'Invalid data provided',
      };
    }
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to create product',
    };
  }
}

/**
 * Update product (admin only)
 */
/**
 * Update product (admin only)
 */
export async function updateProductAction(
  id: string,
  data: Partial<ProductFormValues>
) {
  try {
    await requireAdmin();

    const validatedData = productFormSchema.partial().parse(data);
    const { images, ...productData } = validatedData;

    // Separate Prisma-compatible fields from form fields
    const {
      title,
      description,
      price,
      stock,
      brand,
      category,
      discount,
      rating,
      reviewCount,
    } = productData;

    // Update product with only valid Prisma fields
    await prisma.product.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price }),
        ...(stock !== undefined && { stock }),
        ...(brand !== undefined && { brand }),
        ...(category !== undefined && { category }),
        ...(discount !== undefined && { discount }),
        ...(rating !== undefined && { rating }),
        ...(reviewCount !== undefined && { reviewCount }),
        ...(images && images.length > 0 && { thumbnail: images[0] }),
      },
    });

    // Update images if provided
    if (images) {
      // Delete existing images
      await prisma.productImage.deleteMany({
        where: { productId: id },
      });

      // Create new images if there are any
      if (images.length > 0) {
        await prisma.productImage.createMany({
          data: images.map((url) => ({ url, productId: id })),
        });
      }
    }

    revalidatePath('/admin/products');
    revalidatePath(`/admin/products/${id}`);
    revalidatePath('/products');
    revalidatePath(`/products/${id}`);

    return {
      success: true,
      message: 'Product updated successfully',
    };
  } catch (error) {
    console.error('Error updating product:', error);
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0]?.message || 'Invalid data provided',
      };
    }
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to update product',
    };
  }
}
/**
 * Delete product (admin only)
 */
export async function deleteProductAction(id: string) {
  try {
    await requireAdmin();

    await prisma.product.delete({
      where: { id },
    });

    revalidatePath('/admin/products');
    revalidatePath('/products');

    return {
      success: true,
      message: 'Product deleted successfully',
    };
  } catch (error) {
    console.error('Error deleting product:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to delete product',
    };
  }
}

/**
 * Delete multiple products (admin only)
 */
export async function deleteMultipleProductsAction(ids: string[]) {
  try {
    await requireAdmin();

    if (ids.length === 0) {
      return {
        success: false,
        error: 'No product IDs provided',
      };
    }

    const deleteResult = await prisma.product.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    revalidatePath('/admin/products');
    revalidatePath('/products');

    return {
      success: true,
      message: `${deleteResult.count} products deleted successfully`,
    };
  } catch (error) {
    console.error('Error deleting multiple products:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to delete products',
    };
  }
}

/**
 * Get multiple products by their IDs
 */
export async function getProductsByIdsAction(
  ids: string[]
): Promise<Product[]> {
  if (ids.length === 0) {
    return [];
  }

  const products = await prisma.product.findMany({
    where: {
      id: {
        in: ids,
      },
    },
    include: { images: true },
  });

  // Map Prisma result to frontend Product type
  const mappedProducts: Product[] = products.map((p) => ({
    ...p,
    images: p.images.map((img) => img.url),
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));

  return mappedProducts;
}
