'use client';

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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
    formatDateTime,
    formatOrderDate,
    formatPrice,
} from '@/lib/utils/formatters';
import { Prisma } from '@/generated/prisma/client';
import {
    ArrowLeft,
    Calendar,
    CreditCard,
    Download,
    Loader2,
    Mail,
    MapPin,
    Package,
    Phone,
    Printer,
    Trash2,
    Truck,
    User,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { toast } from 'sonner';

// Define the inclusion type for Prisma
type OrderWithDetailsInclude = {
  user: true;
  items: true;
};

export type OrderWithDetails = Prisma.OrderGetPayload<{
  include: OrderWithDetailsInclude;
}>;

type OrderStatus = OrderWithDetails['status'];

/**
 * Get status badge variant
 */
const getStatusVariant = (
  status: OrderStatus,
): 'default' | 'secondary' | 'destructive' | 'outline' => {
  const variants: Partial<
    Record<OrderStatus, 'default' | 'secondary' | 'destructive' | 'outline'>
  > = {
    Pending: 'secondary',
    Processing: 'secondary',
    Shipped: 'default',
    Delivered: 'outline',
    Cancelled: 'destructive',
  };
  return variants[status] || 'default';
};

/**
 * Order details skeleton
 */
export function OrderDetailsSkeleton() {
  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div className='space-y-2'>
          <Skeleton className='h-8 w-64' />
          <Skeleton className='h-4 w-48' />
        </div>
        <Skeleton className='h-10 w-32' />
      </div>
      <div className='grid lg:grid-cols-3 gap-6'>
        <div className='lg:col-span-2 space-y-6'>
          <Skeleton className='h-64' />
          <Skeleton className='h-96' />
        </div>
        <div className='space-y-6'>
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className='h-32' />
          ))}
        </div>
      </div>
    </div>
  );
}

interface OrderDetailsClientProps {
  order: OrderWithDetails | null;
  updateOrderStatusAction: (
    status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled',
  ) => Promise<{
    success: boolean;
    error?: string;
  }>;
  deleteOrderAction: () => Promise<{
    success: boolean;
    error?: string;
  }>;
}

/**
 * Order details content
 */
