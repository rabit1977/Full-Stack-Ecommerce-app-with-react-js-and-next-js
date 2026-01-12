'use server';

import { prisma } from '@/lib/db';

export async function syncUserData(userId: string) {
  try {
    const userCart = await prisma.cartItem.findMany({
      where: { userId },
      select: { productId: true },
    });

    const userSavedForLater = await prisma.savedForLater.findMany({
      where: { userId },
      select: { productId: true },
    });

    return {
      cart: userCart.map((item) => item.productId),
      savedForLater: userSavedForLater.map((item) => item.productId),
    };
  } catch (error) {
    console.error('Failed to sync user data:', error);
    return {
      cart: [],
      savedForLater: [],
    };
  }
}
