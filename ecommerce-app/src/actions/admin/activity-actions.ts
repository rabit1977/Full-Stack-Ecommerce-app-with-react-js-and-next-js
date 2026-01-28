'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/db';

export async function getActivityLogs(limit = 50) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  try {
    const logs = await prisma.activityLog.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            name: true,
            image: true,
            email: true, // Useful for debugging or tooltip
          },
        },
      },
    });
    return { success: true, data: logs };
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    return { success: false, error: 'Failed to fetch activity logs' };
  }
}
