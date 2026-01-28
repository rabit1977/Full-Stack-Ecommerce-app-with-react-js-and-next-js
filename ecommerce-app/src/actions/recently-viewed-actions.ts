'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

/**
 * Record a product view for the current user
 */
export async function recordViewAction(productId: string) {
  try {
    const session = await auth();
    
    // Only track for logged-in users in DB
    if (!session?.user?.id) {
      return { success: false, isGuest: true };
    }

    // Upsert to update timestamp if exists
    await prisma.recentlyViewed.upsert({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
      update: {
        viewedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        productId,
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Error recording view:', error);
    return { success: false };
  }
}

/**
 * Get recently viewed products for the current user
 */
export async function getRecentlyViewedAction(limit = 6, excludeProductId?: string) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return { success: false, products: [], isGuest: true };
    }

    const views = await prisma.recentlyViewed.findMany({
      where: {
        userId: session.user.id,
        productId: excludeProductId ? { not: excludeProductId } : undefined,
      },
      orderBy: {
        viewedAt: 'desc',
      },
      take: limit,
      include: {
        product: {
          include: {
            images: {
              take: 1,
              orderBy: { position: 'asc' },
            },
            reviews: {
              select: { rating: true },
            }
          },
        },
      },
    });

    const products = views.map(view => {
        const { product } = view;
        const avgRating = product.reviews.length 
            ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length 
            : 0;
            
        return {
            ...product, // Serialize properly if needed
            rating: avgRating, // Add calculated rating
            reviewCount: product.reviews.length,
            reviews: undefined, // remove raw reviews
            image: product.images[0]?.url || product.thumbnail || null,
        };
    });

    return { success: true, products };

  } catch (error) {
    console.error('Error fetching recently viewed:', error);
    return { success: false, products: [] };
  }
}

/**
 * Clear recently viewed history
 */
export async function clearRecentlyViewedAction() {
    const session = await auth();
    if (!session?.user?.id) return { success: false };
    
    await prisma.recentlyViewed.deleteMany({
        where: { userId: session.user.id }
    });
    
    revalidatePath('/account');
    return { success: true };
}
