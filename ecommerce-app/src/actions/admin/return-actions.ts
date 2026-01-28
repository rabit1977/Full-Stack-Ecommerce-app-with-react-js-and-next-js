'use server';

import { auth } from '@/auth';
import { ReturnStatus } from '@/generated/prisma/enums';
import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function getReturnRequests() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  try {
    const requests = await prisma.returnRequest.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true, email: true },
        },
        order: {
          select: { orderNumber: true, total: true },
        },
      },
    });
    return { success: true, data: requests };
  } catch (error) {
    console.error('Error fetching return requests:', error);
    return { success: false, error: 'Failed to fetch return requests' };
  }
}

export async function updateReturnRequestStatus(
  id: string,
  status: ReturnStatus,
  adminNotes?: string
) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const updated = await prisma.returnRequest.update({
      where: { id },
      data: {
        status,
        adminNotes,
        processedBy: session.user.id,
      },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: session.user.id!,
        action: 'RETURN_PROCESSED',
        description: `Return request ${id} updated to ${status}`,
        metadata: { id, status },
      }
    });

    revalidatePath('/admin/returns');
    return { success: true, data: updated };
  } catch (error) {
    console.error('Error updating return request:', error);
    return { success: false, error: 'Failed to update return request' };
  }
}
