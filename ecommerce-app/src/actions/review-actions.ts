'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

interface ReviewData {
  rating: number;
  title: string;
  comment: string;
}

export async function addOrUpdateReviewAction(
  productId: string,
  reviewData: ReviewData
) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }
  const userId = session.user.id;

  try {
    const { rating, title, comment } = reviewData;

    // Upsert the review
    const review = await prisma.review.upsert({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
      update: { rating, title, comment },
      create: {
        userId,
        productId,
        rating,
        title,
        comment,
      },
    });

    // After review is created/updated, recalculate product's average rating and review count
    const stats = await prisma.review.aggregate({
      where: { productId },
      _avg: { rating: true },
      _count: { id: true },
    });

    await prisma.product.update({
      where: { id: productId },
      data: {
        rating: stats._avg.rating || 0,
        reviewCount: stats._count.id || 0,
      },
    });

    revalidatePath(`/products/${productId}`);
    revalidatePath(`/`);

    return { success: true, review };
  } catch (error) {
    console.error('Error adding or updating review:', error);
    return { success: false, error: 'Failed to submit review.' };
  }
}

/**
 * Delete a product review
 */
export async function deleteReviewAction(reviewId: string, productId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    // Check if review exists and belongs to current user
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      return { success: false, error: 'Review not found' };
    }

    if (review.userId !== session.user.id) {
      return { success: false, error: 'Unauthorized' };
    }

    // Delete the review
    await prisma.review.delete({
      where: { id: reviewId },
    });

    // Recalculate product's average rating and review count
    const stats = await prisma.review.aggregate({
      where: { productId },
      _avg: { rating: true },
      _count: { id: true },
    });

    await prisma.product.update({
      where: { id: productId },
      data: {
        rating: stats._avg.rating || 0,
        reviewCount: stats._count.id || 0,
      },
    });

    revalidatePath(`/products/${productId}`);
    revalidatePath(`/`);

    return { success: true };
  } catch (error) {
    console.error('Error deleting review:', error);
    return { success: false, error: 'Failed to delete review' };
  }
}

/**
 * Toggle helpful status on a review
 * Stores helpful review IDs in user's helpfulReviews array
 */
export async function toggleReviewHelpfulAction(reviewId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }
  const userId = session.user.id;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    let isMarkedHelpful = false;
    let updatedHelpfulReviews = user.helpfulReviews || [];

    if (updatedHelpfulReviews.includes(reviewId)) {
      // Remove from helpful
      updatedHelpfulReviews = updatedHelpfulReviews.filter(
        (id) => id !== reviewId
      );
    } else {
      // Add to helpful
      updatedHelpfulReviews.push(reviewId);
      isMarkedHelpful = true;
    }

    // Update user's helpfulReviews array
    await prisma.user.update({
      where: { id: userId },
      data: { helpfulReviews: updatedHelpfulReviews },
    });

    revalidatePath(`/`);

    return { success: true, isMarkedHelpful };
  } catch (error) {
    console.error('Error toggling review helpful:', error);
    return { success: false, error: 'Failed to update review' };
  }
}

// ==========================================
// ADMIN ACTIONS
// ==========================================

async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }
  return session;
}

export async function getAllReviewsAction(
  page = 1,
  limit = 10,
  search = ''
) {
  try {
    await requireAdmin();
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { comment: { contains: search, mode: 'insensitive' } },
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { product: { title: { contains: search, mode: 'insensitive' } } }
      ];
    }

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        include: {
          user: { select: { name: true, image: true, email: true } },
          product: { select: { id: true, title: true, thumbnail: true, slug: true } }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.review.count({ where })
    ]);

    return { 
        success: true, 
        reviews, 
        total, 
        pages: Math.ceil(total / limit) 
    };
  } catch (error) {
    console.error('Admin Fetch Reviews Error:', error);
    return { success: false, error: 'Failed to fetch reviews' };
  }
}

export async function adminDeleteReviewAction(id: string) {
    try {
        await requireAdmin();
        const review = await prisma.review.delete({ 
            where: { id },
            select: { productId: true } 
        });
        
        // Recalculate stats
        const stats = await prisma.review.aggregate({
            where: { productId: review.productId },
            _avg: { rating: true },
            _count: { id: true },
        });

        await prisma.product.update({
            where: { id: review.productId },
            data: {
                rating: stats._avg.rating || 0,
                reviewCount: stats._count.id || 0,
            },
        });

        revalidatePath('/admin/reviews');
        revalidatePath(`/products/${review.productId}`);
        return { success: true, message: 'Review deleted' };
    } catch (error) {
        return { success: false, error: 'Failed to delete review' };
    }
}

export async function toggleReviewVisibilityAction(id: string) {
    try {
        await requireAdmin();
        const r = await prisma.review.findUnique({ where: { id }, select: { isApproved: true, productId: true } });
        if (!r) throw new Error('Not found');

        await prisma.review.update({
            where: { id },
            data: { isApproved: !r.isApproved }
        });

        revalidatePath('/admin/reviews');
        revalidatePath(`/products/${r.productId}`);
        return { success: true, message: 'Visibility updated' };
    } catch (error) {
        return { success: false, error: 'Failed to update visibility' };
    }
}

export async function adminReplyReviewAction(id: string, response: string) {
    try {
        await requireAdmin();
        await prisma.review.update({
            where: { id },
            data: { 
                adminResponse: response,
                adminRespondedAt: new Date()
            }
        });
        revalidatePath('/admin/reviews');
        return { success: true, message: 'Reply added' };
    } catch (error) {
        return { success: false, error: 'Failed to reply' };
    }
}
