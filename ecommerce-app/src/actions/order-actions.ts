'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'

// Helper to check admin access
async function requireAdmin() {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== 'admin') {
    throw new Error('Unauthorized: Admin access required')
  }
  return session
}

/**
 * Get all orders (admin only)
 */
export async function getOrdersAction() {
  try {
    await requireAdmin()

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
    })

    return {
      success: true,
      data: orders,
    }
  } catch (error) {
    console.error('Error fetching orders:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch orders',
    }
  }
}

/**
 * Get order by ID
 */
export async function getOrderByIdAction(id: string) {
  try {
    const session = await auth()
    
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
    })

    if (!order) {
      return {
        success: false,
        error: 'Order not found',
      }
    }

    // Check if user is admin or order owner
    const isAdmin = (session?.user as any)?.role === 'admin'
    const isOwner = session?.user && (session.user as any).id === order.userId

    if (!isAdmin && !isOwner) {
      return {
        success: false,
        error: 'Unauthorized',
      }
    }

    return {
      success: true,
      data: order,
    }
  } catch (error) {
    console.error('Error fetching order:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch order',
    }
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
    await requireAdmin()

    const order = await prisma.order.update({
      where: { id },
      data: { status },
    })

    revalidatePath('/admin/orders')
    revalidatePath(`/admin/orders/${id}`)

    return {
      success: true,
      data: order,
      message: `Order status updated to ${status}`,
    }
  } catch (error) {
    console.error('Error updating order status:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update order status',
    }
  }
}

/**
 * Delete order (admin only)
 */
export async function deleteOrderAction(id: string) {
  try {
    await requireAdmin()

    await prisma.$transaction(async (tx) => {
      await tx.orderItem.deleteMany({
        where: { orderId: id },
      });
      await tx.order.delete({
        where: { id },
      });
    });

    revalidatePath('/admin/orders')

    return {
      success: true,
      message: 'Order deleted successfully',
    }
  } catch (error) {
    console.error('Error deleting order:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete order',
    }
  }
}

/**
 * Get order statistics (admin only)
 */
export async function getOrderStatsAction() {
  try {
    await requireAdmin()

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
    ])

    const stats = {
      total: totalOrders,
      pending: ordersByStatus.find(s => s.status === 'Pending')?._count || 0,
      processing: ordersByStatus.find(s => s.status === 'Processing')?._count || 0,
      shipped: ordersByStatus.find(s => s.status === 'Shipped')?._count || 0,
      delivered: ordersByStatus.find(s => s.status === 'Delivered')?._count || 0,
      cancelled: ordersByStatus.find(s => s.status === 'Cancelled')?._count || 0,
      revenue: revenueData._sum.total || 0,
    }

    return {
      success: true,
      data: stats,
    }
  } catch (error) {
    console.error('Error fetching order stats:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch order statistics',
    }
  }
}

/**
 * Get all orders for the current user
 */
export async function getMyOrdersAction() {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' }
  }
  const userId = session.user.id

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
    })

    return {
      success: true,
      data: orders,
    }
  } catch (error) {
    console.error('Error fetching user orders:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch orders',
    }
  }
}

/**
 * Create a new order
 */
export async function createOrderAction(details: {
  items: { id: string; quantity: number; price: number }[]
  total: number
  shippingAddress: any
  paymentMethod: string
}) {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' }
  }
  const userId = session.user.id

  try {
    const result = await prisma.$transaction(async tx => {
      const order = await tx.order.create({
        data: {
          userId,
          total: details.total,
          status: 'Pending',
          shippingAddress: JSON.stringify(details.shippingAddress),
          paymentMethod: details.paymentMethod,
          items: {
            create: details.items.map(item => ({
              productId: item.id,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
      })

      for (const item of details.items) {
        await tx.product.update({
          where: { id: item.id },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        })
      }

      return order
    })

    revalidatePath('/account/orders')

    return { success: true, orderId: result.id }
  } catch (error) {
    console.error('Failed to create order:', error)
    return { success: false, error: 'Failed to create order.' }
  }
}
