// lib/actions/user-actions.ts
'use server';

import { UserRole } from '@prisma/client';
import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { hash } from 'bcryptjs';

interface UpdateUserData {
  name: string;
  email: string;
  role: UserRole; // ✅ Changed from 'admin' | 'customer' to UserRole
  password?: string;
}

/**
 * Update user by ID
 */
export async function updateUser(userId: string, data: UpdateUserData) {
  try {
    // Check if email is already taken by another user
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser && existingUser.id !== userId) {
      return {
        success: false,
        error: 'An account with this email already exists.',
      };
    }

    // Prepare update data
    const updateData: any = {
      name: data.name,
      email: data.email,
      role: data.role,
    };

    // Only hash and update password if provided
    if (data.password && data.password.trim() !== '') {
      updateData.password = await hash(data.password, 10);
    }

    // Update user in database
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    revalidatePath('/admin/users');
    revalidatePath(`/admin/users/${userId}`);

    return {
      success: true,
      user: updatedUser,
    };
  } catch (error) {
    console.error('Error updating user:', error);
    return {
      success: false,
      error: 'Failed to update user. Please try again.',
    };
  }
}

/**
 * Create new user
 */
export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  role: UserRole; // ✅ Changed to UserRole
}) {
  try {
    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return {
        success: false,
        error: 'An account with this email already exists.',
      };
    }

    // Hash password
    const hashedPassword = await hash(data.password, 10);

    // Create user
    const newUser = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role,
      },
    });

    revalidatePath('/admin/users');

    return {
      success: true,
      user: newUser,
    };
  } catch (error) {
    console.error('Error creating user:', error);
    return {
      success: false,
      error: 'Failed to create user. Please try again.',
    };
  }
}

/**
 * Delete user by ID
 */
export async function deleteUser(userId: string) {
  try {
    await prisma.user.delete({
      where: { id: userId },
    });

    revalidatePath('/admin/users');

    return {
      success: true,
    };
  } catch (error) {
    console.error('Error deleting user:', error);
    return {
      success: false,
      error: 'Failed to delete user. Please try again.',
    };
  }
}

/**
 * Get all users (admin only)
 */
export async function getAllUsers() {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      success: true,
      users,
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    return {
      success: false,
      error: 'Failed to fetch users.',
      users: [],
    };
  }
}

/**
 * Get user by ID
 */
export async function getUserById(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        bio: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return {
        success: false,
        error: 'User not found.',
      };
    }

    return {
      success: true,
      user,
    };
  } catch (error) {
    console.error('Error fetching user:', error);
    return {
      success: false,
      error: 'Failed to fetch user.',
    };
  }
}