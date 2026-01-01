'use server';

import { prisma } from '@/lib/db';
import { UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

// Helper to check admin access
async function requireAdmin() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== 'admin') {
    throw new Error('Unauthorized: Admin access required');
  }
  return session;
}

export async function signupAction(name: string, email: string, password: string) {
  // Validate input
  if (!email || !password || !name) {
    return { success: false, message: 'Missing fields' };
  }

  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { success: false, message: 'Email already exists' };
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  try {
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        // Default role is "customer" from schema
        role: email === 'rabit@gmail.com' ? 'admin' : 'customer', // Simple admin auto-grant for testing
      },
    });
    return { success: true };
  } catch (error) {
    console.error('Signup error:', error);
    return { success: false, message: 'Failed to create account' };
  }
}

export async function createUserAction(name: string, email: string, password: string, role: UserRole) {
  try {
    await requireAdmin();

    if (!email || !password || !name || !role) {
      return { success: false, message: 'Missing fields' };
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { success: false, message: 'Email already exists' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    revalidatePath('/admin/users');

    return { success: true, message: 'User created successfully.', user };
  } catch (error) {
    console.error('--- Error during user creation: ---', error);
    return { success: false, message: 'Failed to create user' };
  }
}

export async function getUsersAction() {
  try {
    await requireAdmin();

    const users = await prisma.user.findMany();
    return { success: true, users };
  } catch (error) {
    return { success: false, message: 'Failed to fetch users' };
  }
}

export async function updateUserAction(id: string, data: { name?: string; email?: string; role?: UserRole }) {
  try {
    await requireAdmin();

    const user = await prisma.user.update({
      where: { id },
      data,
    });

    revalidatePath('/admin/users');
    revalidatePath(`/admin/users/${id}`);

    return { success: true, message: 'User updated successfully.', user };
  } catch (error) {
    return { success: false, message: 'Failed to update user' };
  }
}

export async function deleteUserAction(id: string) {
  try {
    await requireAdmin();

    await prisma.user.delete({
      where: { id },
    });

    revalidatePath('/admin/users');

    return { success: true, message: 'User deleted successfully.' };
  } catch (error) {
    return { success: false, message: 'Failed to delete user' };
  }
}
