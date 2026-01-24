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
    <div className='min-h-screen bg-slate-50 dark:bg-slate-950/50'>
      <div className='container-wide py-10 sm:py-16'>
        <Link href='/account/orders' className='inline-block mb-10'>
          <Button variant='ghost' className='rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 -ml-2 pl-2'>
            <ChevronLeft className='h-4 w-4 mr-2' />
            Back to Orders
          </Button>
        </Link>

        {/* Order Header */}
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6'>
          <div>
            <div className='flex items-center gap-3 mb-2'>
               <h1 className='text-3xl sm:text-4xl font-black tracking-tight text-foreground'>
                 Order #{order.id.slice(0, 8)}
               </h1>
               <div className='px-3 py-1 rounded-full text-xs font-bold bg-secondary uppercase tracking-wider'>
                  {formatOrderDate(order.createdAt.toISOString())}
               </div>
            </div>
            <p className='text-lg text-muted-foreground'>
              Thank you for your purchase!
            </p>
          </div>
          <div className='px-4 py-2 rounded-xl bg-primary/10 text-primary font-bold border border-primary/20 shadow-sm'>
            <span className="flex items-center gap-2">
               <span className="relative flex h-2.5 w-2.5">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${order.status === 'Delivered' ? 'bg-green-400' : 'bg-primary'}`}></span>
                  <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${order.status === 'Delivered' ? 'bg-green-500' : 'bg-primary'}`}></span>
                </span>
                {order.status}
            </span>
          </div>
        </div>

        {/* Status Stepper */}
        <div className='glass-card p-8 rounded-3xl mb-10 overflow-x-auto'>
          <div className='min-w-[600px] flex justify-between items-center relative'>
             {/* Progress Bar Background */}
             <div className="absolute top-1/2 left-0 w-full h-1 bg-secondary -translate-y-1/2 rounded-full z-0" />
             
            {statusSteps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = step.status === 'complete';
              const isCurrent = step.status === 'current';
              
              // Determine active color based on step state
              let activeColor = 'text-muted-foreground';
              let bgColor = 'bg-secondary border-border';
              let iconColor = 'text-muted-foreground';

              if (isCompleted) {
                  activeColor = 'text-green-600 dark:text-green-500';
                  bgColor = 'bg-green-500 border-green-500 shadow-lg shadow-green-500/20';
                  iconColor = 'text-white';
              } else if (isCurrent) {
                  activeColor = 'text-primary';
                  bgColor = 'bg-primary border-primary shadow-lg shadow-primary/20 ring-4 ring-primary/10';
                  iconColor = 'text-white';
              }

              return (
                <div key={step.name} className='relative z-10 flex flex-col items-center group'>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${bgColor}`}>
                    <Icon className={`h-5 w-5 ${iconColor}`} />
                  </div>
                  <div className={`mt-4 font-bold text-sm tracking-wide bg-background/80 px-3 py-1 rounded-full backdrop-blur-sm shadow-sm border border-border/50 ${activeColor} transition-colors duration-300`}>
                    {step.name}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className='grid lg:grid-cols-12 gap-8'>
          {/* Order Items */}
          <div className='lg:col-span-8'>
            <div className='glass-card rounded-3xl overflow-hidden'>
              <div className="p-6 border-b border-border/50 bg-secondary/10">
                 <h2 className='text-xl font-bold'>Items in this Order</h2>
              </div>
              <div className='divide-y divide-border/50'>
                {order.items.map((item) => (
                  <div key={item.id} className='flex gap-6 p-6 hover:bg-secondary/5 transition-colors'>
                    <div className='h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-border/50 bg-secondary'>
                      <Image
                        src={item.product?.thumbnail || '/placeholder.jpg'}
                        alt={item.product?.title || 'Product Image'}
                        width={96}
                        height={96}
                        className='h-full w-full object-cover'
                      />
                    </div>
                    <div className='flex-1 flex flex-col justify-between'>
                      <div>
                        <Link href={`/products/${item.productId}`} className='group/link'>
                          <h3 className='font-bold text-lg text-foreground group-hover/link:text-primary transition-colors line-clamp-2'>
                             {item.product?.title || item.title}
                          </h3>
                        </Link>
                        <p className='text-sm text-muted-foreground mt-1'>
                          Quantity: <span className="font-semibold text-foreground">{item.quantity}</span>
                        </p>
                      </div>
                      <p className='text-lg font-bold text-primary mt-2'>
                        {formatPrice(item.priceAtPurchase * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className='lg:col-span-4 space-y-8'>
            {/* Order Summary */}
            <div className='glass-card rounded-3xl p-6'>
              <h2 className='text-xl font-bold mb-6 flex items-center gap-2'>
                 <Package className="h-5 w-5 text-primary" />
                 Order Summary
              </h2>
              <div className='space-y-4'>
                <div className='flex justify-between text-sm'>
                  <span className='text-muted-foreground'>Subtotal</span>
                  <span className='font-semibold text-foreground'>{formatPrice(order.subtotal ?? 0)}</span>
                </div>
                {(order.discount ?? 0) > 0 && (
                  <div className='flex justify-between text-sm text-emerald-600 dark:text-emerald-400'>
                    <span className="font-medium">Discount</span>
                    <span className="font-bold">-{formatPrice(order.discount ?? 0)}</span>
                  </div>
                )}
                <div className='flex justify-between text-sm'>
                  <span className='text-muted-foreground'>Shipping</span>
                  <span className='font-semibold text-foreground'>{formatPrice(order.shippingCost ?? 0)}</span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span className='text-muted-foreground'>Taxes</span>
                  <span className='font-semibold text-foreground'>{formatPrice(order.tax ?? 0)}</span>
                </div>
                
                <div className='h-px bg-border/50 my-2' />
                
                <div className='flex justify-between items-end'>
                  <span className='text-base font-bold text-foreground'>Total</span>
                  <span className='text-2xl font-black tracking-tight text-primary'>
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>
            </div>

            {/* Shipping Info */}
            <div className='glass-card rounded-3xl p-6'>
              <h3 className='text-xl font-bold mb-6 flex items-center gap-2'>
                <Truck className="h-5 w-5 text-primary" />
                Shipping Details
              </h3>
              <div className='space-y-4'>
                <div className='p-4 rounded-xl bg-secondary/30 border border-border/50'>
                    <p className='font-bold text-foreground mb-1'>{shippingAddress.name}</p>
                    <p className='text-sm text-muted-foreground leading-relaxed'>
                      {shippingAddress.street}<br />
                      {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zip}
                    </p>
                </div>
                
                <div>
                   <p className='text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2'>Method Details</p>
                   <div className="flex items-center gap-3 p-3 rounded-xl border border-dashed border-border/50 bg-secondary/10">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                         <Truck className="h-4 w-4" />
                      </div>
                      <span className='text-sm font-medium text-foreground'>
                        {order.shippingMethod === 'express'
                          ? 'Express (2-3 days)'
                          : 'Standard (5-7 days)'}
                      </span>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
