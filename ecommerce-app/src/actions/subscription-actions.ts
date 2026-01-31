'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

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
 * Get all subscriptions (admin only)
 */
export async function getAllSubscriptionsAction() {
  try {
    await requireAdmin();

    const subscriptions = await prisma.subscription.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      success: true,
      data: subscriptions,
    };
  } catch (error) {
    console.error('getAllSubscriptionsAction Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch subscriptions',
      data: [],
    };
  }
}

/**
 * Cancel subscription (admin only)
 */
export async function cancelSubscriptionAction(subscriptionId: string) {
  try {
    await requireAdmin();

    const subscription = await prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date(),
        cancelReason: 'Cancelled by administrator',
      },
    });

    revalidatePath('/admin/subscriptions');

    return {
      success: true,
      message: 'Subscription cancelled successfully',
      data: subscription,
    };
  } catch (error) {
    console.error('cancelSubscriptionAction Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to cancel subscription',
    };
  }
}
