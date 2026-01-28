'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// --- ZONES ---

const zoneSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  countries: z.string().optional(), // Comma separated for simplicity in UI
  isActive: z.boolean().default(true),
});

export type ZoneFormData = z.infer<typeof zoneSchema>;

export async function getShippingZones() {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  try {
    const zones = await prisma.shippingZone.findMany({
      orderBy: { name: 'asc' },
      include: {
         _count: { select: { rates: true } }
      }
    });
    return { success: true, zones };
  } catch (error) {
    console.error('Error fetching shipping zones:', error);
    return { success: false, error: 'Failed to fetch zones' };
  }
}

export async function createShippingZone(data: ZoneFormData) {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') {
    return { success: false, error: 'Unauthorized' };
  }

  const result = zoneSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: 'Invalid input' };
  }

  try {
    const countriesArray = result.data.countries 
      ? result.data.countries.split(',').map(c => c.trim()).filter(Boolean)
      : [];

    const zone = await prisma.shippingZone.create({
      data: {
        name: result.data.name,
        isActive: result.data.isActive,
        countries: countriesArray,
      },
    });

    revalidatePath('/admin/shipping');
    return { success: true, zone };
  } catch (error) {
    console.error('Error creating shipping zone:', error);
    return { success: false, error: 'Failed to create zone' };
  }
}

export async function deleteShippingZone(id: string) {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    await prisma.shippingZone.delete({
      where: { id },
    });
    revalidatePath('/admin/shipping');
    return { success: true };
  } catch (error) {
    console.error('Error deleting zone:', error);
    return { success: false, error: 'Failed to delete zone' };
  }
}


// --- RATES ---

const rateSchema = z.object({
  zoneId: z.string().min(1, 'Zone is required'),
  name: z.string().min(1, 'Name is required'), // e.g., Standard
  type: z.enum(['flat', 'weight_based', 'price_based', 'free']),
  price: z.coerce.number().min(0).optional(),
  minOrderAmount: z.coerce.number().min(0).optional(),
  minDays: z.coerce.number().int().min(0).optional(),
  maxDays: z.coerce.number().int().min(0).optional(),
  isActive: z.boolean().default(true),
});

export type RateFormData = z.infer<typeof rateSchema>;

export async function getShippingRates() {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  try {
    const rates = await prisma.shippingRate.findMany({
      orderBy: { name: 'asc' },
      include: {
        zone: { select: { name: true } },
      },
    });
    return { success: true, rates };
  } catch (error) {
    console.error('Error fetching shipping rates:', error);
    return { success: false, error: 'Failed to fetch rates' };
  }
}

export async function createShippingRate(data: RateFormData) {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') {
    return { success: false, error: 'Unauthorized' };
  }

  const result = rateSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: 'Invalid input' };
  }

  try {
    const rate = await prisma.shippingRate.create({
      data: result.data,
    });
    revalidatePath('/admin/shipping');
    return { success: true, rate };
  } catch (error) {
    console.error('Error creating rate:', error);
    return { success: false, error: 'Failed to create rate' };
  }
}

export async function deleteShippingRate(id: string) {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    await prisma.shippingRate.delete({
      where: { id },
    });
    revalidatePath('/admin/shipping');
    return { success: true };
  } catch (error) {
    console.error('Error deleting rate:', error);
    return { success: false, error: 'Failed to delete rate' };
  }
}
