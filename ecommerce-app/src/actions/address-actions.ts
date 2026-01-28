'use server';

import { auth } from '@/auth';
import { AddressType } from '@/generated/prisma/client';
import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

// Types
export type AddressInput = {
  type: AddressType;
  label?: string;
  firstName: string;
  lastName: string;
  company?: string;
  street1: string;
  street2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  deliveryInstructions?: string;
  isDefault?: boolean;
};

/**
 * Helper to get authenticated user
 */
async function requireAuth() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized: Please sign in');
  }
  return session;
}

/**
 * Get all addresses for current user
 */
export async function getUserAddressesAction() {
  try {
    const session = await requireAuth();

    const addresses = await prisma.address.findMany({
      where: { userId: session.user.id },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    return {
      success: true,
      data: addresses,
    };
  } catch (error) {
    console.error('getUserAddressesAction Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch addresses',
      data: [],
    };
  }
}

/**
 * Get single address by ID
 */
export async function getAddressByIdAction(addressId: string) {
  try {
    const session = await requireAuth();

    const address = await prisma.address.findFirst({
      where: {
        id: addressId,
        userId: session.user.id,
      },
    });

    if (!address) {
      return {
        success: false,
        error: 'Address not found',
        data: null,
      };
    }

    return {
      success: true,
      data: address,
    };
  } catch (error) {
    console.error('getAddressByIdAction Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch address',
      data: null,
    };
  }
}

/**
 * Create new address
 */
export async function createAddressAction(data: AddressInput) {
  try {
    const session = await requireAuth();

    // If this is set as default, unset other defaults of same type
    if (data.isDefault) {
      await prisma.address.updateMany({
        where: {
          userId: session.user.id,
          isDefault: true,
          type: { in: data.type === 'BOTH' ? ['SHIPPING', 'BILLING', 'BOTH'] : [data.type, 'BOTH'] },
        },
        data: { isDefault: false },
      });
    }

    // Check if this is the first address - make it default
    const addressCount = await prisma.address.count({
      where: { userId: session.user.id },
    });
    const shouldBeDefault = addressCount === 0 || data.isDefault;

    const address = await prisma.address.create({
      data: {
        userId: session.user.id,
        type: data.type,
        label: data.label,
        firstName: data.firstName,
        lastName: data.lastName,
        company: data.company,
        street1: data.street1,
        street2: data.street2,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode,
        country: data.country,
        phone: data.phone,
        deliveryInstructions: data.deliveryInstructions,
        isDefault: shouldBeDefault,
      },
    });

    revalidatePath('/account/addresses');
    revalidatePath('/checkout');

    return {
      success: true,
      message: 'Address added successfully',
      data: address,
    };
  } catch (error) {
    console.error('createAddressAction Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create address',
    };
  }
}

/**
 * Update existing address
 */
export async function updateAddressAction(addressId: string, data: Partial<AddressInput>) {
  try {
    const session = await requireAuth();

    // Verify ownership
    const existingAddress = await prisma.address.findFirst({
      where: {
        id: addressId,
        userId: session.user.id,
      },
    });

    if (!existingAddress) {
      return {
        success: false,
        error: 'Address not found',
      };
    }

    // If setting as default, unset other defaults
    if (data.isDefault) {
      const type = data.type || existingAddress.type;
      await prisma.address.updateMany({
        where: {
          userId: session.user.id,
          id: { not: addressId },
          isDefault: true,
          type: { in: type === 'BOTH' ? ['SHIPPING', 'BILLING', 'BOTH'] : [type, 'BOTH'] },
        },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.update({
      where: { id: addressId },
      data: {
        ...(data.type && { type: data.type }),
        ...(data.label !== undefined && { label: data.label }),
        ...(data.firstName && { firstName: data.firstName }),
        ...(data.lastName && { lastName: data.lastName }),
        ...(data.company !== undefined && { company: data.company }),
        ...(data.street1 && { street1: data.street1 }),
        ...(data.street2 !== undefined && { street2: data.street2 }),
        ...(data.city && { city: data.city }),
        ...(data.state && { state: data.state }),
        ...(data.postalCode && { postalCode: data.postalCode }),
        ...(data.country && { country: data.country }),
        ...(data.phone !== undefined && { phone: data.phone }),
        ...(data.deliveryInstructions !== undefined && { deliveryInstructions: data.deliveryInstructions }),
        ...(data.isDefault !== undefined && { isDefault: data.isDefault }),
      },
    });

    revalidatePath('/account/addresses');
    revalidatePath('/checkout');

    return {
      success: true,
      message: 'Address updated successfully',
      data: address,
    };
  } catch (error) {
    console.error('updateAddressAction Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update address',
    };
  }
}

/**
 * Delete address
 */
export async function deleteAddressAction(addressId: string) {
  try {
    const session = await requireAuth();

    // Verify ownership
    const address = await prisma.address.findFirst({
      where: {
        id: addressId,
        userId: session.user.id,
      },
    });

    if (!address) {
      return {
        success: false,
        error: 'Address not found',
      };
    }

    await prisma.address.delete({
      where: { id: addressId },
    });

    // If deleted address was default, make the most recent one default
    if (address.isDefault) {
      const nextDefault = await prisma.address.findFirst({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' },
      });

      if (nextDefault) {
        await prisma.address.update({
          where: { id: nextDefault.id },
          data: { isDefault: true },
        });
      }
    }

    revalidatePath('/account/addresses');
    revalidatePath('/checkout');

    return {
      success: true,
      message: 'Address deleted successfully',
    };
  } catch (error) {
    console.error('deleteAddressAction Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete address',
    };
  }
}

/**
 * Set address as default
 */
export async function setDefaultAddressAction(addressId: string) {
  try {
    const session = await requireAuth();

    // Verify ownership
    const address = await prisma.address.findFirst({
      where: {
        id: addressId,
        userId: session.user.id,
      },
    });

    if (!address) {
      return {
        success: false,
        error: 'Address not found',
      };
    }

    // Unset other defaults of same type
    await prisma.address.updateMany({
      where: {
        userId: session.user.id,
        id: { not: addressId },
        isDefault: true,
        type: { in: address.type === 'BOTH' ? ['SHIPPING', 'BILLING', 'BOTH'] : [address.type, 'BOTH'] },
      },
      data: { isDefault: false },
    });

    // Set this one as default
    await prisma.address.update({
      where: { id: addressId },
      data: { isDefault: true },
    });

    revalidatePath('/account/addresses');
    revalidatePath('/checkout');

    return {
      success: true,
      message: 'Default address updated',
    };
  } catch (error) {
    console.error('setDefaultAddressAction Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to set default address',
    };
  }
}

/**
 * Get default shipping address
 */
export async function getDefaultShippingAddressAction() {
  try {
    const session = await requireAuth();

    const address = await prisma.address.findFirst({
      where: {
        userId: session.user.id,
        isDefault: true,
        type: { in: ['SHIPPING', 'BOTH'] },
      },
    });

    return {
      success: true,
      data: address,
    };
  } catch (error) {
    console.error('getDefaultShippingAddressAction Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch default address',
      data: null,
    };
  }
}
