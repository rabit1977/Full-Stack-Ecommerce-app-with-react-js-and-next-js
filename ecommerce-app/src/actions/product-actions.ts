'use server';

import { Prisma } from '@/generated/prisma/client';
import { prisma } from '@/lib/db';
import { ProductOption, ProductWithRelations, SortKey } from '@/lib/types';

/**
 * Sort options
 */
const sortOptions: Record<SortKey, Prisma.ProductOrderByWithRelationInput> = {
  featured: { rating: 'desc' },
  'price-asc': { price: 'asc' },
  'price-desc': { price: 'desc' },
  rating: { rating: 'desc' },
  newest: { createdAt: 'desc' },
  popularity: { reviewCount: 'desc' },
};

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
  products: ProductWithRelations[];
  totalCount: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

/**
 * Get products with filters and pagination
 */
export async function getProductsAction(
  options: GetProductsOptions = {},
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
    limit = 12,
  } = options;

  const where: Prisma.ProductWhereInput = {
    AND: [],
  };

  const andArray = where.AND as Prisma.ProductWhereInput[];

  // Search query
  if (query) {
    andArray.push({
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { brand: { contains: query, mode: 'insensitive' } },
        { category: { contains: query, mode: 'insensitive' } },
      ],
    });
  }

  // Categories filter
  if (categories) {
    const categoryList = categories
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);
    if (categoryList.length > 0) {
      andArray.push({ category: { in: categoryList } });
    }
  }

  // Brands filter
  if (brands) {
    const brandList = brands
      .split(',')
      .map((b) => b.trim())
      .filter(Boolean);
    if (brandList.length > 0) {
      andArray.push({ brand: { in: brandList } });
    }
  }

  // Price range
  if (minPrice !== undefined) andArray.push({ price: { gte: minPrice } });
  if (maxPrice !== undefined) andArray.push({ price: { lte: maxPrice } });

  // Rating filter
  if (minRating !== undefined) andArray.push({ rating: { gte: minRating } });

  // Stock filter
  if (inStock) andArray.push({ stock: { gt: 0 } });

  const orderBy = sortOptions[sort] || sortOptions.featured;
  const skip = (page - 1) * limit;

  try {
    // Run queries sequentially to stay within Supabase connection limits (max: 1)
    const products = await prisma.product.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        images: {
          select: {
            id: true,
            url: true,
          },
        },
        reviews: {
          select: {
            id: true,
            userId: true,
            productId: true,
            rating: true,
            title: true,
            comment: true,
            helpful: true,
            verifiedPurchase: true,
            createdAt: true,
            user: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });

    const totalCount = await prisma.product.count({ where });

    const totalPages = Math.ceil(totalCount / limit);

    return {
      products: products as ProductWithRelations[],
      totalCount,
      page,
      totalPages,
      hasMore: page < totalPages,
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error('Failed to fetch products');
  }
}

/**
 * Get single product by ID with all relations
 */
export async function getProductByIdAction(
  id: string,
): Promise<ProductWithRelations | null> {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        images: {
          select: {
            id: true,
            url: true,
          },
        },
        reviews: {
          select: {
            id: true,
            userId: true,
            productId: true,
            rating: true,
            title: true,
            comment: true,
            helpful: true,
            verifiedPurchase: true,
            createdAt: true,
            user: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });

    return product as ProductWithRelations | null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

/**
 * Get filter options (categories, brands, price range)
 */
export async function getFiltersAction(selectedCategories?: string) {
  try {
    const where: Prisma.ProductWhereInput = {};
    
    if (selectedCategories) {
      const categoryList = selectedCategories
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean);
      if (categoryList.length > 0) {
        where.category = { in: categoryList };
      }
    }

    // Run queries sequentially to respect the connection limit of 1
    const categoriesAgg = await prisma.product.groupBy({
      by: ['category'],
    });

    const brandsAgg = await prisma.product.groupBy({
      by: ['brand'],
      where,
    });

    const priceAgg = await prisma.product.aggregate({
      where,
      _min: { price: true },
      _max: { price: true },
    });

    return {
      categories: categoriesAgg.map((c) => c.category).sort(),
      brands: brandsAgg.map((b) => b.brand).sort(),
      minPrice: priceAgg._min.price || 0,
      maxPrice: priceAgg._max.price || 0,
    };
  } catch (error) {
    console.error('Error fetching filters:', error);
    return {
      categories: [],
      brands: [],
      minPrice: 0,
      maxPrice: 0,
    };
  }
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

/**
 * Helper to check admin access
 */
async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized: Admin access required');
  }
  return session;
}

