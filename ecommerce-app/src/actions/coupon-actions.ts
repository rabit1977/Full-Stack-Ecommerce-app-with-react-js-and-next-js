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
      code: { equals: couponCode, mode: 'insensitive' },
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

// Admin Actions

export async function getCouponsAction() {
  const session = await auth();
  if (session?.user.role !== 'ADMIN') {
    return { success: false, message: 'Unauthorized' };
  }

  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { orders: true, users: true }
        }
      }
    });
    return { success: true, coupons };
  } catch (error) {
    console.error('Error fetching coupons:', error);
    return { success: false, message: 'Failed to fetch coupons' };
  }
}

export async function createCouponAction(data: {
  code: string;
  discount: number;
  type: 'PERCENTAGE' | 'FIXED';
  expiresAt?: Date | null;
  isActive?: boolean;
}) {
  const session = await auth();
  if (session?.user.role !== 'ADMIN') {
    return { success: false, message: 'Unauthorized' };
  }

  try {
    const coupon = await prisma.coupon.create({
      data: {
        code: data.code.toUpperCase(),
        discount: data.discount,
        type: data.type,
        expiresAt: data.expiresAt,
        isActive: data.isActive ?? true,
      },
    });
    revalidatePath('/admin/coupons');
    return { success: true, coupon, message: 'Coupon created successfully' };
  } catch (error) {
    console.error('Error creating coupon:', error);
    return { success: false, message: 'Failed to create coupon. Code might already exist.' };
  }
}

export async function toggleCouponStatusAction(id: string, isActive: boolean) {
  const session = await auth();
  if (session?.user.role !== 'ADMIN') {
    return { success: false, message: 'Unauthorized' };
  }

  try {
    await prisma.coupon.update({
      where: { id },
      data: { isActive },
    });
    revalidatePath('/admin/coupons');
    return { success: true, message: `Coupon ${isActive ? 'activated' : 'deactivated'} successfully` };
  } catch (error) {
    console.error('Error toggling coupon status:', error);
    return { success: false, message: 'Failed to update coupon status' };
  }
}

export async function deleteCouponAction(id: string) {
  const session = await auth();
  if (session?.user.role !== 'ADMIN') {
    return { success: false, message: 'Unauthorized' };
  }

  try {
    await prisma.coupon.delete({
      where: { id },
    });
    revalidatePath('/admin/coupons');
    return { success: true, message: 'Coupon deleted successfully' };
  } catch (error) {
    console.error('Error deleting coupon:', error);
    return { success: false, message: 'Failed to delete coupon' };
  }
}
