'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const brandSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().optional(),
  logo: z.string().optional(),
  website: z.string().optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
});

export type BrandFormData = z.infer<typeof brandSchema>;

export async function getBrands() {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  try {
    const brands = await prisma.brand.findMany({
      orderBy: { name: 'asc' },
    });
    return { success: true, brands };
  } catch (error) {
    console.error('Error fetching brands:', error);
    return { success: false, error: 'Failed to fetch brands' };
  }
}

export async function createBrand(data: BrandFormData) {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') {
    return { success: false, error: 'Unauthorized' };
  }

  const result = brandSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: 'Invalid input' };
  }

  try {
    const existing = await prisma.brand.findUnique({
      where: { slug: result.data.slug },
    });

    if (existing) {
      return { success: false, error: 'Slug already exists' };
    }

    const brand = await prisma.brand.create({
      data: result.data,
    });

    revalidatePath('/admin/brands');
    return { success: true, brand };
  } catch (error) {
    console.error('Error creating brand:', error);
    return { success: false, error: 'Failed to create brand' };
  }
}

export async function updateBrand(id: string, data: BrandFormData) {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') {
    return { success: false, error: 'Unauthorized' };
  }

  const result = brandSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: 'Invalid input' };
  }

  try {
    const brand = await prisma.brand.update({
      where: { id },
      data: result.data,
    });

    revalidatePath('/admin/brands');
    return { success: true, brand };
  } catch (error) {
    console.error('Error updating brand:', error);
    return { success: false, error: 'Failed to update brand' };
  }
}

export async function deleteBrand(id: string) {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    await prisma.brand.delete({
      where: { id },
    });

    revalidatePath('/admin/brands');
    return { success: true };
  } catch (error) {
    console.error('Error deleting brand:', error);
    return { success: false, error: 'Failed to delete brand' };
  }
}
