'use server';

import { auth } from '@/auth';
import { GiftCardStatus } from '@/generated/prisma/enums';
import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const giftCardSchema = z.object({
  initialAmount: z.coerce.number().min(1, 'Amount must be at least 1'),
  recipientEmail: z.string().email().optional().or(z.literal('')),
  senderName: z.string().optional(),
  message: z.string().optional(),
  expiresAt: z.coerce.date().optional().nullable(),
  status: z.nativeEnum(GiftCardStatus).default(GiftCardStatus.ACTIVE),
});

export type GiftCardFormData = z.infer<typeof giftCardSchema>;

export async function getGiftCards() {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  try {
    const giftCards = await prisma.giftCard.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        purchaser: { select: { name: true, email: true } },
        recipient: { select: { name: true, email: true } },
      },
    });
    return { success: true, giftCards };
  } catch (error) {
    console.error('Error fetching gift cards:', error);
    return { success: false, error: 'Failed to fetch gift cards' };
  }
}

function generateCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  // Format: XXXX-XXXX-XXXX-XXXX
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    if (i < 3) code += '-';
  }
  return code;
}

export async function createGiftCard(data: GiftCardFormData) {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') {
    return { success: false, error: 'Unauthorized' };
  }

  const result = giftCardSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: 'Invalid input' };
  }

  try {
    // Generate unique code
    let code = generateCode();
    let existing = await prisma.giftCard.findUnique({ where: { code } });
    while (existing) {
      code = generateCode();
      existing = await prisma.giftCard.findUnique({ where: { code } });
    }

    const giftCard = await prisma.giftCard.create({
      data: {
        ...result.data,
        code,
        balance: result.data.initialAmount,
        // Manually created by admin, no purchaser relation by default unless we ascribe it to admin
      },
    });

    revalidatePath('/admin/gift-cards');
    return { success: true, giftCard };
  } catch (error) {
    console.error('Error creating gift card:', error);
    return { success: false, error: 'Failed to create gift card' };
  }
}

export async function updateGiftCardStatus(id: string, status: GiftCardStatus) {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const giftCard = await prisma.giftCard.update({
      where: { id },
      data: { status },
    });

    revalidatePath('/admin/gift-cards');
    return { success: true, giftCard };
  } catch (error) {
    console.error('Error updating gift card:', error);
    return { success: false, error: 'Failed to update gift card' };
  }
}

export async function deleteGiftCard(id: string) {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    await prisma.giftCard.delete({
      where: { id },
    });

    revalidatePath('/admin/gift-cards');
    return { success: true };
  } catch (error) {
    console.error('Error deleting gift card:', error);
    return { success: false, error: 'Failed to delete gift card' };
  }
}
