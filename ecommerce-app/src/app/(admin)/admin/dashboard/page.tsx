// app/admin/dashboard/page.tsx
import { prisma } from '@/lib/db';
import { Suspense } from 'react';
import DashboardClient, { DashboardSkeleton } from '@/components/admin/DashboardClient';

/**
 * Server Component - fetches all data on the server
 */
export default async function DashboardPage() {
  // Fetch all data in parallel for better performance
  const [users, products, orders] = await Promise.all([
    prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.product.findMany({
      select: {
        id: true,
        title: true,
        category: true,
        stock: true,
        createdAt: true,
      },
    }),
    prisma.order.findMany({
      select: {
        id: true,
        userId: true,
        total: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    }),
  ]);

  // Optional: fetch cart items count if you have a cart table
   const cartItemsCount = await prisma.cartItem.aggregate({
   _sum: { quantity: true }
   });

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardClient 
        users={users} 
        products={products} 
        orders={orders}
        cartItemsCount={cartItemsCount._sum.quantity || 0}
      />
    </Suspense>
  );
}