'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

// Helper to check admin access
async function requireAdmin() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    throw new Error('Unauthorized: Admin access required');
  }
  return session;
}

export async function deleteUserFromAdminAction(userId: string) {
  try {
    const session = await requireAdmin();

    if (session.user.id === userId) {
      return {
        success: false,
        error: 'Admins cannot delete their own account.',
      };
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    revalidatePath('/admin/users');

    return {
      success: true,
      message: 'User deleted successfully.',
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to delete user.';
    console.error('deleteUserFromAdminAction Error:', errorMessage);
    return {
      success: false,
      error: errorMessage,
    };
  }
}
