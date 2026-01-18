import { getOrderByIdAction } from '@/actions/order-actions';
import { Button } from '@/components/ui/button';
import { formatOrderDate, formatPrice } from '@/lib/utils/formatters';
import { CheckCircle, ChevronLeft, Package, Truck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// 1. Update the interface to use Promise
interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

const OrderDetailPage = async ({ params }: OrderDetailPageProps) => {
  // 2. Await the params before accessing properties
  const { id } = await params;

  if (!id) {
    throw new Error('Order ID is not defined in the URL.');
  }

  const orderResult = await getOrderByIdAction(id);
  const order = orderResult.data;

  if (!order) {
    notFound();
  }

  const statusSteps = [
    {
      name: 'Order Placed',
      icon: Package,
      status: ['Pending', 'Processing', 'Shipped', 'Delivered'].includes(
        order.status,
      )
        ? 'complete'
        : 'upcoming',
    },
    {
      name: 'Processing',
      icon: Package,
      status: ['Processing', 'Shipped', 'Delivered'].includes(order.status)
        ? 'complete'
        : order.status === 'Pending'
          ? 'current'
          : 'upcoming',
    },
    {
      name: 'Shipped',
      icon: Truck,
      status: ['Shipped', 'Delivered'].includes(order.status)
        ? 'complete'
        : order.status === 'Processing'
          ? 'current'
          : 'upcoming',
    },
    {
      name: 'Delivered',
      icon: CheckCircle,
      status:
        order.status === 'Delivered'
          ? 'complete'
          : order.status === 'Shipped'
            ? 'current'
            : 'upcoming',
    },
  ];

  // Safe JSON parsing (handle case where address might be null/undefined strictly)
  const shippingAddress = order.shippingAddress
    ? typeof order.shippingAddress === 'string'
      ? JSON.parse(order.shippingAddress)
      : order.shippingAddress
    : { name: 'N/A', street: '', city: '', state: '', zip: '' };

  return (
    <div className='bg-slate-50 min-h-[70vh] dark:bg-slate-900'>
      <div className='container mx-auto px-4 py-12'>
        <Link href='/account/orders'>
          <Button variant='ghost' className='mb-6'>
            <ChevronLeft className='h-4 w-4 mr-2' />
            Back to Orders
          </Button>
        </Link>

        <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-8'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight dark:text-white'>
              Order Details
            </h1>
            <p className='text-slate-600 dark:text-slate-300 mt-2'>
              Order #{order.id.slice(0, 12)}... • Placed on{' '}
              {formatOrderDate(order.createdAt.toISOString())}
            </p>
          </div>
          <div className='mt-4 md:mt-0'>
            <div className='bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium dark:bg-green-900 dark:text-green-100'>
              {order.status}
            </div>
          </div>
        </div>

        {/* Order Status Stepper */}
        <div className='bg-white rounded-lg p-6 mb-8 shadow-sm dark:bg-slate-800'>
          <div className='flex justify-between items-center mb-6'>
            {statusSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.name}
                  className='flex flex-col items-center relative'
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      step.status === 'complete'
                        ? 'bg-green-500 text-white'
                        : step.status === 'current'
                          ? 'bg-blue-500 text-white'
                          : 'bg-slate-200 text-slate-400 dark:bg-slate-700 dark:text-slate-500'
                    }`}
                  >
                    <Icon className='h-5 w-5' />
                  </div>
                  <div
                    className={`text-sm font-medium mt-2 ${
                      step.status === 'complete' || step.status === 'current'
                        ? 'text-slate-900 dark:text-white'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {step.name}
                  </div>
                  {index < statusSteps.length - 1 && (
                    <div
                      className={`absolute top-5 left-1/2 w-full h-0.5 ${
                        step.status === 'complete'
                          ? 'bg-green-500'
                          : 'bg-slate-200 dark:bg-slate-700'
                      }`}
                      style={{ transform: 'translateX(50%)' }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className='grid lg:grid-cols-3 gap-8'>
          {/* Order Items */}
          <div className='lg:col-span-2'>
            <div className='bg-white rounded-lg p-6 shadow-sm dark:bg-slate-800'>
              <h2 className='text-xl font-semibold dark:text-white mb-4'>
                Items in this Order
              </h2>
              <div className='divide-y dark:divide-slate-700'>
                {order.items.map((item) => (
                  <div key={item.id} className='flex py-4'>
                    <div className='h-20 w-20 flex shrink-0 overflow-hidden rounded-md border dark:border-slate-700'>
                      <Image
                        src={item.product?.thumbnail || '/placeholder.jpg'}
                        alt={item.product?.title || 'Product Image'}
                        width={80}
                        height={80}
                        className='h-full w-full object-cover'
                      />
                    </div>
                    <div className='ml-4 flex-1'>
                      <h3 className='font-medium text-slate-900 dark:text-white'>
                        <Link
                          href={`/products/${item.productId}`}
                          className='hover:underline'
                        >
                          {item.product?.title || item.title}
                        </Link>
                      </h3>
                      <p className='text-sm text-slate-500 dark:text-slate-400'>
                        Quantity: {item.quantity}
                      </p>
                      <p className='text-sm font-medium text-slate-900 dark:text-white mt-1'>
                        {formatPrice(item.priceAtPurchase * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className='space-y-6'>
            <div className='bg-white rounded-lg p-6 shadow-sm dark:bg-slate-800'>
              <h2 className='text-lg font-medium dark:text-white mb-4'>
                Order Summary
              </h2>
              <div className='space-y-2'>
                <div className='flex justify-between text-sm'>
                  <p className='text-slate-600 dark:text-slate-300'>Subtotal</p>
                  <p className='font-medium dark:text-white'>
                    {formatPrice(order.subtotal ?? 0)}
                  </p>
                </div>
                {(order.discount ?? 0) > 0 && (
                  <div className='flex justify-between text-sm text-green-600 dark:text-green-400'>
                    <p>Discount</p>
                    <p>-{formatPrice(order.discount ?? 0)}</p>
                  </div>
                )}
                <div className='flex justify-between text-sm'>
                  <p className='text-slate-600 dark:text-slate-300'>Shipping</p>
                  <p className='font-medium dark:text-white'>
                    {formatPrice(order.shippingCost ?? 0)}
                  </p>
                </div>
                <div className='flex justify-between text-sm'>
                  <p className='text-slate-600 dark:text-slate-300'>Taxes</p>
                  <p className='font-medium dark:text-white'>
                    {formatPrice(order.tax ?? 0)}
                  </p>
                </div>
                <div className='border-t border-slate-200 pt-2 flex justify-between text-base font-medium dark:border-slate-700 dark:text-white'>
                  <p>Total</p>
                  <p>{formatPrice(order.total)}</p>
                </div>
              </div>
            </div>

            <div className='bg-white rounded-lg p-6 shadow-sm dark:bg-slate-800'>
              <h3 className='text-lg font-semibold dark:text-white mb-4'>
                Shipping Information
              </h3>
              <div className='space-y-2 text-sm'>
                <p className='font-medium dark:text-white'>
                  {shippingAddress.name}
                </p>
                <p className='text-slate-600 dark:text-slate-300'>
                  {shippingAddress.street}
                </p>
                <p className='text-slate-600 dark:text-slate-300'>
                  {shippingAddress.city}, {shippingAddress.state}{' '}
                  {shippingAddress.zip}
                </p>
                <p className='mt-4'>
                  <span className='font-medium dark:text-white'>
                    Shipping Method:{' '}
                  </span>
                  <span className='text-slate-600 dark:text-slate-300'>
                    {order.shippingMethod === 'express'
                      ? 'Express (2-3 business days)'
                      : 'Standard (5-7 business days)'}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
