'use client';

import { use, Suspense, useTransition, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { updateOrderStatus } from '@/lib/store/thunks/orderThunks';
import { formatPrice, formatOrderDate, formatDateTime } from '@/lib/utils/formatters';
import { 
  ArrowLeft, 
  Package, 
  User, 
  MapPin, 
  CreditCard, 
  Truck,
  Calendar,
  Loader2,
  Mail,
  Phone,
  Trash2,
  Download,
  Printer
} from 'lucide-react';
import { toast } from 'sonner';
import { Order } from '@/lib/types';

interface OrderDetailsPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Get status badge variant
 */
const getStatusVariant = (status: Order['status']): 'default' | 'secondary' | 'destructive' | 'outline' => {
  const variants: Partial<Record<Order['status'], 'default' | 'secondary' | 'destructive' | 'outline'>> = {
    'Pending': 'secondary',
    'Processing': 'secondary',
    'Shipped': 'default',
    'Delivered': 'outline',
    'Cancelled': 'destructive',
  };
  return variants[status] || 'default';
};

/**
 * Order details skeleton
 */
function OrderDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-96" />
        </div>
        <div className="space-y-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Order not found component
 */
function OrderNotFound() {
  const router = useRouter();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
      <Package className="h-16 w-16 text-slate-300 dark:text-slate-600" />
      <h2 className="text-2xl font-bold dark:text-white">Order Not Found</h2>
      <p className="text-slate-600 dark:text-slate-400 text-center max-w-md">
        The order you're looking for doesn't exist or has been removed.
      </p>
      <Button onClick={() => router.push('/admin/orders')}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Orders
      </Button>
    </div>
  );
}

/**
 * Order details content
 */
function OrderDetailsContent({ orderId }: { orderId: string }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isPending, startTransition] = useTransition();

  const order = useAppSelector((state) =>
    state.orders.orders.find((o) => o.id === orderId)
  );

  // Calculate subtotal
  const subtotal = useMemo(() => 
    order?.items.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0,
    [order]
  );

  const handleStatusChange = async (newStatus: Order['status']) => {
    if (!order) return;

    try {
      await dispatch(updateOrderStatus({ 
        orderId: order.id, 
        newStatus 
      })).unwrap();
      
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update order status');
      console.error('Status update error:', error);
    }
  };

  const handlePrint = () => {
    window.print();
    toast.success('Print dialog opened');
  };

  const handleDownload = () => {
    toast.success('Invoice download started');
    // Implement invoice download logic
  };

  const handleDelete = () => {
    toast.success('Order deleted');
    router.push('/admin/orders');
    // Implement delete logic
  };

  if (!order) {
    return <OrderNotFound />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/admin/orders')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold dark:text-white">
              Order #{order.id.slice(0, 12)}
            </h1>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 ml-12">
            Placed on {formatDateTime(order.date)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Invoice
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Order</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this order? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Card */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>Order Status</CardTitle>
                  <CardDescription className="mt-2">
                    Update the order fulfillment status
                  </CardDescription>
                </div>
                <Badge variant={getStatusVariant(order.status)}>
                  {order.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Select
                value={order.status}
                onValueChange={(value) => handleStatusChange(value as Order['status'])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Processing">Processing</SelectItem>
                  <SelectItem value="Shipped">Shipped</SelectItem>
                  <SelectItem value="Delivered">Delivered</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Items ({order.items.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={item.cartItemId}>
                    {index > 0 && <Separator />}
                    <div className="flex items-center gap-4 py-2">
                      <div className="w-16 h-16 relative rounded-md overflow-hidden border dark:border-slate-700">
                        <Image
                          src={item.image || '/images/placeholder.jpg'}
                          alt={item.title || 'Product Image'}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium dark:text-white">{item.title}</p>
                        <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mt-1">
                          <span>Qty: {item?.quantity}</span>
                          <span>{formatPrice(item.price)} each</span>
                        </div>
                      </div>
                      <p className="font-semibold dark:text-white">
                        {formatPrice(item?.price * item?.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Subtotal</span>
                  <span className="font-medium dark:text-white">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Shipping</span>
                  <span className="font-medium dark:text-white">{formatPrice(0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Tax</span>
                  <span className="font-medium dark:text-white">{formatPrice(0)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold pt-2">
                  <span className="dark:text-white">Total</span>
                  <span className="dark:text-white">{formatPrice(order.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5" />
                Customer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-semibold dark:text-white">
                  {order.shippingAddress.name}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Customer since {formatOrderDate(order.date)}
                </p>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-600 dark:text-slate-400">
                    customer@example.com
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-600 dark:text-slate-400">
                    +1 (555) 123-4567
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="h-5 w-5" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <address className="not-italic text-sm text-slate-600 dark:text-slate-400 space-y-1">
                <p className="font-medium text-slate-900 dark:text-white">
                  {order.shippingAddress.name}
                </p>
                <p>{order.shippingAddress.street}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                  {order.shippingAddress.zip}
                </p>
                <p>{order.shippingAddress.country}</p>
              </address>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CreditCard className="h-5 w-5" />
                Payment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-medium dark:text-white">{order.paymentMethod}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Payment processed successfully
                </p>
                <Badge variant="outline" className="mt-2">Paid</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

/**
 * Order details page with Suspense
 */
export default function AdminOrderDetailsPage({ params }: OrderDetailsPageProps) {
  const { id } = use(params);

  return (
    <Suspense fallback={<OrderDetailsSkeleton />}>
      <OrderDetailsContent orderId={id} />
    </Suspense>
  );
}