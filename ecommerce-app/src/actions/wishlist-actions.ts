'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

type WishlistActionResult = {
  success: boolean;
  wishlist: string[];
  error?: string;
};

/**
 * Get the product IDs of all items in the current user's wishlist.
 */
export async function getWishlistAction(): Promise<WishlistActionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized', wishlist: [] };
  }

  try {
    const wishlistItems = await prisma.wishlistItem.findMany({
      where: { userId: session.user.id },
      select: { productId: true },
    });
    return {
      success: true,
      wishlist: wishlistItems.map((item) => item.productId),
    };
  } catch (error) {
    return { success: false, error: 'Failed to fetch wishlist.', wishlist: [] };
  }
}

/**
 * Toggle a product in the current user's wishlist.
 * Adds the product if it's not there, removes it if it is.
 * Returns the updated list of wishlist product IDs.
 */
export async function toggleWishlistAction(
  productId: string,
): Promise<WishlistActionResult> {
  console.log('toggleWishlistAction called with productId:', productId);
  const session = await auth();
  console.log('toggleWishlistAction - session:', session);
  if (!session?.user?.id) {
    console.log('toggleWishlistAction - Not authenticated');
    return { success: false, error: 'Unauthorized', wishlist: [] };
  }
  const userId = session.user.id;

  try {
    const existingItem = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existingItem) {
      // Item exists, so remove it
      await prisma.wishlistItem.delete({
        where: {
          id: existingItem.id,
        },
      });
    } else {
      // Item does not exist, so add it
      await prisma.wishlistItem.create({
        data: {
          userId,
          productId,
        },
      });
    }

    revalidatePath('/wishlist');

    // Fetch the updated wishlist
    const updatedItems = await prisma.wishlistItem.findMany({
      where: { userId },
      select: { productId: true },
    });

    console.log(
      'toggleWishlistAction - Success, updated wishlist:',
      updatedItems.map((item) => item.productId),
    );
    return {
      success: true,
      wishlist: updatedItems.map((item) => item.productId),
    };
  } catch (error) {
    console.error('Error toggling wishlist item:', error);
    console.log('toggleWishlistAction - Failure:', error);
    return { success: false, error: 'Operation failed.', wishlist: [] };
  }
}

/**
 * Clears all items from the user's wishlist.
 */
export async function clearWishlistAction() {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    await prisma.wishlistItem.deleteMany({
      where: { userId: session.user.id },
    });

    revalidatePath('/wishlist');

    return { success: true, wishlist: [] };
  } catch (error) {
    console.error('Error clearing wishlist:', error);
    return { success: false, error: 'Failed to clear wishlist.' };
  }
}
