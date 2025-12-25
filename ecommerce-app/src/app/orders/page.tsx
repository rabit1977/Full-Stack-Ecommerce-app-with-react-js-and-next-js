'use client';

import AuthGuard from '@/components/auth/auth-guard';
import { Button } from '@/components/ui/button';
import { useAppSelector } from '@/lib/store/hooks';
import { Order } from '@/lib/types';
import { formatOrderDate, formatPrice } from '@/lib/utils/formatters';
import { ArrowLeft, Filter, Package } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

const OrdersPage = () => {
  const router = useRouter();
  const { orders } = useAppSelector((state) => state.orders);

  // Sort orders by date (most recent first)
  const sortedOrders = useMemo(() => {
    return [...orders].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [orders]);

  const handleViewOrder = (orderId: string) => {
    router.push(`/account/orders/${orderId}`);
  };

  return (
    <AuthGuard>
      <div className="bg-slate-50 min-h-[70vh] dark:bg-slate-900">
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <Button 
                variant="ghost" 
                onClick={() => router.push('/account')}
                className="mb-4 -ml-2 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Account
              </Button>
              <h1 className="text-3xl font-bold tracking-tight dark:text-white">
                My Orders
              </h1>
              {sortedOrders.length > 0 && (
                <p className="text-slate-600 dark:text-slate-300 mt-2">
                  {sortedOrders.length} order{sortedOrders.length !== 1 ? 's' : ''} total
                </p>
              )}
            </div>
            {sortedOrders.length > 0 && (
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            )}
          </div>

          {/* Orders List */}
          {sortedOrders.length === 0 ? (
            // Empty State
            <div className="bg-white rounded-lg p-16 text-center dark:bg-slate-800 shadow-sm">
              <Package className="mx-auto h-20 w-20 text-slate-300 dark:text-slate-600" />
              <h3 className="mt-6 text-xl font-semibold text-slate-900 dark:text-white">
                No orders yet
              </h3>
              <p className="mt-2 text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                When you place orders, they&apos;ll appear here. Start shopping to see your order history.
              </p>
              <Button 
                onClick={() => router.push('/products')} 
                className="mt-8"
                size="lg"
              >
                Start Shopping
              </Button>
            </div>
          ) : (
            // Orders Table
            <div className="bg-white rounded-lg overflow-hidden shadow-sm dark:bg-slate-800 border dark:border-slate-700">
              {/* Table Header */}
              <div className="border-b dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                <div className="grid grid-cols-12 px-6 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  <div className="col-span-3">Order ID</div>
                  <div className="col-span-3">Date</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-2">Items</div>
                  <div className="col-span-2 text-right">Total</div>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y dark:divide-slate-700">
                {sortedOrders.map((order: Order) => (
                  <button
                    key={order.id}
                    onClick={() => handleViewOrder(order.id)}
                    className="w-full grid grid-cols-12 px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                  >
                    {/* Order ID */}
                    <div className="col-span-3 font-mono text-sm text-slate-900 dark:text-white truncate pr-2">
                      #{order.id.slice(0, 12)}...
                    </div>
                    
                    {/* Date */}
                    <div className="col-span-3 text-sm text-slate-600 dark:text-slate-300">
                      {formatOrderDate(order.date)}
                    </div>
                    
                    {/* Status Badge */}
                    <div className="col-span-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          order.status === 'Delivered'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : order.status === 'Shipped'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            : order.status === 'Cancelled'
                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    
                    {/* Items Count */}
                    <div className="col-span-2 text-sm text-slate-600 dark:text-slate-300">
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </div>
                    
                    {/* Total */}
                    <div className="col-span-2 text-right text-sm font-semibold text-slate-900 dark:text-white">
                      {formatPrice(order.total)}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
};

export default OrdersPage;