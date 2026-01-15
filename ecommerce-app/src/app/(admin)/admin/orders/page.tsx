import { prisma } from '@/lib/db';
import { Suspense } from 'react';
import OrdersClient, {
  OrdersListSkeleton,
} from '@/components/admin/orders-client';

/**
 * Admin orders page with Suspense boundary
 */
export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <Suspense fallback={<OrdersListSkeleton />}>
      <OrdersClient orders={orders} />
    </Suspense>
  );
}
