import { AdminOrderFilters } from '@/components/admin/admin-order-filters';
import OrdersClient, {
    OrdersListSkeleton,
} from '@/components/admin/orders-client';
import { Prisma } from '@/generated/prisma/client';
import { prisma } from '@/lib/db';
import { Suspense } from 'react';

interface AdminOrdersPageProps {
  searchParams: Promise<{
    status?: string;
    date?: string;
    q?: string;
  }>;
}

/**
 * Admin orders page with Suspense boundary and filtering
 */
export default async function AdminOrdersPage(props: AdminOrdersPageProps) {
  const searchParams = await props.searchParams;
  const { status, date, q } = searchParams;

  const where: Prisma.OrderWhereInput = {};

  if (status && status !== 'all') {
    where.status = status as any;
  }

  if (q) {
    where.OR = [
      { id: { contains: q, mode: 'insensitive' } },
      { orderNumber: { contains: q, mode: 'insensitive' } },
      { user: { name: { contains: q, mode: 'insensitive' } } },
      { user: { email: { contains: q, mode: 'insensitive' } } },
      { shippingAddress: { contains: q, mode: 'insensitive' } },
    ];
  }

  if (date && date !== 'all') {
    const now = new Date();
    if (date === 'today') {
      const startOfDay = new Date(now.setHours(0, 0, 0, 0));
      where.createdAt = { gte: startOfDay };
    } else if (date === '7days') {
      const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7));
      where.createdAt = { gte: sevenDaysAgo };
    } else if (date === '30days') {
      const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
      where.createdAt = { gte: thirtyDaysAgo };
    } else if (date === '3months') {
      const threeMonthsAgo = new Date(now.setMonth(now.getMonth() - 3));
      where.createdAt = { gte: threeMonthsAgo };
    }
  }

  const orders = await prisma.order.findMany({
    where,
    include: {
        user: {
            select: {
                name: true,
                email: true,
                image: true
            }
        }
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="space-y-6 sm:space-y-8 pb-20">
      <AdminOrderFilters />
      
      <Suspense fallback={<OrdersListSkeleton />}>
        <OrdersClient orders={orders as any} />
      </Suspense>
    </div>
  );
}
