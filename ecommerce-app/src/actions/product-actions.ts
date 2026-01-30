'use server';

import { Prisma } from '@/generated/prisma/client';
import { prisma } from '@/lib/db';
import { ProductWithRelations, SortKey } from '@/lib/types';

/**
 * Sort options
 */
const sortOptions: Record<SortKey, Prisma.ProductOrderByWithRelationInput | Prisma.ProductOrderByWithRelationInput[]> = {
  featured: [{ isFeatured: 'desc' }, { rating: 'desc' }],
  'price-asc': { price: 'asc' },
  'price-desc': { price: 'desc' },
  rating: { rating: 'desc' },
  newest: { createdAt: 'desc' },
  popularity: { reviewCount: 'desc' },
};

export interface GetProductsOptions {
  query?: string;
  categories?: string;
  subCategories?: string;
  brands?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStock?: boolean;
  featured?: boolean;
  archived?: boolean; // Admin use
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
 * Helper to create URL-friendly slug
 */
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/[^\w-]+/g, '')  // Remove all non-word chars
    .replace(/--+/g, '-')     // Replace multiple - with single -
    .replace(/^-+/, '')       // Trim - from start
    .replace(/-+$/, '');      // Trim - from end
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
    subCategories,
    brands,
    minPrice,
    maxPrice,
    minRating,
    inStock,
    featured,
    archived = false, // Default to not showing archived
    sort = 'featured',
    page = 1,
    limit = 12,
  } = options;

  const where: Prisma.ProductWhereInput = {
    AND: [
        // Default filter: hide archived products unless explicitly requested (e.g. by admin)
        { isArchived: archived }
    ],
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
        { subCategory: { contains: query, mode: 'insensitive' } },
      ],
    });
  }

  // Categories filter
  if (categories) {
    const list = categories.split(',').map((c) => c.trim()).filter(Boolean);
    if (list.length > 0) andArray.push({ category: { in: list } });
  }

  // SubCategories filter
  if (subCategories) {
    const list = subCategories.split(',').map((c) => c.trim()).filter(Boolean);
    if (list.length > 0) andArray.push({ subCategory: { in: list } });
  }

  // Brands filter
  if (brands) {
    const list = brands.split(',').map((b) => b.trim()).filter(Boolean);
    if (list.length > 0) andArray.push({ brand: { in: list } });
  }

  // Featured filter
  if (featured) {
      andArray.push({ isFeatured: true });
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
            // createdAt: true, // Optional if needed
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
        inBundles: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                price: true,
                images: {
                  select: { url: true },
                  take: 1
                }
              }
            }
          }
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
    const errorMessage = error instanceof Error ? error.message : 'Unknown database error';
    throw new Error(`Failed to fetch products: ${errorMessage}`);
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
        inBundles: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                price: true,
                images: {
                  select: { url: true },
                  take: 1
                }
              }
            }
          }
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
 * Get single product by Slug with all relations
 */
