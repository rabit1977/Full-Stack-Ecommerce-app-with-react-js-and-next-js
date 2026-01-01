'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'

interface ReviewData {
  rating: number
  title: string
  comment: string
}

export async function addOrUpdateReviewAction(
  productId: string,
  reviewData: ReviewData
) {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' }
  }
  const userId = session.user.id

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
