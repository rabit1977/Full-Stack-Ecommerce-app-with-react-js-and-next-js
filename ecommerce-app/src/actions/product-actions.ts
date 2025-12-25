'use server'

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
    page = 1,
    limit = 8,
  } = options;

  const where: Prisma.ProductWhereInput = {
    AND: [],
  };

  const andarr = where.AND as Prisma.ProductWhereInput[];

  // Search query
  if (query) {
    andarr.push({
      OR: [
        { title: { contains: query } },
        { description: { contains: query } },
        { brand: { contains: query } },
        { category: { contains: query } },
      ],
    });
  }

  // Categories
  if (categories) {
    const categoryList = categories.split(',').map((c) => c.trim()).filter(Boolean);
    if (categoryList.length > 0) {
      andarr.push({ category: { in: categoryList } });
    }
  }

  // Brands
  if (brands) {
    const brandList = brands.split(',').map((b) => b.trim()).filter(Boolean);
    if (brandList.length > 0) {
      andarr.push({ brand: { in: brandList } });
    }
  }

  // Price
  if (minPrice !== undefined) andarr.push({ price: { gte: minPrice } });
  if (maxPrice !== undefined) andarr.push({ price: { lte: maxPrice } });

  // Rating
  if (minRating !== undefined) andarr.push({ rating: { gte: minRating } });

  // Stock
  if (inStock) andarr.push({ stock: { gt: 0 } });

  // Sorting
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
    case 'featured':
    default:
      orderBy = { rating: 'desc' }; // Default featured logic
      break;
  }

  const skip = (page - 1) * limit;

  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        images: true, // Need to map this back to string[] for frontend
      },
    }),
    prisma.product.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  // Map Prisma result to frontend Product type
  const mappedProducts: Product[] = products.map((p) => ({
    ...p,
    images: p.images.map((img) => img.url),
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));

  return {
    products: mappedProducts,
    totalCount,
    page,
    totalPages,
    hasMore: page < totalPages,
  };
}

export async function getProductByIdAction(id: string): Promise<Product | null> {
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
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Product validation schema
const productSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().positive('Price must be positive'),
  discount: z.number().min(0).max(100).optional(),
  stock: z.number().int().min(0, 'Stock must be non-negative'),
  brand: z.string().min(1, 'Brand is required'),
  category: z.string().min(1, 'Category is required'),
  rating: z.number().min(0).max(5).optional(),
  reviewCount: z.number().int().min(0).optional(),
  thumbnail: z.string().url().optional().nullable(),
  images: z.array(z.string().url()).min(1, 'At least one image is required'),
})

type ProductInput = z.infer<typeof productSchema>

// Helper to check admin access
async function requireAdmin() {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== 'admin') {
    throw new Error('Unauthorized: Admin access required')
  }
  return session
}

/**
 * Create new product (admin only)
 */
export async function createProductAction(data: ProductInput) {
  try {
    await requireAdmin()

    const validated = productSchema.parse(data)
    const { images, ...productData } = validated

    const product = await prisma.product.create({
      data: {
        ...productData,
        discount: productData.discount || 0,
        rating: productData.rating || 0,
        reviewCount: productData.reviewCount || 0,
        images: {
          create: images.map(url => ({ url })),
        },
      },
      include: {
        images: true,
      },
    })

    revalidatePath('/admin/products')
    revalidatePath('/products')

    return {
      success: true,
      data: product,
      message: 'Product created successfully',
    }
  } catch (error) {
    console.error('Error creating product:', error)
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0].message,
      }
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create product',
    }
  }
}

/**
 * Update product (admin only)
 */
export async function updateProductAction(id: string, data: Partial<ProductInput>) {
  try {
    await requireAdmin()

    const { images, ...productData } = data

    // Update product
    const product = await prisma.product.update({
      where: { id },
      data: productData,
    })

    // Update images if provided
    if (images && images.length > 0) {
      // Delete existing images
      await prisma.productImage.deleteMany({
        where: { productId: id },
      })

      // Create new images
      await prisma.productImage.createMany({
        data: images.map(url => ({ url, productId: id })),
      })
    }

    revalidatePath('/admin/products')
    revalidatePath(`/admin/products/${id}`)
    revalidatePath('/products')

    return {
      success: true,
      data: product,
      message: 'Product updated successfully',
    }
  } catch (error) {
    console.error('Error updating product:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update product',
    }
  }
}

/**
 * Delete product (admin only)
 */
export async function deleteProductAction(id: string) {
  try {
    await requireAdmin()

    await prisma.product.delete({
      where: { id },
    })

    revalidatePath('/admin/products')
    revalidatePath('/products')

    return {
      success: true,
      message: 'Product deleted successfully',
    }
  } catch (error) {
    console.error('Error deleting product:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete product',
    }
  }
}
