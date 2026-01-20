'use server';

import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

export async function applyCouponAction(couponCode: string) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, message: 'Not authenticated' };
  }

  // TODO: Implement coupon logic
  console.log('Applying coupon:', couponCode);

  revalidatePath('/cart');
  return { success: true, message: 'Coupon applied' };
}

export async function removeCouponAction() {
  const session = await auth();
  if (!session?.user) {
    return { success: false, message: 'Not authenticated' };
  }

  // TODO: Implement coupon logic
  console.log('Removing coupon');

  revalidatePath('/cart');
  return { success: true, message: 'Coupon removed' };
}
