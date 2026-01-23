'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { UserRole } from '@/generated/prisma/client';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';

/**
 * Helper to check admin access
 */
async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized: Admin access required');
  }
  return session;
}

/**
 * Get all users (admin only)
 */
export async function getAllUsersAction() {
  try {
    await requireAdmin();

    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      success: true,
      data: users,
    };
  } catch (error) {
    console.error('getAllUsersAction Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch users',
      data: [],
    };
  }
}

/**
 * Get user by ID (admin only)
 */
export async function getUserByIdAction(userId: string) {
  try {
    await requireAdmin();

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        orders: {
          select: {
            id: true,
            total: true,
            status: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 10,
        },
        reviews: {
          select: {
            id: true,
            rating: true,
            createdAt: true,
          },
          take: 10,
        },
      },
    });

    if (!user) {
      return {
        success: false,
        error: 'User not found',
        data: null,
      };
    }

    return {
      success: true,
      data: user,
    };
  } catch (error) {
    console.error('getUserByIdAction Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch user',
      data: null,
    };
  }
}

/**
 * Delete user (admin only)
 */
export async function deleteUserFromAdminAction(userId: string) {
  try {
    const session = await requireAdmin();

    // Prevent admin from deleting themselves
    if (session.user.id === userId) {
      return {
        success: false,
        error: 'You cannot delete your own account',
      };
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, role: true },
    });

    if (!user) {
      return {
        success: false,
        error: 'User not found',
      };
    }

    // Delete user and all related data (cascade delete)
    await prisma.user.delete({
      where: { id: userId },
    });

    revalidatePath('/admin/users');

    return {
      success: true,
      message: `User "${user.name}" deleted successfully`,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to delete user';
    console.error('deleteUserFromAdminAction Error:', errorMessage);
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Update user role (admin only)
 */
export async function updateUserRoleAction(
  userId: string,
  newRole: UserRole
) {
  try {
    const session = await requireAdmin();

    // Prevent admin from changing their own role
    if (session.user.id === userId) {
      return {
        success: false,
        error: 'You cannot change your own role',
      };
    }

    // Update user role
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    revalidatePath('/admin/users');
    revalidatePath(`/admin/users/${userId}`);

    return {
      success: true,
      message: `User role updated to ${newRole}`,
      data: updatedUser,
    };
  } catch (error) {
    console.error('updateUserRoleAction Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update user role',
    };
  }
}

/**
 * Update user details (admin only)
 */
export async function updateUserAction(
  userId: string,
  data: {
    name?: string;
    email?: string;
    role?: UserRole;
    bio?: string;
  }
) {
  try {
    const session = await requireAdmin();

    // If changing role, prevent admin from changing their own
    if (data.role && session.user.id === userId) {
      return {
        success: false,
        error: 'You cannot change your own role',
      };
    }

    // Check if email is already in use by another user
    if (data.email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email: data.email,
          NOT: { id: userId },
        },
      });

      if (existingUser) {
        return {
          success: false,
          error: 'Email is already in use by another user',
        };
      }
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.email && { email: data.email }),
        ...(data.role && { role: data.role }),
        ...(data.bio !== undefined && { bio: data.bio }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    revalidatePath('/admin/users');
    revalidatePath(`/admin/users/${userId}`);

    return {
      success: true,
      message: 'User updated successfully',
      data: updatedUser,
    };
  } catch (error) {
    console.error('updateUserAction Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update user',
    };
  }
}

/**
 * Get user statistics (admin only)
 */
export async function getUserStatsAction() {
  try {
    await requireAdmin();

    const [totalUsers, adminCount, userCount, usersThisMonth] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'ADMIN' } }),
      prisma.user.count({ where: { role: 'USER' } }),
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setDate(1)), // First day of current month
          },
        },
      }),
    ]);

    return {
      success: true,
      data: {
        totalUsers,
        adminCount,
        userCount,
        usersThisMonth,
      },
    };
  } catch (error) {
    console.error('getUserStatsAction Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch user stats',
    };
  }
}

/**
 * Create new user (admin only)
 */
export async function createUserAction(data: {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  bio?: string;
}) {
  try {
    await requireAdmin();

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return {
        success: false,
        error: 'A user with this email already exists',
      };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create user
    const newUser = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role,
        bio: data.bio,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    revalidatePath('/admin/users');

    return {
      success: true,
      message: `User "${newUser.name}" created successfully`,
      data: newUser,
    };
  } catch (error) {
    console.error('createUserAction Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create user',
    };
  }
}