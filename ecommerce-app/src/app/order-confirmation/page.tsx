'use client';

import { getMyOrdersAction, getOrderByIdAction } from '@/actions/order-actions';
import AuthGuard from '@/components/auth/auth-guard';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatOrderDate, formatPrice } from '@/lib/utils/formatters';
import {
  ArrowRight,
  Check,
  Clock,
  Mail,
  Package,
  ShoppingBag,
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { toast } from 'sonner';

/* ===================== Skeleton ===================== */
function OrderConfirmationSkeleton() {
  return (
    <div className='container mx-auto px-4 py-20'>
      <div className='max-w-4xl mx-auto space-y-10'>
        <Skeleton className='h-28 w-28 rounded-full mx-auto' />
        <Skeleton className='h-8 w-72 mx-auto' />
        <Skeleton className='h-96 rounded-xl' />
        <Skeleton className='h-64 rounded-xl' />
      </div>
    </div>
  );
}

/* ===================== No Order ===================== */
function NoOrderFound() {
  const router = useRouter();
  return (
    <div className='container mx-auto px-4 py-24 text-center space-y-8'>
      <ShoppingBag className='mx-auto h-24 w-24 text-slate-300 dark:text-slate-600' />
      <h2 className='text-3xl font-bold dark:text-white'>No order found</h2>
      <div className='flex justify-center gap-4'>
        <Button onClick={() => router.push('/products')}>
          Continue Shopping
        </Button>
        <Button variant='outline' onClick={() => router.push('/account')}>
          View Orders
        </Button>
      </div>
    </div>
  );
}

/* ===================== Content ===================== */
function OrderConfirmationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);

      const res = orderId
        ? await getOrderByIdAction(orderId)
        : await getMyOrdersAction();

      if (res.success) {
        setOrder(orderId ? res.data : res.data[0] || null);
      } else {
        toast.error(res.error || 'Failed to fetch order details.');
      }

      setLoading(false);
    })();
  }, [orderId]);

  if (loading) return <OrderConfirmationSkeleton />;
  if (!order) return <NoOrderFound />;

  return (
    <div className='min-h-screen bg-linear-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900'>
      <div className='container mx-auto px-4 py-20 max-w-4xl space-y-12'>
        {/* Header */}
        <div className='text-center space-y-6'>
          <div className='relative inline-flex'>
            <div className='absolute inset-0 bg-emerald-400/40 blur-2xl rounded-full' />
            <div className='relative w-24 h-24 bg-linear-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-xl'>
              <Check className='h-12 w-12 text-white' strokeWidth={3} />
            </div>
          </div>

          <h1 className='text-4xl font-bold dark:text-white'>
            Order Confirmed
          </h1>
          <p className='text-slate-600 dark:text-slate-400'>
            Thanks for your purchase
          </p>

          <Badge variant='secondary' className='font-mono'>
            #{order.id.slice(0, 12)}
          </Badge>
        </div>

        {/* Buyer */}
        <Card>
          <CardHeader>
            <CardTitle>User</CardTitle>
          </CardHeader>
          <CardContent className='flex items-center gap-4'>
            <Avatar className='h-10 w-10'>
              <AvatarFallback>{order.user?.name?.[0] ?? 'U'}</AvatarFallback>
            </Avatar>
            <div>
              <p className='font-semibold dark:text-white'>
                {order.user?.name ?? 'Unknown User'}
              </p>
              <p className='text-sm text-slate-600 dark:text-slate-400'>
                {order.user?.email}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className='grid sm:grid-cols-2 lg:grid-cols-4 gap-6'>
            <Summary label='Date' value={formatOrderDate(order.createdAt)} />
            <Summary label='Items' value={`${order.items.length}`} />
            <Summary label='Total' value={formatPrice(order.total)} strong />
            <Summary label='Status' value={order.status} badge />
          </CardContent>
        </Card>

        {/* Items */}
        <Card>
          <CardHeader>
            <CardTitle>Items in your order</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            {order.items.map((item: any) => (
              <div
                key={item.id}
                className='flex items-center gap-4 rounded-lg border p-4 dark:border-slate-800'
              >
                <img
                  src={item.product?.thumbnail}
                  alt={item.product?.title}
                  className='h-16 w-16 rounded-md object-cover'
                />
                <div className='flex-1'>
                  <p className='font-semibold dark:text-white'>
                    {item.product?.title}
                  </p>
                  <p className='text-sm text-slate-600 dark:text-slate-400'>
                    Quantity: {item.quantity}
                  </p>
                </div>
                <p className='font-semibold dark:text-white'>
                  {formatPrice(item.priceAtPurchase * item.quantity)}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className='grid sm:grid-cols-2 gap-4'>
          <Button size='lg' onClick={() => router.push('/products')}>
            Continue Shopping
            <ArrowRight className='ml-2 h-4 w-4' />
          </Button>
          <Button
            size='lg'
            variant='outline'
            onClick={() => router.push(`/account/orders/${order.id}`)}
          >
            <Package className='mr-2 h-4 w-4' />
            View Order Details
          </Button>
        </div>

        {/* Help */}
        <Card className='bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-900'>
          <CardContent className='pt-6 flex gap-4'>
            <div className='h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center'>
              <Mail className='h-5 w-5 text-white' />
            </div>
            <div>
              <p className='font-semibold text-blue-900 dark:text-blue-100'>
                Need help?
              </p>
              <p className='text-sm text-blue-800 dark:text-blue-200'>
                Contact support@example.com
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* ===================== Helpers ===================== */
function Summary({
  label,
  value,
  strong,
  badge,
}: {
  label: string;
  value: string;
  strong?: boolean;
  badge?: boolean;
}) {
  return (
    <div>
      <p className='text-sm text-slate-500 dark:text-slate-400'>{label}</p>
      {badge ? (
        <Badge variant='outline' className='mt-1'>
          <Clock className='h-3 w-3 mr-1' />
          {value}
        </Badge>
      ) : (
        <p
          className={`mt-1 ${
            strong
              ? 'text-2xl font-bold dark:text-white'
              : 'font-medium dark:text-white'
          }`}
        >
          {value}
        </p>
      )}
    </div>
  );
}

/* ===================== Page ===================== */
export default function OrderConfirmationPage() {
  return (
    <AuthGuard>
      <Suspense fallback={<OrderConfirmationSkeleton />}>
        <OrderConfirmationContent />
      </Suspense>
    </AuthGuard>
  );
}
