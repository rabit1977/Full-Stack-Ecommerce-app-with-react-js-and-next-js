import { auth } from '@/auth';
import OrderDetailsClient, {
    OrderDetailsSkeleton,
} from '@/components/admin/order-details-client';
import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { Suspense } from 'react';

/**
 * Admin order details page with Suspense boundary
 */

export const metadata = {
  title: 'Order Details | Admin',
  description: 'View and manage order details in the admin dashboard.',
};
type AdminOrderDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminOrderDetailsPage({
  params,
}: AdminOrderDetailsPageProps) {
  const { id } = await params;

  if (!id) {
    return null;
  }

  async function updateOrderStatusAction(
    status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'
  ) {
    'use server';
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized: Admin access required' };
    }

    try {
      const order = await prisma.order.update({
        where: { id },
        data: { status },
      });

      revalidatePath('/admin/orders');
      revalidatePath(`/admin/orders/${id}`);

      return {
        success: true,
        data: order,
        message: `Order status updated to ${status}`,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to update order status',
      };
    }
  }

  async function deleteOrderAction() {
    'use server';
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized: Admin access required' };
    }

    try {
      await prisma.$transaction(async (tx) => {
        await tx.orderItem.deleteMany({
          where: { orderId: id },
        });
        await tx.order.delete({
          where: { id },
        });
      });

      revalidatePath('/admin/orders');
      return { success: true, message: 'Order deleted successfully' };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete order',
      };
    }
  }

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: true,
      items: true,
    },
  });

  return (
    <Suspense fallback={<OrderDetailsSkeleton />}>
      <OrderDetailsClient
        order={order}
        updateOrderStatusAction={updateOrderStatusAction}
        deleteOrderAction={deleteOrderAction}
      />
    </Suspense>
  );
}
