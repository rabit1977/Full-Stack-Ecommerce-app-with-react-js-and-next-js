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