/**
 * Create product (admin only)
 */
export async function createProductAction(data: {
  title: string;
  description: string;
  price: number;
  stock: number;
  brand: string;
  category: string;
  images?: string[];
  discount?: number;
  tags?: string[];
  features?: string[];
  options?: ProductOption[];
  specifications?: Record<string, string>;
}) {
  try {
    await requireAdmin();

    const { images, ...productData } = data;

    const product = await prisma.product.create({
      data: {
        ...productData,
        discount: productData.discount || 0,
        thumbnail: images?.[0] || null,
        tags: productData.tags || [],
        features: productData.features || [],
        options: (productData.options || Prisma.JsonNull) as unknown as Prisma.InputJsonValue,
        specifications: (productData.specifications || Prisma.JsonNull) as unknown as Prisma.InputJsonValue,
        images: {
          create: images?.map((url) => ({ url })) || [],
        },
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
export async function updateProductAction(
  id: string,
  data: Partial<ProductFormValues>,
) {
  try {
    await requireAdmin();

    const validatedData = productFormSchema.partial().parse(data);
    const { images, ...productData } = validatedData;

    // Separate Prisma-compatible fields from form fields
    const { title, description, price, stock, brand, category, discount } =
      productData;

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
        error: error.issues[0]?.message || 'Invalid data provided',
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
 * Apply bulk discount (admin only)
 */
export async function applyBulkDiscountAction(data: {
  discountType: 'all' | 'category' | 'brand';
  category?: string;
  brand?: string;
  discount: number;
}) {
  try {
    await requireAdmin();

    const where: Prisma.ProductWhereInput = {};
    if (data.discountType === 'category' && data.category) {
      where.category = data.category;
    }
    if (data.discountType === 'brand' && data.brand) {
      where.brand = data.brand;
    }

    const result = await prisma.product.updateMany({
      where,
      data: { discount: data.discount },
    });

    revalidatePath('/admin/products');
    revalidatePath('/products');

    return {
      success: true,
      message: `Discount applied to ${result.count} products`,
      count: result.count,
    };
  } catch (error) {
    console.error('Error applying bulk discount:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to apply discount',
    };
  }
}

/**
 * Get categories
 */
export async function getCategoriesAction(): Promise<string[]> {
  try {
    const categories = await prisma.product.findMany({
      distinct: ['category'],
      select: { category: true },
    });
    return categories.map((c) => c.category).sort();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

/**
 * Get brands
 */
export async function getBrandsAction(): Promise<string[]> {
  try {
    const brands = await prisma.product.findMany({
      distinct: ['brand'],
      select: { brand: true },
    });
    return brands.map((b) => b.brand).sort();
  } catch (error) {
    console.error('Error fetching brands:', error);
    return [];
  }
}

/**
 * Get price range
 */
export async function getPriceRangeAction(): Promise<{
  min: number;
  max: number;
}> {
  try {
    const result = await prisma.product.aggregate({
      _min: { price: true },
      _max: { price: true },
    });

    return {
      min: result._min.price || 0,
      max: result._max.price || 0,
    };
  } catch (error) {
    console.error('Error fetching price range:', error);
    return { min: 0, max: 0 };
  }
}

/**
 * Get multiple products by IDs
 */
export async function getProductsByIdsAction(
  ids: string[],
): Promise<ProductWithRelations[]> {
  const validIds = ids.filter(Boolean);
  if (validIds.length === 0) return [];

  try {
    const products = await prisma.product.findMany({
      where: { id: { in: validIds } },
      include: {
        images: {
          select: {
            id: true,
            url: true,
          },
        },
        reviews: {
          select: {
            id: true,
            userId: true,
            rating: true,
            title: true,
            comment: true,
            helpful: true,
            verifiedPurchase: true,
            createdAt: true,
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return products as ProductWithRelations[];
  } catch (error) {
    console.error('Error fetching products by IDs:', error);
    return [];
  }
}
