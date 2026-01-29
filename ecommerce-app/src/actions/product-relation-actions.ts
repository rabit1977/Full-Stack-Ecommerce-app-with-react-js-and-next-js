'use server';

import { prisma } from '@/lib/db';

/**
 * Get products related to the current product.
 * Prioritizes manual 'similar' relations, falls back to category matching.
 */
export async function getRelatedProductsAction(productId: string, limit = 4) {
  try {
    // 1. Check for manual relations
    const relatedRelations = await prisma.productRelation.findMany({
      where: {
        productId,
        relationType: 'similar',
      },
      include: {
        relatedProduct: {
          include: {
            images: { orderBy: { position: 'asc' }, take: 1 },
            reviews: { select: { rating: true } },
          },
        },
      },
      take: limit,
      orderBy: { score: 'desc' },
    });

    const manualProducts = relatedRelations.map((r) => {
           const p = r.relatedProduct;
           return {
             ...p,
             rating: p.reviews.length ? p.reviews.reduce((a: number, b: { rating: number }) => a + b.rating, 0) / p.reviews.length : 0,
             reviewCount: p.reviews.length,
             image: p.images[0]?.url || p.thumbnail,
             options: p.options as any,
             specifications: p.specifications as any,
             dimensions: p.dimensions as any,
             reviews: [] as any,
           };
    });

    // If we have enough manual relations, return them
    if (manualProducts.length >= limit) {
      return {
        success: true,
        products: manualProducts,
      };
    }

    // 2. Fallback: Category matching (Fill the rest)
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { category: true },
    });

    if (!product) return { success: true, products: manualProducts };

    const remainingLimit = limit - manualProducts.length;
    const manualIds = manualProducts.map(p => p.id);
    
    // Fallback: Products in the same category, excluding itself and already selected manual relations
    const fallbackProducts = await prisma.product.findMany({
      where: {
        AND: [
          { id: { not: productId } },
          { id: { notIn: manualIds } },
          { isArchived: false },
          { category: product.category },
        ],
      },
      include: {
        images: { orderBy: { position: 'asc' }, take: 1 },
        reviews: { select: { rating: true } },
      },
      take: remainingLimit,
      orderBy: {
        salesCount: 'desc', 
      },
    });
    
    const formattedFallback = fallbackProducts.map((p) => ({
        ...p,
        rating: p.reviews.length ? p.reviews.reduce((a: number, b: { rating: number }) => a + b.rating, 0) / p.reviews.length : 0,
        reviewCount: p.reviews.length,
        image: p.images[0]?.url || p.thumbnail,
        options: p.options as any,
        specifications: p.specifications as any,
        dimensions: p.dimensions as any,
        reviews: [] as any,
    }));

    return {
      success: true,
      products: [...manualProducts, ...formattedFallback],
    };

  } catch (error) {
    console.error('Error fetching related products:', error);
    return { success: false, products: [] };
  }
}

/**
 * Get "Frequently Bought Together" products
 */
export async function getFrequentlyBoughtTogetherAction(productId: string, limit = 2) {
  try {
    const relations = await prisma.productRelation.findMany({
      where: {
        productId,
        relationType: 'frequently_bought_together',
      },
      include: {
        relatedProduct: {
           include: {
            images: { orderBy: { position: 'asc' }, take: 1 },
            reviews: { select: { rating: true } },
           }
        }
      },
      take: limit,
      orderBy: { score: 'desc' },
    });
    
    // Fallback: If no explicit relations, maybe random popular items? 
    // For now, return empty if no explicit relations to stay clean.
    
    return {
       success: true,
       products: relations.map(r => ({
           ...r.relatedProduct,
           rating: r.relatedProduct.reviews.length ? r.relatedProduct.reviews.reduce((a: number, b: { rating: number }) => a + b.rating, 0) / r.relatedProduct.reviews.length : 0,
           reviewCount: r.relatedProduct.reviews.length,
           image: r.relatedProduct.images[0]?.url || r.relatedProduct.thumbnail,
           options: r.relatedProduct.options as any,
           specifications: r.relatedProduct.specifications as any,
           dimensions: r.relatedProduct.dimensions as any,
           reviews: [] as any,
       }))
    };
    
  } catch (error) {
      console.error('Error fetching FBT products:', error);
      return { success: false, products: [] };
  }
}
