'use client';

import { Button } from '@/components/ui/button';
import { useAppSelector } from '@/lib/store/hooks';
import { CartItem } from '@/lib/types';
import { formatOrderDate, formatPrice } from '@/lib/utils/formatters';
import { CheckCircle, ChevronLeft, Package, Truck } from 'lucide-react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';

const OrderDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { orders } = useAppSelector((state) => state.orders);
  const order = orders.find((o) => o.id === params.id);

  if (!order) {
    return (
      <div className='container mx-auto px-4 py-16 text-center'>
        <Package className='mx-auto h-24 w-24 text-slate-300 dark:text-slate-700' />
        <h2 className='mt-6 text-2xl font-bold dark:text-white'>
          Order not found
        </h2>
        <Button onClick={() => router.push('/account')} className='mt-8'>
          Back to Account
        </Button>
      </div>
    );
  }

  const statusSteps = [
    { name: 'Order Placed', icon: Package, status: 'complete' },
    { name: 'Processing', icon: Package, status: 'complete' },
    {
      name: 'Shipped',
      icon: Truck,
      status: order.shippingMethod === 'express' ? 'complete' : 'current',
    },
    { name: 'Delivered', icon: CheckCircle, status: 'upcoming' },
  ];

  return (
    <div className='bg-slate-50 min-h-[70vh] dark:bg-slate-900'>
      <div className='container mx-auto px-4 py-12'>
        <Button
          variant='ghost'
          onClick={() => router.push('/account')}
          className='mb-6'
        >
          <ChevronLeft className='h-4 w-4 mr-2' />
          Back to Orders
        </Button>

        <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-8'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight dark:text-white'>
              Order Details
            </h1>
            <p className='text-slate-600 dark:text-slate-300 mt-2'>
              Order #{order.id} • Placed on {formatOrderDate(order.date)}
            </p>
          </div>
          <div className='mt-4 md:mt-0'>
            <div className='bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium dark:bg-green-900 dark:text-green-100'>
              {order.shippingMethod === 'express' ? 'Shipped' : 'Processing'}
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
                {order.items.map((item: CartItem) => (
                  <div key={item.cartItemId} className='flex py-4'>
                    <div className='h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border dark:border-slate-700'>
                      <Image
                        src={item.image}
                        alt={item.title || 'Product Image'}
                        width={80}
                        height={80}
                        className='h-full w-full object-cover'
                      />
                    </div>
                    <div className='ml-4 flex-1'>
                      <h3 className='font-medium text-slate-900 dark:text-white'>
                        <a
                          href='#'
                          onClick={(e) => {
                            e.preventDefault();
                            router.push(`/products/${item.id}`);
                          }}
                          className='hover:underline'
                        >
                          {item.title}
                        </a>
                      </h3>
                      <p className='text-sm text-slate-500 dark:text-slate-400'>
                        Quantity: {item.quantity}
                      </p>
                      {item.options && (
                        <div className='mt-1 flex flex-wrap gap-x-3 text-sm text-slate-500 dark:text-slate-400'>
                          {Object.entries(item.options).map(
                            ([name, value]: [string, string]) => (
                              <span key={name}>
                                {name}: {value}
                              </span>
                            )
                          )}
                        </div>
                      )}
                      <p className='text-sm font-medium text-slate-900 dark:text-white mt-1'>
                        {formatPrice(item.price * item.quantity)}
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
                {(order.discountAmount ?? 0) > 0 && (
                  <div className='flex justify-between text-sm text-green-600 dark:text-green-400'>
                    <p>Discount</p>
                    <p>-{formatPrice(order.discountAmount ?? 0)}</p>
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
                    {formatPrice(order.taxes ?? 0)}
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
                  {order.shippingAddress.name}
                </p>
                <p className='text-slate-600 dark:text-slate-300'>
                  {order.shippingAddress.street}
                </p>
                <p className='text-slate-600 dark:text-slate-300'>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                  {order.shippingAddress.zip}
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
