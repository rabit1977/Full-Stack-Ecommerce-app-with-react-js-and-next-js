'use server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function applyCouponAction(couponCode: string) {
  const session = await auth();
  if (!session?.user.id) {
    return { success: false, message: 'Not authenticated' };
  }

  const coupon = await prisma.coupon.findFirst({
    where: {
      code: couponCode,
      isActive: true,
      OR: [{ expiresAt: null }, { expiresAt: { gte: new Date() } }],
    },
  });

  if (!coupon) {
    return { success: false, message: 'Coupon not found or expired' };
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { couponId: coupon.id },
    });
    revalidatePath('/cart');
    revalidatePath('/checkout');
    return { success: true, message: 'Coupon applied successfully' };
  } catch (error) {
    console.error('Error applying coupon:', error);
    return { success: false, message: 'Failed to apply coupon' };
  }
}

export async function removeCouponAction() {
  const session = await auth();
  if (!session?.user.id) {
    return { success: false, message: 'Not authenticated' };
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { couponId: null },
    });
    revalidatePath('/cart');
    revalidatePath('/checkout');
    return { success: true, message: 'Coupon removed successfully' };
  } catch (error) {
    console.error('Error removing coupon:', error);
    return { success: false, message: 'Failed to remove coupon' };
  }
}
