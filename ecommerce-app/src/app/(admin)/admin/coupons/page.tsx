import { getCouponsAction } from '@/actions/coupon-actions';
import CouponsClient, { CouponsListSkeleton } from '@/components/admin/CouponsClient';
import { Suspense } from 'react';

export const metadata = {
  title: 'Coupon Management | Admin Dashboard',
  description: 'Manage store-wide discount codes and promotional offers.',
};

async function CouponsData() {
  const result = await getCouponsAction();
  const coupons = ('coupons' in result ? result.coupons : []) ?? [];
  return <CouponsClient coupons={coupons} />;
}

export default function CouponsPage() {
  return (
    <div className='p-4 sm:p-8 max-w-7xl mx-auto'>
      <Suspense fallback={<CouponsListSkeleton />}>
        <CouponsData />
      </Suspense>
    </div>
  );
}
