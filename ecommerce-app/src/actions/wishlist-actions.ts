'use server';

import { auth } from '@/auth';
import { Prisma } from '@/generated/prisma/client';
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
    console.error('Error fetching wishlist:', error);
    return { success: false, error: 'Failed to fetch wishlist.', wishlist: [] };
  }
}

/**
 * Get wishlist items with full product details
 */
export async function getWishlistItemsAction() {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized', items: [] };
  }

  try {
    const wishlistItems = await prisma.wishlistItem.findMany({
      where: { userId: session.user.id },
      include: {
        product: {
          include: {
            images: { select: { id: true, url: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    
    return {
      success: true,
      items: wishlistItems,
    };
  } catch (error) {
    console.error('Error fetching wishlist items:', error);
    return { success: false, error: 'Failed to fetch wishlist.', items: [] };
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
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized', wishlist: [] };
  }
  const userId = session.user.id;

  try {
    // Use a transaction for data integrity
    const result = await prisma.$transaction(async (tx) => {
      // Check if product exists
      const product = await tx.product.findUnique({
        where: { id: productId },
        select: { id: true },
      });

      if (!product) {
        throw new Error('Product not found');
      }

      const existingItem = await tx.wishlistItem.findUnique({
        where: {
          userId_productId: {
            userId,
            productId,
          },
        },
      });

      let action: 'added' | 'removed';

      if (existingItem) {
        // Item exists, so remove it
        await tx.wishlistItem.delete({
          where: { id: existingItem.id },
        });
        action = 'removed';
      } else {
        // Item does not exist, so add it
        await tx.wishlistItem.create({
          data: {
            userId,
            productId,
          },
        });
        action = 'added';
      }

      // Fetch the updated wishlist
      const updatedItems = await tx.wishlistItem.findMany({
        where: { userId },
        select: { productId: true },
      });

      return {
        action,
        wishlist: updatedItems.map((item) => item.productId),
      };
    });

    // Revalidate relevant pages
    revalidatePath('/wishlist');
    revalidatePath(`/product/${productId}`);
    revalidatePath(`/products/${productId}`);
    revalidatePath('/products');

    return {
      success: true,
      wishlist: result.wishlist,
    };
  } catch (error) {
    console.error('Error toggling wishlist item:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
      return { success: false, error: 'Session invalid. Please sign out and sign in again.', wishlist: [] };
    }
    const message = error instanceof Error ? error.message : 'Operation failed.';
    return { success: false, error: message, wishlist: [] };
  }
}

/**
 * Add a product to the wishlist (without toggle behavior)
 */
export async function addToWishlistAction(productId: string): Promise<WishlistActionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized', wishlist: [] };
  }
  const userId = session.user.id;

  try {
    // Check if already in wishlist
    const existing = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
    });

    if (existing) {
      // Already in wishlist, return current list
      const items = await prisma.wishlistItem.findMany({
        where: { userId },
        select: { productId: true },
      });
      return {
        success: true,
        wishlist: items.map((item) => item.productId),
      };
    }

    // Add to wishlist
    await prisma.wishlistItem.create({
      data: { userId, productId },
    });

    const items = await prisma.wishlistItem.findMany({
      where: { userId },
      select: { productId: true },
    });

    revalidatePath('/wishlist');
    revalidatePath(`/product/${productId}`);

    return {
      success: true,
      wishlist: items.map((item) => item.productId),
    };
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    return { success: false, error: 'Failed to add to wishlist.', wishlist: [] };
  }
}

/**
 * Remove a product from the wishlist
 */
export async function removeFromWishlistAction(productId: string): Promise<WishlistActionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized', wishlist: [] };
  }
  const userId = session.user.id;

  try {
    await prisma.wishlistItem.deleteMany({
      where: { userId, productId },
    });

    const items = await prisma.wishlistItem.findMany({
      where: { userId },
      select: { productId: true },
    });

    revalidatePath('/wishlist');
    revalidatePath(`/product/${productId}`);

    return {
      success: true,
      wishlist: items.map((item) => item.productId),
    };
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    return { success: false, error: 'Failed to remove from wishlist.', wishlist: [] };
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
    revalidatePath('/products');

    return { success: true, wishlist: [] };
  } catch (error) {
    console.error('Error clearing wishlist:', error);
    return { success: false, error: 'Failed to clear wishlist.' };
  }
}

/**
 * Move all wishlist items to cart
 */
export async function moveAllToCartAction() {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized', movedCount: 0, failedCount: 0 };
  }
  const userId = session.user.id;

  try {
    const wishlistItems = await prisma.wishlistItem.findMany({
      where: { userId },
      include: { product: { select: { id: true, stock: true, title: true } } },
    });

    let movedCount = 0;
    let failedCount = 0;
    const failedProducts: string[] = [];

    for (const item of wishlistItems) {
      if (item.product.stock <= 0) {
        failedCount++;
        failedProducts.push(item.product.title);
        continue;
      }

      try {
        // Check if already in cart
        const existingCartItem = await prisma.cartItem.findFirst({
          where: { userId, productId: item.productId },
        });

        if (existingCartItem) {
          // Update quantity if doesn't exceed stock
          const newQuantity = existingCartItem.quantity + 1;
          if (newQuantity <= item.product.stock) {
            await prisma.cartItem.update({
              where: { id: existingCartItem.id },
              data: { quantity: newQuantity },
            });
            // Only remove from wishlist if update succeeded
            await prisma.wishlistItem.delete({
               where: { id: item.id },
            });
            movedCount++;
          } else {
             failedCount++;
             failedProducts.push(item.product.title);
          }
        } else {
          // Create new cart item
          await prisma.cartItem.create({
            data: { userId, productId: item.productId, quantity: 1 },
          });
          // Remove from wishlist
          await prisma.wishlistItem.delete({
             where: { id: item.id },
          });
          movedCount++;
        }
      } catch {
        failedCount++;
        failedProducts.push(item.product.title);
      }
    }

    revalidatePath('/wishlist');
    revalidatePath('/cart');

    if (failedCount > 0 && movedCount > 0) {
      return {
        success: true,
        movedCount,
        failedCount,
        message: `Moved ${movedCount} items to cart. ${failedCount} items couldn't be moved (out of stock).`,
      };
    } else if (failedCount > 0) {
      return {
        success: false,
        error: 'All items are out of stock.',
        movedCount: 0,
        failedCount,
      };
    }

    return {
      success: true,
      movedCount,
      failedCount: 0,
      message: `Moved ${movedCount} items to cart.`,
    };
  } catch (error) {
    console.error('Error moving wishlist to cart:', error);
    return { success: false, error: 'Failed to move items to cart.', movedCount: 0, failedCount: 0 };
  }
}
