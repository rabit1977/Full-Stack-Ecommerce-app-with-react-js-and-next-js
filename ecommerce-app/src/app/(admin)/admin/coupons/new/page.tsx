import CouponForm from '@/components/admin/CouponForm';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Create Coupon | Admin Dashboard',
  description: 'Create a new discount code for the store.',
};

export default function NewCouponPage() {
  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <Button variant="ghost" asChild className="mb-4 -ml-4">
          <Link href="/admin/coupons">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Coupons
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Create New Coupon</h1>
        <p className="text-muted-foreground mt-1">
          Configure a discount code to offer savings to your customers.
        </p>
      </div>
      
      <div className="mt-8">
        <CouponForm />
      </div>
    </div>
  );
}
