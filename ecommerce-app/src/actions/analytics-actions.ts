'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/db';

export async function getAnalyticsDataAction() {
  const session = await auth();

  if (session?.user?.role !== 'ADMIN') {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    // 1. Overview Stats
    const [totalRevenue, totalOrders, totalUsers, totalProducts] = await Promise.all([
      prisma.order.aggregate({
        _sum: { total: true },
        where: { status: { not: 'Cancelled' } },
      }),
      prisma.order.count({ where: { status: { not: 'Cancelled' } } }),
      prisma.user.count(),
      prisma.product.count(),
    ]);

    // 2. Monthly Sales (Last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5); // Go back 5 months to include current month = 6 months
    sixMonthsAgo.setDate(1); // Start from beginning of that month
    
    const orders = await prisma.order.findMany({
      where: {
        createdAt: { gte: sixMonthsAgo },
        status: { not: 'Cancelled' },
      },
      select: { createdAt: true, total: true },
    });

    // Helper to format date keys
    const formatKey = (date: Date) => date.toLocaleString('default', { month: 'short', year: 'numeric' });

    // Initialize map with all 6 months to ensure no gaps
    const monthlySales = new Map<string, number>();
    for (let i = 0; i < 6; i++) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        monthlySales.set(formatKey(d), 0);
    }

    orders.forEach(order => {
        const key = formatKey(order.createdAt);
        // Note: if order is older than our initialized map (due to day/time differences), it might ideally be ignored, 
        // but our query filtered gte sixMonthsAgo.
        // We just need to check if map has it (it should).
        if (monthlySales.has(key)) {
            monthlySales.set(key, (monthlySales.get(key) || 0) + order.total);
        } else {
             // Try setting it anyway if it matches the format but wasn't in the loop for some edge case
             monthlySales.set(key, (monthlySales.get(key) || 0) + order.total);
        }
    });

    // Transform to array and reverse (oldest first)
    // The loop created keys from Newest -> Oldest. 
    // We want Oldest -> Newest.
    const chartData = Array.from(monthlySales.entries())
        .map(([name, total]) => ({ name, total }))
        .reverse();

    // 3. Category Distribution
    const productsByCategory = await prisma.product.groupBy({
        by: ['category'],
        _count: { id: true },
    });
    
    const categoryData = productsByCategory.map(c => ({
        name: c.category,
        value: c._count.id 
    })).sort((a, b) => b.value - a.value); // sort by count desc

    return { 
        success: true, 
        data: {
            revenue: totalRevenue._sum.total || 0,
            orders: totalOrders,
            users: totalUsers,
            products: totalProducts,
            chartData,
            categoryData
        } 
    };

  } catch (error) {
    console.error('Analytics error:', error);
    return { success: false, error: 'Failed to fetch analytics data' };
  }
}
