'use client';

import { useMemo } from 'react';
import { useAppSelector } from '@/lib/store/hooks';
import { DashboardCard } from './dashboard-card';
import { Package } from 'lucide-react';

/**
 * Orders count card with additional stats
 * Memoized calculations for performance
 */
export const OrdersCountCard = () => {
  const { orders } = useAppSelector((state) => state.orders);

  // Calculate order stats
  const stats = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter((o) => o.status === 'Pending').length;
    const processing = orders.filter((o) => o.status === 'Processing').length;
    
    return {
      total,
      pending,
      processing,
      description: pending > 0 
        ? `${pending} pending, ${processing} processing` 
        : `${processing} processing`,
    };
  }, [orders]);

  return (
    <DashboardCard
      title="Total Orders"
      value={stats.total}
      icon={Package}
      description={stats.description}
    />
  );
};