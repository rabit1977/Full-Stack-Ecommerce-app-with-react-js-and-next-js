'use client';

import AuthGuard from '@/components/auth/auth-guard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useAppSelector } from '@/lib/store/hooks';
import { formatOrderDate, formatPrice } from '@/lib/utils/formatters';
import {
    ArrowRight,
    Check,
    Clock,
    Mail,
    Package,
    ShoppingBag,
    Truck,
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useMemo } from 'react';

/**
 * Order confirmation skeleton
 */
function OrderConfirmationSkeleton() {
  return (
    <div className='container mx-auto px-4 py-16'>
      <div className='max-w-2xl mx-auto space-y-8'>
        <div className='text-center space-y-4'>
          <Skeleton className='h-24 w-24 rounded-full mx-auto' />
          <Skeleton className='h-8 w-64 mx-auto' />
          <Skeleton className='h-4 w-48 mx-auto' />
        </div>
        <Skeleton className='h-64' />
      </div>
    </div>
  );
}

/**
 * No order found state
 */
function NoOrderFound() {
  const router = useRouter();

  return (
    <div className='container mx-auto px-4 py-16'>
      <div className='flex flex-col items-center justify-center min-h-[50vh] text-center space-y-6'>
        <ShoppingBag className='h-24 w-24 text-slate-300 dark:text-slate-600' />
        <div className='space-y-2'>
          <h2 className='text-3xl font-bold dark:text-white'>No order found</h2>
          <p className='text-slate-600 dark:text-slate-400 max-w-md'>
            We couldn&apos;t find your order. Please check your email for order
            confirmation.
          </p>
        </div>
        <div className='flex flex-col sm:flex-row gap-4'>
          <Button size='lg' onClick={() => router.push('/products')}>
            Continue Shopping
          </Button>
          <Button
            variant='outline'
            size='lg'
            onClick={() => router.push('/account')}
          >
            View Orders
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * Order confirmation content
 */
function OrderConfirmationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  const { orders } = useAppSelector((state) => state.orders);

  // Find order by ID from URL params, or fallback to latest order
  const order = useMemo(() => {
    if (orderId) {
      return orders.find((o) => o.id === orderId);
    }
    return orders[0]; // Latest order
  }, [orders, orderId]);

  if (!order) {
    return <NoOrderFound />;
  }

  const nextSteps = [
    {
      icon: Mail,
      title: 'Email Confirmation',
      description: 'Check your inbox for order details and receipt',
    },
    {
      icon: Package,
      title: 'Processing',
      description: 'Your order is being prepared for shipment',
    },
    {
      icon: Truck,
      title: 'Shipping',
      description: "You'll receive tracking info within 1-2 business days",
    },
  ];

  return (
    <div className='bg-slate-50 min-h-[70vh] dark:bg-slate-900'>
      <div className='container mx-auto px-4 py-16'>
        <div className='max-w-3xl mx-auto space-y-8'>
          {/* Success Header */}
          <div className='text-center space-y-4'>
            <div className='relative inline-block'>
              <div className='absolute inset-0 bg-green-100 dark:bg-green-900 rounded-full blur-2xl opacity-50' />
              <div className='relative bg-gradient-to-br from-green-400 to-green-600 w-24 h-24 rounded-full flex items-center justify-center mx-auto shadow-lg'>
                <Check className='h-12 w-12 text-white' strokeWidth={3} />
              </div>
            </div>
            <div className='space-y-2'>
              <h1 className='text-3xl md:text-4xl font-bold dark:text-white'>
                Order Confirmed!
              </h1>
              <p className='text-lg text-slate-600 dark:text-slate-400'>
                Thank you for your purchase
              </p>
            </div>
            <div className='flex items-center justify-center gap-2 text-sm'>
              <span className='text-slate-600 dark:text-slate-400'>Order</span>
              <Badge variant='secondary' className='font-mono'>
                #{order.id.slice(0, 12)}
              </Badge>
            </div>
          </div>

          {/* Order Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid sm:grid-cols-2 gap-4'>
                <div>
                  <p className='text-sm text-slate-600 dark:text-slate-400'>
                    Order Number
                  </p>
                  <p className='font-mono font-medium dark:text-white mt-1'>
                    #{order.id.slice(0, 12)}...
                  </p>
                </div>
                <div>
                  <p className='text-sm text-slate-600 dark:text-slate-400'>
                    Order Date
                  </p>
                  <p className='font-medium dark:text-white mt-1'>
                    {formatOrderDate(order.date)}
                  </p>
                </div>
                <div>
                  <p className='text-sm text-slate-600 dark:text-slate-400'>
                    Total Amount
                  </p>
                  <p className='text-2xl font-bold dark:text-white mt-1'>
                    {formatPrice(order.total)}
                  </p>
                </div>
                <div>
                  <p className='text-sm text-slate-600 dark:text-slate-400'>
                    Items
                  </p>
                  <p className='font-medium dark:text-white mt-1'>
                    {order.items.length}{' '}
                    {order.items.length === 1 ? 'item' : 'items'}
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <p className='text-sm text-slate-600 dark:text-slate-400 mb-3'>
                  Status
                </p>
                <div className='flex items-center gap-2'>
                  <Badge
                    variant='outline'
                    className='bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-400 dark:border-yellow-900'
                  >
                    <Clock className='h-3 w-3 mr-1' />
                    {order.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* What's Next */}
          <Card>
            <CardHeader>
              <CardTitle>What happens next?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {nextSteps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div key={index} className='flex gap-4'>
                      <div className='flex-shrink-0'>
                        <div className='w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center'>
                          <Icon className='h-5 w-5 text-blue-600 dark:text-blue-400' />
                        </div>
                      </div>
                      <div className='flex-1 pt-1'>
                        <h3 className='font-semibold dark:text-white mb-1'>
                          {step.title}
                        </h3>
                        <p className='text-sm text-slate-600 dark:text-slate-400'>
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className='flex flex-col sm:flex-row gap-4'>
            <Button
              size='lg'
              className='flex-1'
              onClick={() => router.push('/products')}
            >
              Continue Shopping
              <ArrowRight className='h-4 w-4 ml-2' />
            </Button>
            <Button
              variant='outline'
              size='lg'
              className='flex-1'
              onClick={() => router.push(`/account/orders/${order.id}`)}
            >
              <Package className='h-4 w-4 mr-2' />
              View Order Details
            </Button>
          </div>

          {/* Help Section */}
          <Card className='bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-900'>
            <CardContent className='pt-6'>
              <div className='flex items-start gap-4'>
                <div className='flex-shrink-0'>
                  <div className='w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center'>
                    <Mail className='h-5 w-5 text-white' />
                  </div>
                </div>
                <div>
                  <h3 className='font-semibold text-blue-900 dark:text-blue-100 mb-1'>
                    Need Help?
                  </h3>
                  <p className='text-sm text-blue-800 dark:text-blue-200'>
                    If you have any questions about your order, feel free to
                    contact our support team at support@example.com
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

/**
 * Order confirmation page with auth and suspense
 */
export default function OrderConfirmationPage() {
  return (
    <AuthGuard>
      <Suspense fallback={<OrderConfirmationSkeleton />}>
        <OrderConfirmationContent />
      </Suspense>
    </AuthGuard>
  );
}