export default function OrderDetailsClient({
  order,
  updateOrderStatusAction,
  deleteOrderAction,
}: OrderDetailsClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (!order) return;
    startTransition(async () => {
      const result = await updateOrderStatusAction(newStatus);
      if (result.success) {
        toast.success(`Order status updated to ${newStatus}`);
      } else {
        toast.error(result.error);
      }
    });
  };

  const handlePrint = () => {
    window.print();
    toast.success('Print dialog opened');
  };

  const handleDownload = () => {
    toast.success('Invoice download started');
    // Implement invoice download logic
  };

  const handleDelete = async () => {
    if (!order) return;
    startTransition(async () => {
      const result = await deleteOrderAction();
      if (result.success) {
        toast.success('Order has been deleted.');
        router.push('/admin/orders');
      } else {
        toast.error(result.error);
      }
    });
  };

  if (!order) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[50vh] space-y-4'>
        <Package className='h-16 w-16 text-slate-300 dark:text-slate-600' />
        <h2 className='text-2xl font-bold dark:text-white'>Order Not Found</h2>
        <p className='text-slate-600 dark:text-slate-400 text-center max-w-md'>
          The order you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Button onClick={() => router.push('/admin/orders')}>
          <ArrowLeft className='h-4 w-4 mr-2' />
          Back to Orders
        </Button>
      </div>
    );
  }

  const shippingAddress =
    typeof order.shippingAddress === 'string'
      ? JSON.parse(order.shippingAddress)
      : order.shippingAddress;

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='space-y-1'>
          <div className='flex items-center gap-3'>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => router.push('/admin/orders')}
            >
              <ArrowLeft className='h-5 w-5' />
            </Button>
            <h1 className='text-2xl font-bold dark:text-white'>
              Order #{order.id.slice(0, 12)}
            </h1>
          </div>
          <p className='text-sm text-slate-600 dark:text-slate-400 ml-12 flex items-center gap-2'>
            <Calendar className='h-4 w-4' />
            {formatDateTime(order.createdAt.toString())}
          </p>
        </div>

        <div className='flex items-center gap-2'>
          <Button variant='outline' size='sm' onClick={handlePrint}>
            <Printer className='h-4 w-4 mr-2' />
            Print
          </Button>
          <Button variant='outline' size='sm' onClick={handleDownload}>
            <Download className='h-4 w-4 mr-2' />
            Invoice
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant='destructive' size='sm' disabled={isPending}>
                <Trash2 className='h-4 w-4 mr-2' />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Order</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this order? This action cannot
                  be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} disabled={isPending}>
                  {isPending ? (
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  ) : null}
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className='grid lg:grid-cols-3 gap-6'>
        {/* Main Content */}
        <div className='lg:col-span-2 space-y-6'>
          {/* Status Card */}
          <Card>
            <CardHeader>
              <div className='flex items-start justify-between'>
                <div>
                  <CardTitle>Order Status</CardTitle>
                  <CardDescription className='mt-2'>
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
                onValueChange={(value) =>
                  handleStatusChange(value as OrderStatus)
                }
                disabled={isPending}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='Pending'>Pending</SelectItem>
                  <SelectItem value='Processing'>Processing</SelectItem>
                  <SelectItem value='Shipped'>Shipped</SelectItem>
                  <SelectItem value='Delivered'>Delivered</SelectItem>
                  <SelectItem value='Cancelled'>Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Package className='h-5 w-5' />
                Order Items ({order.items.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {order.items.map((item, index) => (
                  <div key={item.id}>
                    {index > 0 && <Separator />}
                    <div className='flex items-center gap-4 py-2'>
                      <div className='w-16 h-16 relative rounded-md overflow-hidden border dark:border-slate-700'>
                        <Image
                          src={item.thumbnail || '/images/placeholder.jpg'}
                          alt={item.title || 'Product Image'}
                          fill
                          className='object-cover'
                        />
                      </div>
                      <div className='flex-1'>
                        <p className='font-medium dark:text-white'>
                          {item.title}
                        </p>
                        <div className='flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mt-1'>
                          <span>Qty: {item?.quantity}</span>
                          <span>{formatPrice(item.price)} each</span>
                        </div>
                      </div>
                      <p className='font-semibold dark:text-white'>
                        {formatPrice(item?.price * item?.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className='my-4' />

              <div className='space-y-2'>
                <div className='flex justify-between text-sm'>
                  <span className='text-slate-600 dark:text-slate-400'>
                    Subtotal
                  </span>
                  <span className='font-medium dark:text-white'>
                    {formatPrice(order.subtotal)}
                  </span>
                </div>
                <div className='flex justify-between items-center text-sm'>
                  <span className='text-slate-600 dark:text-slate-400 flex items-center gap-2'>
                    <Truck className='h-4 w-4' />
                    Shipping
                  </span>
                  <span className='font-medium dark:text-white'>
                    {formatPrice(order.shippingCost)}
                  </span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span className='text-slate-600 dark:text-slate-400'>
                    Tax
                  </span>
                  <span className='font-medium dark:text-white'>
                    {formatPrice(order.tax)}
                  </span>
                </div>
                <Separator />
                <div className='flex justify-between font-semibold pt-2'>
                  <span className='dark:text-white'>Total</span>
                  <span className='dark:text-white'>
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-lg'>
                <User className='h-5 w-5' />
                User
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div>
                <p className='font-semibold dark:text-white'>
                  {order.user.name}
                </p>
                <p className='text-sm text-slate-500 dark:text-slate-400 mt-1'>
                  User since {formatOrderDate(order.user.createdAt.toString())}
                </p>
              </div>
              <Separator />
              <div className='space-y-2'>
                <div className='flex items-center gap-2 text-sm'>
                  <Mail className='h-4 w-4 text-slate-400' />
                  <span className='text-slate-600 dark:text-slate-400'>
                    {order.user.email}
                  </span>
                </div>
                <div className='flex items-center gap-2 text-sm'>
                  <Phone className='h-4 w-4 text-slate-400' />
                  <span className='text-slate-600 dark:text-slate-400'>
                    (555) 123-4567
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-lg'>
                <MapPin className='h-5 w-5' />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <address className='not-italic text-sm text-slate-600 dark:text-slate-400 space-y-1'>
                <p className='font-medium text-slate-900 dark:text-white'>
                  {shippingAddress.name}
                </p>
                <p>{shippingAddress.street}</p>
                <p>
                  {shippingAddress.city}, {shippingAddress.state}{' '}
                  {shippingAddress.zip}
                </p>
                <p>{shippingAddress.country}</p>
              </address>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-lg'>
                <CreditCard className='h-5 w-5' />
                Payment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-2'>
                <p className='font-medium dark:text-white'>
                  {order.paymentMethod}
                </p>
                <p className='text-sm text-slate-500 dark:text-slate-400'>
                  Payment processed successfully
                </p>
                <Badge variant='outline' className='mt-2'>
                  Paid
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
