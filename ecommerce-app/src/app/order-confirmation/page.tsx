'use client';

import { getMyOrdersAction, getOrderByIdAction } from '@/actions/order-actions';
import AuthGuard from '@/components/auth/auth-guard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatOrderDate, formatPrice } from '@/lib/utils/formatters';
import {
   ArrowRight,
   Check,
   Download,
   Mail,
   MapPin,
   Package,
   ShoppingBag
} from 'lucide-react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { toast } from 'sonner';

/* ===================== Skeleton ===================== */
function OrderConfirmationSkeleton() {
  return (
    <div className='min-h-screen bg-slate-50 dark:bg-slate-950/50 flex items-center justify-center p-4'>
      <div className='w-full max-w-3xl space-y-8 text-center'>
        <Skeleton className='h-32 w-32 rounded-full mx-auto' />
        <Skeleton className='h-12 w-64 mx-auto' />
        <div className="grid md:grid-cols-2 gap-8 mt-12">
            <Skeleton className='h-96 rounded-3xl' />
            <Skeleton className='h-96 rounded-3xl' />
        </div>
      </div>
    </div>
  );
}

/* ===================== No Order ===================== */
function NoOrderFound() {
  const router = useRouter();
  return (
    <div className='min-h-screen bg-slate-50 dark:bg-slate-950/50 flex items-center justify-center p-4'>
      <div className='max-w-md w-full text-center space-y-6 animate-in fade-in zoom-in duration-500'>
        <div className="w-24 h-24 bg-secondary/50 rounded-full flex items-center justify-center mx-auto">
            <ShoppingBag className='h-10 w-10 text-muted-foreground' />
        </div>
        <h2 className='text-3xl font-black text-foreground'>No order found</h2>
        <p className="text-muted-foreground">We couldn&apos;t find the order you&apos;re looking for.</p>
        <div className='flex justify-center gap-4 pt-4'>
          <Button onClick={() => router.push('/products')} size="lg" className="rounded-full px-8">
            Continue Shopping
          </Button>
          <Button variant='outline' onClick={() => router.push('/account')} size="lg" className="rounded-full px-8 border-border/60">
            View Orders
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ===================== Content ===================== */
function OrderConfirmationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);

      const res = orderId
        ? await getOrderByIdAction(orderId)
        : await getMyOrdersAction();

      if (res.success) {
        const orderData = res.data;
        if (orderId) {
          setOrder(orderData || null);
        } else {
          setOrder(Array.isArray(orderData) ? orderData[0] || null : null);
        }
      } else {
        toast.error(res.error || 'Failed to fetch order details.');
      }

      setLoading(false);
    })();
  }, [orderId]);

  if (loading) return <OrderConfirmationSkeleton />;
  if (!order) return <NoOrderFound />;

  return (
    <div className='min-h-screen bg-slate-50 dark:bg-slate-950/50 pb-20'>
        {/* Confetti / Celebration Header Background */}
        <div className="bg-primary/5 pb-32 pt-20 px-4 border-b border-primary/10 relative overflow-hidden">
            <div className="absolute top-10 left-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute top-10 right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
            
            <div className="container-wide text-center relative z-10">
               <div className='inline-flex mb-8 relative'>
                  <div className='absolute inset-0 bg-emerald-400/40 blur-2xl rounded-full animate-pulse' />
                  <div className='relative w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-xl ring-4 ring-white dark:ring-slate-900'>
                     <Check className='h-10 w-10 text-white animate-in zoom-in duration-500' strokeWidth={4} />
                  </div>
               </div>
               <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-foreground mb-4">
                  Order Confirmed!
               </h1>
               <p className="text-xl text-muted-foreground max-w-lg mx-auto">
                  Thank you for your purchase. We&apos;ve received your order and sent a confirmation email to <span className="font-semibold text-foreground">{order.user?.email}</span>.
               </p>
            </div>
        </div>

        <div className="container-wide px-4 -mt-20 relative z-20">
            <div className="grid lg:grid-cols-12 gap-8">
               {/* Main Receipt Card */}
               <div className="lg:col-span-8 space-y-8">
                  <div className="glass-card p-0 rounded-3xl overflow-hidden shadow-xl shadow-black/5">
                     <div className="p-8 border-b border-border/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-secondary/10">
                        <div>
                           <p className="text-sm text-muted-foreground font-bold uppercase tracking-wider mb-1">Order Number</p>
                           <p className="text-2xl font-mono font-bold text-foreground">#{order.id.slice(0, 8)}</p>
                        </div>
                        <div className="flex gap-3">
                           <Button variant="outline" size="sm" className="rounded-full gap-2 border-border/60 hover:bg-background">
                              <Download className="h-4 w-4" />
                              <span className="hidden sm:inline">Invoice</span>
                           </Button>
                           <Button variant="outline" size="sm" className="rounded-full gap-2 border-border/60 hover:bg-background" onClick={() => router.push(`/account/orders/${order.id}`)}>
                              <Package className="h-4 w-4" />
                              Status
                           </Button>
                        </div>
                     </div>
                     
                     <div className="p-8">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                           <ShoppingBag className="h-5 w-5 text-primary" />
                           Items Purchased
                        </h3>
                        <div className="space-y-6">
                           {order.items.map((item: {
                              id: string;
                              quantity: number;
                              priceAtPurchase: number;
                              product?: { title: string; thumbnail?: string | null };
                           }) => (
                              <div key={item.id} className="flex gap-4 sm:gap-6 items-center group">
                                 <div className="h-20 w-20 relative rounded-2xl overflow-hidden border border-border/50 bg-secondary/30 shrink-0">
                                    <Image
                                       src={item.product?.thumbnail || '/placeholder.jpg'}
                                       alt={item.product?.title || 'Product'}
                                       fill
                                       className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute top-0 right-0 bg-primary/20 backdrop-blur-sm text-primary text-[10px] font-bold px-1.5 py-0.5 rounded-bl-lg">
                                       x{item.quantity}
                                    </div>
                                 </div>
                                 <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-foreground truncate">{item.product?.title}</h4>
                                    <p className="text-sm text-muted-foreground mt-1">
                                       Price per unit: {formatPrice(item.priceAtPurchase)}
                                    </p>
                                 </div>
                                 <div className="text-right">
                                    <p className="font-bold text-lg text-foreground">
                                       {formatPrice(item.priceAtPurchase * item.quantity)}
                                    </p>
                                 </div>
                              </div>
                           ))}
                        </div>
                        
                        <div className="mt-8 pt-8 border-t border-border/50 space-y-3">
                           <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Subtotal</span>
                              <span className="font-medium">{formatPrice(order.total)}</span>
                           </div>
                           <div className="flex justify-between text-base font-bold pt-2 border-t border-dashed border-border/50">
                              <span>Total Paid</span>
                              <span className="text-primary text-xl">{formatPrice(order.total)}</span>
                           </div>
                        </div>
                     </div>
                  </div>
                  
                  <div className="flex justify-center sm:justify-start sm:flex-row gap-4">
                     <Button size="lg" className="rounded-full flex-1 px-8 h-10 lg:h-12 font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 btn-premium" onClick={() => router.push('/products')}>
                        Continue Shopping
                        <ArrowRight className="ml-2 h-4 w-4" />
                     </Button>
                     <Button variant="outline" size="lg" className="rounded-full flex-1 px-8 h-10 lg:h-12 font-bold border-border/60 hover:bg-secondary/50" onClick={() => router.push('/account')}>
                        View Order History
                     </Button>
                  </div>
               </div>

               {/* Sidebar Info */}
               <div className="lg:col-span-4 space-y-6">
                     <div className="glass-card p-6 rounded-3xl">
                        <h3 className="font-bold mb-4 flex items-center gap-2 text-foreground">
                           <MapPin className="h-5 w-5 text-primary" />
                           Shipping Details
                        </h3>
                        <div className="bg-secondary/20 rounded-2xl p-4 border border-border/50 mb-4">
                           {/* Parse address safely */}
                           {(() => {
                              const address = order.shippingAddress
                                 ? typeof order.shippingAddress === 'string'
                                    ? JSON.parse(order.shippingAddress)
                                    : order.shippingAddress
                                 : null;
                              
                              if (!address) return <p className="text-sm text-muted-foreground">No address details available</p>;

                              return (
                                 <>
                                    <p className="font-bold text-sm text-foreground">{address.name || order.user?.name}</p>
                                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                                       {address.street}<br/>
                                       {address.city}, {address.state} {address.zip}
                                    </p>
                                 </>
                              );
                           })()}
                        </div>
                        <div className="space-y-4">
                           <div>
                              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Status</p>
                              <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30">
                                 {order.status}
                              </Badge>
                           </div>
                           <div>
                              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Date</p>
                              <p className="text-sm font-medium">{formatOrderDate(order.createdAt)}</p>
                           </div>
                        </div>
                     </div>

                  <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 rounded-3xl p-6">
                     <div className="flex gap-4">
                        <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center shrink-0">
                           <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                           <h4 className="font-bold text-blue-900 dark:text-blue-100 text-sm">Need help with your order?</h4>
                           <p className="text-xs text-blue-700 dark:text-blue-300 mt-1 leading-relaxed">
                              If you have any questions, reply to your confirmation email or contact our support team.
                           </p>
                           <Button variant="link" className="p-0 h-auto text-blue-700 dark:text-blue-400 font-bold text-xs mt-2 hover:no-underline">
                              Contact Support &rarr;
                           </Button>
                        </div>
                     </div>
                   </div>
                </div>
             </div>
        </div>
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
