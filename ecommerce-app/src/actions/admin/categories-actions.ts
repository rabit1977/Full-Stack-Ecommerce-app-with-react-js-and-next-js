'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const categorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().optional(),
  image: z.string().optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  parentId: z.string().optional().nullable(),
});

export type CategoryFormData = z.infer<typeof categorySchema>;

export async function getCategories() {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  try {
    const categories = await prisma.category.findMany({
      orderBy: { position: 'asc' },
      include: {
        _count: {
          select: { children: true },
        },
        parent: {
          select: { name: true },
        },
      },
    });
    return { success: true, categories };
  } catch (error) {
    console.error('Error fetching categories:', error);
    return { success: false, error: 'Failed to fetch categories' };
  }
}

export async function createCategory(data: CategoryFormData) {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') {
    return { success: false, error: 'Unauthorized' };
  }

  const result = categorySchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: 'Invalid input' };
  }

  try {
    // Check if slug exists
    const existing = await prisma.category.findUnique({
      where: { slug: result.data.slug },
    });

    if (existing) {
      return { success: false, error: 'Slug already exists' };
    }

    const category = await prisma.category.create({
      data: result.data,
    });

    revalidatePath('/admin/categories');
    return { success: true, category };
  } catch (error) {
    console.error('Error creating category:', error);
    return { success: false, error: 'Failed to create category' };
  }
}

export async function updateCategory(id: string, data: CategoryFormData) {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') {
    return { success: false, error: 'Unauthorized' };
  }

  const result = categorySchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: 'Invalid input' };
  }

  try {
    const category = await prisma.category.update({
      where: { id },
      data: result.data,
    });

    revalidatePath('/admin/categories');
    return { success: true, category };
  } catch (error) {
    console.error('Error updating category:', error);
    return { success: false, error: 'Failed to update category' };
  }
}

export async function deleteCategory(id: string) {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    await prisma.category.delete({
      where: { id },
    });

    revalidatePath('/admin/categories');
    return { success: true };
  } catch (error) {
    console.error('Error deleting category:', error);
    return { success: false, error: 'Failed to delete category' };
  }
}
