'use server';

import { auth } from '@/auth';
import { PromotionType } from '@/generated/prisma/enums';
import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// We need to ensure we import the enums correctly or redefine them if we can't import
const promotionSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  type: z.nativeEnum(PromotionType),
  discountType: z.enum(['percentage', 'fixed']),
  discountValue: z.coerce.number().min(0),
  startsAt: z.coerce.date(),
  endsAt: z.coerce.date(),
  badgeText: z.string().optional(),
  isActive: z.boolean().default(true),
  // bannerImage handled separately or ignored for now
});

export type PromotionFormData = z.infer<typeof promotionSchema>;

export async function getPromotions() {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  try {
    const promotions = await prisma.promotion.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });
    return { success: true, promotions };
  } catch (error) {
    console.error('Error fetching promotions:', error);
    return { success: false, error: 'Failed to fetch promotions' };
  }
}

export async function createPromotion(data: PromotionFormData) {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') {
    return { success: false, error: 'Unauthorized' };
  }

  const result = promotionSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: 'Invalid input' };
  }

  try {
    const promotion = await prisma.promotion.create({
      data: result.data,
    });

    revalidatePath('/admin/promotions');
    return { success: true, promotion };
  } catch (error) {
    console.error('Error creating promotion:', error);
    return { success: false, error: 'Failed to create promotion' };
  }
}

export async function updatePromotion(id: string, data: PromotionFormData) {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') {
    return { success: false, error: 'Unauthorized' };
  }

  const result = promotionSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: 'Invalid input' };
  }

  try {
    const promotion = await prisma.promotion.update({
      where: { id },
      data: result.data,
    });

    revalidatePath('/admin/promotions');
    return { success: true, promotion };
  } catch (error) {
    console.error('Error updating promotion:', error);
    return { success: false, error: 'Failed to update promotion' };
  }
}

export async function deletePromotion(id: string) {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    await prisma.promotion.delete({
      where: { id },
    });

    revalidatePath('/admin/promotions');
    return { success: true };
  } catch (error) {
    console.error('Error deleting promotion:', error);
    return { success: false, error: 'Failed to delete promotion' };
  }
}
