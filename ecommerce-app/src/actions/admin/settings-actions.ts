'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function getStoreSettings() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  try {
    const settings = await prisma.storeSettings.findFirst();
    return { success: true, data: settings };
  } catch (error) {
    console.error('Error fetching store settings:', error);
    return { success: false, error: 'Failed to fetch store settings' };
  }
}

export type SettingsFormData = {
  storeName: string;
  storeEmail?: string | null;
  storePhone?: string | null;
  currency: string;
  currencySymbol: string;
  taxEnabled: boolean;
  taxRate: number;
  taxIncluded: boolean;
  guestCheckout: boolean;
  minOrderAmount?: number;
  trackInventory: boolean;
  facebook?: string | null;
  instagram?: string | null;
  twitter?: string | null;
  termsOfService?: string | null;
  privacyPolicy?: string | null;
  returnPolicy?: string | null;
};

export async function updateStoreSettings(data: SettingsFormData) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const currentSettings = await prisma.storeSettings.findFirst();

    const updateData = {
        storeName: data.storeName,
        storeEmail: data.storeEmail,
        storePhone: data.storePhone,
        currency: data.currency,
        currencySymbol: data.currencySymbol,
        taxEnabled: data.taxEnabled,
        taxRate: data.taxRate,
        taxIncluded: data.taxIncluded,
        guestCheckout: data.guestCheckout,
        minOrderAmount: data.minOrderAmount,
        trackInventory: data.trackInventory,
        facebook: data.facebook,
        instagram: data.instagram,
        twitter: data.twitter,
        termsOfService: data.termsOfService,
        privacyPolicy: data.privacyPolicy,
        returnPolicy: data.returnPolicy,
    };

    let settings;
    if (currentSettings) {
      settings = await prisma.storeSettings.update({
        where: { id: currentSettings.id },
        data: updateData,
      });
    } else {
      settings = await prisma.storeSettings.create({
        data: {
            ...updateData,
            storeName: updateData.storeName || 'My Store',
            currency: updateData.currency || 'USD',
            currencySymbol: updateData.currencySymbol || '$',
        } as any, 
      });
    }
    
    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: session.user.id!,
        action: 'SETTINGS_CHANGED',
        description: `Store settings updated by ${session.user.name}`,
        metadata: data as any,
      }
    });

    revalidatePath('/admin/settings');
    return { success: true, data: settings };
  } catch (error) {
    console.error('Error updating store settings:', error);
    return { success: false, error: 'Failed to update store settings' };
  }
}
