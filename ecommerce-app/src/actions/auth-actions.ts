'use server';

import { auth } from '@/auth';
import { Prisma, UserRole } from '@/generated/prisma/client';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';

// Helper to check admin access
async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized: Admin access required');
  }
  return session;
}

export async function signupAction(
  prevState: { success: boolean; message: string; errors?: Record<string, string[]> } | null,
  formData: FormData
) {
  try {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!name || !email || !password) {
      return { success: false, message: 'Missing required fields' };
    }

    if (password.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters' };
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return { success: false, message: 'An account with this email already exists' };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: 'USER',
      },
    });

    return { success: true, message: 'Account created successfully' };
  } catch (error) {
    console.error('Signup error:', error);
    return { success: false, message: 'An error occurred during signup' };
  }
}

export async function createUserAction(
  name: string,
  email: string,
  password: string,
  role: UserRole,
) {
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
  } catch {
    return { success: false, message: 'Failed to fetch users' };
  }
}

export async function getUserByIdAction(userId: string) {
  try {
    await requireAdmin();

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        wishlistItems: {
          select: { id: true },
        },
        orders: {
          select: { id: true },
        },
        reviews: {
          select: { id: true },
        },
        cartItems: {
          select: { id: true },
        },
      },
    });

    if (!user) {
      return {
        success: false,
        message: 'User not found',
        user: null,
      };
    }

    // Return user with activity counts
    return {
      success: true,
      user: {
        id: user.id,
        name: user.name || '',
        email: user.email || '',
        role: user.role,
        bio: user.bio,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
        // Activity counts from database
        cartCount: user.cartItems?.length || 0,
        wishlistCount: user.wishlistItems?.length || 0,
        ordersCount: user.orders?.length || 0,
        reviewsCount: user.reviews?.length || 0,
      },
    };
  } catch (error) {
    console.error('Error fetching user:', error);
    return {
      success: false,
      message: 'Failed to fetch user',
      user: null,
    };
  }
}
export async function updateUserAction(
  id: string,
  data: {
    name?: string;
    email?: string;
    role?: UserRole;
    bio?: string;
    image?: string;
    password?: string;
  },
) {
  try {
    await requireAdmin();

    // Check if email is already taken by another user
    if (data.email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email: data.email,
          id: { not: id },
        },
      });
      if (existingUser) {
        return {
          success: false,
          message: 'Email is already in use by another account.',
        };
      }
    }

    const updateData: Prisma.UserUpdateInput = {
      name: data.name,
      email: data.email,
      role: data.role,
      bio: data.bio,
      image: data.image,
    };

    if (data.password && data.password.trim() !== '') {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    revalidatePath('/admin/users');
    revalidatePath(`/admin/users/${id}`);

    return { success: true, message: 'User updated successfully.', user };
  } catch {
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
  } catch {
    return { success: false, message: 'Failed to delete user' };
  }
}

export async function updateProfileAction(data: {
  name?: string;
  email?: string;
  bio?: string;
  image?: string;
}) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error('Unauthorized: User not logged in');
    }
    const userId = session.user.id;

    // If email is being changed, check if it's already taken
    if (data.email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email: data.email,
          id: { not: userId }, // Check for other users with this email
        },
      });
      if (existingUser) {
        return {
          success: false,
          message: 'Email is already in use by another account.',
        };
      }
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data,
    });

    revalidatePath('/account');

    return { success: true, message: 'Profile updated successfully.', user };
  } catch {
    return { success: false, message: 'Failed to update profile' };
  }
}

/**
 * Get current user with all relations
 */
export async function getMeAction() {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        coupon: true,
      },
    });

    return { success: true, user };
  } catch (error) {
    console.error('getMeAction Error:', error);
    return { success: false, error: 'Failed to fetch user' };
  }
}