export async function getProductBySlugAction(
  slug: string,
): Promise<ProductWithRelations | null> {
  try {
    const product = await prisma.product.findFirst({
      where: {
        OR: [
          { slug: slug },
          { id: slug }
        ]
      },
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
        inBundles: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                price: true,
                images: {
                  select: { url: true },
                  take: 1
                }
              }
            }
          }
        },
        bundleItems: {
          include: {
             bundle: {
               select: {
                 id: true,
                 title: true,
                 slug: true,
                 price: true,
                 images: {
                   select: { url: true },
                   take: 1
                 }
               }
             }
          }
        },
        relatedTo: {
          include: {
             relatedProduct: {
              select: {
                id: true,
                title: true,
                price: true,
                images: {
                  select: { url: true },
                  take: 1
                }
              }
             }
          }
        },
      },
    });

    return product as ProductWithRelations | null;
  } catch (error) {
    console.error('Error fetching product by slug:', error);
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

    // Fetch categories and subcategories with counts
    // We remove the 'where' clause here to always show the full category tree structure
    // regardless of current filters, which helps users navigate out of deep filters.
    // If you prefer "narrowing" behavior, you can add 'where' back.
    const categoriesAgg = await prisma.product.groupBy({
      by: ['category', 'subCategory'],
      _count: {
        _all: true,
      },
    });

    // Process flat list into hierarchy
    const categoryMap = new Map<string, Set<string>>();
    categoriesAgg.forEach((item) => {
        if (!item.category) return;
        const subCats = categoryMap.get(item.category) || new Set();
        if (item.subCategory) {
            subCats.add(item.subCategory);
        }
        categoryMap.set(item.category, subCats);
    });

    const structuredCategories = Array.from(categoryMap.entries()).map(([category, subs]) => ({
        name: category,
        subCategories: Array.from(subs).sort()
    })).sort((a, b) => a.name.localeCompare(b.name));


    const brandsAgg = await prisma.product.groupBy({
      by: ['brand'],
      where: {
         ...where,
         brand: { not: '' } // Filter out empty brands
      },
    });

    const priceAgg = await prisma.product.aggregate({
      where,
      _min: { price: true },
      _max: { price: true },
    });

    return {
      categories: structuredCategories,
      brands: brandsAgg.map((b) => b.brand).filter(Boolean).sort(),
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
export async function createProductAction(data: ProductFormValues) {
  try {
    await requireAdmin();

    const validatedData = productFormSchema.parse(data);
    const { images, bundleItems, relatedProducts, ...productData } = validatedData;
    
    // Generate slug
    let slug = productData.slug || slugify(productData.title);
    
    // Ensure slug uniqueness
    const existingProduct = await prisma.product.findUnique({
      where: { slug },
    });
    
    if (existingProduct) {
        // Append a random string if duplicate
        slug = `${slug}-${Math.floor(Math.random() * 1000)}`;
    }

    // Explicitly handle fields potentially undefined in validatedData but needed for Prisma
    const product = await prisma.product.create({
      data: {
        title: productData.title,
        description: productData.description,
        price: productData.price,
        stock: productData.stock,
        brand: productData.brand,
        category: productData.category,
        subCategory: productData.subCategory,
        sku: productData.sku,
        barcode: productData.barcode,
        weight: productData.weight,
        isFeatured: productData.isFeatured || false,
        isArchived: productData.isArchived || false,
        discount: productData.discount || 0,
        thumbnail: images?.[0] || null,
        tags: productData.tags || [],
        
        // SEO
        slug,
        metaTitle: productData.metaTitle || productData.title,
        metaDescription: productData.metaDescription || productData.description.slice(0, 160),

        // JSON conversions
        dimensions: (productData.dimensions || Prisma.JsonNull) as unknown as Prisma.InputJsonValue,
        specifications: (productData.specifications || Prisma.JsonNull) as unknown as Prisma.InputJsonValue,
        options: (productData.options || Prisma.JsonNull) as unknown as Prisma.InputJsonValue,
        
        images: {
          create: images?.map((url) => ({ url })) || [],
        },

        inBundles: {
          create: bundleItems?.map(item => ({
              quantity: item.quantity,
              product: { connect: { id: item.productId } }
          })) || [],
        },

        // Use the 'relatedProducts' relation field (mapped to 'RelatedFrom')
        relatedProducts: {
          create: relatedProducts?.map(item => ({
             relatedProduct: { connect: { id: item.relatedId } },
             relationType: item.type,
             score: item.type === 'frequently_bought_together' ? 10 : 5
          })) || [],
        }
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
    const session = await requireAdmin();
    const userId = session.user.id;

    // Fetch current product for previous stock
    const currentProduct = await prisma.product.findUnique({
        where: { id },
        select: { stock: true }
    });

    if (!currentProduct) throw new Error('Product not found');

    const validatedData = productFormSchema.parse(data);
    const { images, bundleItems, relatedProducts, ...productData } = validatedData;

    // Handle slug update if provided
    let slug = productData.slug;
    if (slug) {
        slug = slugify(slug);
        const existing = await prisma.product.findFirst({
            where: { 
                slug, 
                NOT: { id } // Exclude current product
            }
        });
        if (existing) {
             throw new Error('Slug already exists');
        }
    }

    await prisma.product.update({
      where: { id },
      data: {
        title: productData.title,
        description: productData.description,
        price: productData.price,
        stock: productData.stock,
        brand: productData.brand,
        category: productData.category,
        subCategory: productData.subCategory,
        sku: productData.sku,
        barcode: productData.barcode,
        weight: productData.weight,
        isFeatured: productData.isFeatured,
        isArchived: productData.isArchived,
        discount: productData.discount,
        tags: productData.tags,
        
        // SEO
        ...(slug && { slug }),
        ...(productData.metaTitle && { metaTitle: productData.metaTitle }),
        ...(productData.metaDescription && { metaDescription: productData.metaDescription }),

        // JSON conversions
        ...(productData.dimensions !== undefined && { 
            dimensions: productData.dimensions as unknown as Prisma.InputJsonValue 
        }),
        ...(productData.specifications !== undefined && { 
            specifications: productData.specifications as unknown as Prisma.InputJsonValue 
        }),
        ...(productData.options !== undefined && { 
            options: productData.options as unknown as Prisma.InputJsonValue 
        }),

        ...(images && images.length > 0 && { thumbnail: images[0] }),

        ...(bundleItems !== undefined && {
             inBundles: {
                 deleteMany: {},
                 create: bundleItems.map(item => ({
                    quantity: item.quantity,
                    product: { connect: { id: item.productId } }
                 })),
             }
        }),

        ...(relatedProducts !== undefined && {
            // Use the 'relatedProducts' relation field (mapped to 'RelatedFrom')
            relatedProducts: {
                deleteMany: { relationType: { in: ['similar', 'frequently_bought_together'] } },
                create: relatedProducts.map(item => ({
                    relatedProduct: { connect: { id: item.relatedId } },
                    relationType: item.type,
                    score: item.type === 'frequently_bought_together' ? 10 : 5
                })),
            }
        }),
      },
    });

    // Log Inventory Change if Stock Updated
    if (productData.stock !== undefined && productData.stock !== currentProduct.stock) {
        const diff = productData.stock - currentProduct.stock;
        await prisma.inventoryLog.create({
            data: {
                productId: id,
                type: 'ADJUSTMENT',
                quantity: diff,
                previousStock: currentProduct.stock,
                newStock: productData.stock,
                reason: 'Manual Adjustment by Admin',
                performedBy: userId
            }
        });
    }

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
