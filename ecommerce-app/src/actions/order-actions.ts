'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';

// Helper to check admin access
async function requireAdmin() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    throw new Error('Unauthorized: Admin access required');
  }
  return session;
}

/**
 * Get all orders (admin only)
 */
export async function getOrdersAction() {
  try {
    await requireAdmin();

    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                thumbnail: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      success: true,
      data: orders,
    };
  } catch (error) {
    console.error('Error fetching orders:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch orders',
    };
  }
}

/**
 * Get order by ID
 */
export async function getOrderByIdAction(id: string) {
  try {
    const session = await auth();

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                thumbnail: true,
                price: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return {
        success: false,
        error: 'Order not found',
      };
    }

    // Check if user is admin or order owner
    const isAdmin = (session?.user as any)?.role === 'ADMIN';
    const isOwner = session?.user && (session.user as any).id === order.userId;

    if (!isAdmin && !isOwner) {
      return {
        success: false,
        error: 'Unauthorized',
      };
    }

    return {
      success: true,
      data: order,
    };
  } catch (error) {
    console.error('Error fetching order:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch order',
    };
  }
}

/**
 * Update order status (admin only)
 */
export async function updateOrderStatusAction(
  id: string,
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'
) {
  try {
    await requireAdmin();

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
    console.error('Error updating order status:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to update order status',
    };
  }
}

/**
 * Delete order (admin only)
 */
export async function deleteOrderAction(id: string) {
  try {
    await requireAdmin();

    await prisma.$transaction(async (tx) => {
      await tx.orderItem.deleteMany({
        where: { orderId: id },
      });
      await tx.order.delete({
        where: { id },
      });
    });

    revalidatePath('/admin/orders');

    return {
      success: true,
      message: 'Order deleted successfully',
    };
  } catch (error) {
    console.error('Error deleting order:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete order',
    };
  }
}

/**
 * Get order statistics (admin only)
 */
export async function getOrderStatsAction() {
  try {
    await requireAdmin();

    const [totalOrders, ordersByStatus, revenueData] = await Promise.all([
      prisma.order.count(),
      prisma.order.groupBy({
        by: ['status'],
        _count: true,
      }),
      prisma.order.aggregate({
        _sum: {
          total: true,
        },
        where: {
          status: {
            not: 'Cancelled',
          },
        },
      }),
    ]);

    const stats = {
      total: totalOrders,
      pending: ordersByStatus.find((s) => s.status === 'Pending')?._count || 0,
      processing:
        ordersByStatus.find((s) => s.status === 'Processing')?._count || 0,
      shipped: ordersByStatus.find((s) => s.status === 'Shipped')?._count || 0,
      delivered:
        ordersByStatus.find((s) => s.status === 'Delivered')?._count || 0,
      cancelled:
        ordersByStatus.find((s) => s.status === 'Cancelled')?._count || 0,
      revenue: revenueData._sum.total || 0,
    };

    return {
      success: true,
      data: stats,
    };
  } catch (error) {
    console.error('Error fetching order stats:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to fetch order statistics',
    };
  }
}

/**
 * Get all orders for the current user
 */
export async function getMyOrdersAction() {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }
  const userId = session.user.id;

  try {
    const orders = await prisma.order.findMany({
      where: {
        userId: userId,
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                thumbnail: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      success: true,
      data: orders,
    };
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch orders',
    };
  }
}

export async function createOrderAction(details: {
  // Client only needs to send minimal info
  items: { id: string; quantity: number }[];
  shippingAddress: any;
  paymentMethod: string;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }
  const userId = session.user.id;

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Get product details from DB to ensure data integrity
      const productIds = details.items.map((item) => item.id);
      const productsFromDb = await tx.product.findMany({
        where: { id: { in: productIds } },
      });

      // Map DB products for quick lookup
      const productMap = new Map(productsFromDb.map((p) => [p.id, p]));

      // 2. Validate cart items and calculate costs on the server
      let subtotal = 0;
      const orderItemsData = [];

      for (const item of details.items) {
        const product = productMap.get(item.id);

        // Check if product exists and has enough stock
        if (!product) {
          throw new Error(`Product with ID ${item.id} not found.`);
        }
        if (product.stock < item.quantity) {
          throw new Error(`Not enough stock for ${product.title}.`);
        }

        const price = product.price; // Use DB price
        subtotal += price * item.quantity;

        orderItemsData.push({
          productId: item.id,
          quantity: item.quantity,
          price: price,
          priceAtPurchase: price,
          title: product.title,
          thumbnail: product.thumbnail,
        });
      }

      const shippingCost = 5.0; // Example: flat rate
      const taxRate = 0.1; // Example: 10%
      const tax = subtotal * taxRate;
      const discount = 0.0; // Example
      const grandTotal = subtotal + tax + shippingCost - discount;

      // 3. Create the order
      const order = await tx.order.create({
        data: {
          userId,
          subtotal,
          tax,
          shippingCost,
          discount,
          grandTotal,
          total: grandTotal, // Assuming 'total' is a legacy field for grandTotal
          status: 'Pending',
          shippingAddress: JSON.stringify(details.shippingAddress),
          billingAddress: JSON.stringify(details.shippingAddress),
          shippingMethod: 'standard',
          paymentMethod: details.paymentMethod,
          items: {
            create: orderItemsData,
          },
        },
      });

      // 4. Decrement stock for each product
      for (const item of details.items) {
        await tx.product.update({
          where: { id: item.id },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      // 5. Clear the user's cart
      await tx.cartItem.deleteMany({
        where: { userId: userId },
      });

      return order;
    });

    revalidatePath('/account/orders');
    revalidatePath('/cart');

    return { success: true, orderId: result.id };
  } catch (error) {
    console.error('Failed to create order:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle specific Prisma errors, e.g., foreign key violations
      if (error.code === 'P2025') {
        return {
          success: false,
          error:
            'An item in your cart is no longer available. Please review your cart.',
        };
      }
    } else if (error instanceof Error) {
      // Handle custom errors thrown in the transaction
      return { success: false, error: error.message };
    }
    return {
      success: false,
      error: 'Failed to create order. Please try again later.',
    };
  }
}
