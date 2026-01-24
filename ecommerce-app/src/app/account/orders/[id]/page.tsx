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
    <div className='min-h-screen bg-slate-50 dark:bg-slate-950/50 pb-20'>
      <div className='container-wide py-10 sm:py-16'>
        <Link href='/orders' className='inline-block mb-10'>
          <Button variant='ghost' className='rounded-full hover:bg-white/50 dark:hover:bg-slate-800 -ml-2 text-muted-foreground hover:text-foreground transition-all'>
            <ChevronLeft className='h-4 w-4 mr-2' />
            Back to Orders
          </Button>
        </Link>

        {/* Order Header */}
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500'>
          <div>
            <div className='flex items-center gap-4 mb-2'>
               <h1 className='text-3xl sm:text-5xl font-black tracking-tight text-foreground'>
                 Order #{order.id.slice(0, 8)}
               </h1>
               <div className='px-3 py-1 rounded-full text-xs font-bold bg-white dark:bg-slate-800 border border-border uppercase tracking-wider shadow-sm'>
                  {formatOrderDate(order.createdAt.toISOString())}
               </div>
            </div>
            <p className='text-lg text-muted-foreground font-medium'>
              Thank you for your purchase!
            </p>
          </div>
          <div className='px-5 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-border shadow-md flex items-center gap-3'>
             <span className="relative flex h-3 w-3">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${order.status === 'Delivered' ? 'bg-green-400' : 'bg-primary'}`}></span>
                <span className={`relative inline-flex rounded-full h-3 w-3 ${order.status === 'Delivered' ? 'bg-green-500' : 'bg-primary'}`}></span>
              </span>
              <span className="font-bold text-foreground capitalize">{order.status}</span>
          </div>
        </div>

        {/* Status Stepper */}
        <div className='glass-card p-10 rounded-3xl mb-12 overflow-x-auto shadow-xl shadow-black/5 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100'>
          <div className='min-w-[600px] flex justify-between items-center relative'>
             {/* Progress Bar Background */}
             <div className="absolute top-1/2 left-0 w-full h-1.5 bg-secondary -translate-y-1/2 rounded-full z-0 overflow-hidden">
                <div 
                  className="h-full bg-primary/20 transition-all duration-1000 ease-out" 
                  style={{ width: 
                    order.status === 'Delivered' ? '100%' : 
                    order.status === 'Shipped' ? '66%' : 
                    order.status === 'Processing' ? '33%' : '0%' 
                  }}
                />
             </div>
             
            {statusSteps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = step.status === 'complete';
              const isCurrent = step.status === 'current';
              
              // Determine active color based on step state
              let activeColor = 'text-muted-foreground';
              let bgColor = 'bg-white dark:bg-slate-900 border-border';
              let iconColor = 'text-muted-foreground';
              let ringColor = '';

              if (isCompleted) {
                  activeColor = 'text-green-600 dark:text-green-400';
                  bgColor = 'bg-green-500 border-green-500 shadow-xl shadow-green-500/20';
                  iconColor = 'text-white';
              } else if (isCurrent) {
                  activeColor = 'text-primary';
                  bgColor = 'bg-primary border-primary shadow-xl shadow-primary/25';
                  iconColor = 'text-white';
                  ringColor = 'ring-4 ring-primary/10';
              }

              return (
                <div key={step.name} className='relative z-10 flex flex-col items-center group'>
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${bgColor} ${ringColor} ${isCurrent ? 'scale-110' : ''}`}>
                    <Icon className={`h-6 w-6 ${iconColor}`} />
                  </div>
                  <div className={`mt-5 font-bold text-sm tracking-wide bg-white/80 dark:bg-slate-900/80 px-4 py-1.5 rounded-full backdrop-blur-md shadow-sm border border-border/50 ${activeColor} transition-colors duration-300`}>
                    {step.name}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className='grid lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200'>
          {/* Order Items */}
          <div className='lg:col-span-8'>
            <div className='glass-card rounded-3xl overflow-hidden shadow-xl shadow-black/5'>
              <div className="p-8 border-b border-border/50 bg-secondary/5">
                 <h2 className='text-xl font-bold flex items-center gap-2'>
                    <Package className="h-5 w-5 text-primary" />
                    Items in this Order
                 </h2>
              </div>
              <div className='divide-y divide-border/50'>
                {order.items.map((item) => (
                  <div key={item.id} className='flex gap-6 p-6 sm:p-8 hover:bg-secondary/5 transition-colors group'>
                    <div className='h-28 w-28 shrink-0 overflow-hidden rounded-2xl border border-border/50 bg-white dark:bg-secondary relative'>
                      <Image
                        src={item.product?.thumbnail || '/placeholder.jpg'}
                        alt={item.product?.title || 'Product Image'}
                        fill
                        className='object-cover group-hover:scale-105 transition-transform duration-500'
                      />
                    </div>
                    <div className='flex-1 flex flex-col justify-between py-1'>
                      <div>
                        <Link href={`/products/${item.productId}`} className='group/link inline-block'>
                          <h3 className='font-bold text-lg sm:text-xl text-foreground group-hover/link:text-primary transition-colors line-clamp-2'>
                             {item.product?.title || item.title}
                          </h3>
                        </Link>
                        <div className="flex items-center gap-2 mt-2">
                           <span className='inline-flex items-center justify-center px-2.5 py-0.5 rounded-lg bg-secondary text-xs font-bold text-muted-foreground'>
                             Qty: {item.quantity}
                           </span>
                        </div>
                      </div>
                      <p className='text-xl font-black text-foreground'>
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
            <div className='glass-card rounded-3xl p-8 shadow-xl shadow-black/5'>
              <h2 className='text-xl font-bold mb-8 flex items-center gap-2'>
                 <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Truck className="h-4 w-4" />
                 </div>
                 Order Summary
              </h2>
              <div className='space-y-4'>
                <div className='flex justify-between text-sm py-1'>
                  <span className='text-muted-foreground font-medium'>Subtotal</span>
                  <span className='font-bold text-foreground'>{formatPrice(order.subtotal ?? 0)}</span>
                </div>
                {(order.discount ?? 0) > 0 && (
                  <div className='flex justify-between text-sm py-1 px-3 -mx-3 rounded-lg bg-emerald-500/5'>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">Discount</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">-{formatPrice(order.discount ?? 0)}</span>
                  </div>
                )}
                <div className='flex justify-between text-sm py-1'>
                  <span className='text-muted-foreground font-medium'>Shipping</span>
                  <span className='font-bold text-foreground'>{formatPrice(order.shippingCost ?? 0)}</span>
                </div>
                <div className='flex justify-between text-sm py-1'>
                  <span className='text-muted-foreground font-medium'>Taxes</span>
                  <span className='font-bold text-foreground'>{formatPrice(order.tax ?? 0)}</span>
                </div>
                
                <div className='h-px bg-border/50 my-4' />
                
                <div className='flex justify-between items-end'>
                  <span className='text-lg font-bold text-foreground'>Total</span>
                  <span className='text-3xl font-black tracking-tight text-primary'>
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>
            </div>

            {/* Shipping Info */}
            <div className='glass-card rounded-3xl p-8 shadow-xl shadow-black/5'>
              <h3 className='text-lg font-bold mb-6 flex items-center gap-2'>
                Shipping Details
              </h3>
              <div className='space-y-6'>
                <div className='p-5 rounded-2xl bg-secondary/20 border border-border/50'>
                    <div className="flex items-center gap-3 mb-3">
                       <div className="h-8 w-8 rounded-full bg-white dark:bg-canvas flex items-center justify-center border border-border text-foreground">
                          <CheckCircle className="h-4 w-4 text-primary" />
                       </div>
                       <p className='font-bold text-foreground text-sm'>{shippingAddress.name}</p>
                    </div>
                    <p className='text-sm text-muted-foreground leading-relaxed pl-11'>
                      {shippingAddress.street}<br />
                      {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zip}
                    </p>
                </div>
                
                <div>
                   <p className='text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3'>Delivery Method</p>
                   <div className="flex items-center gap-4 p-4 rounded-2xl border border-dashed border-border/60 bg-white/50 dark:bg-slate-900/50">
                      <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                         <Truck className="h-5 w-5" />
                      </div>
                      <span className='text-sm font-bold text-foreground'>
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
