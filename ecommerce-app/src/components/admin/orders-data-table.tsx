'use client';

import { updateOrderStatusAction } from '@/actions/order-actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Order, OrderStatus } from '@/generated/prisma/client';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/utils/formatters';
import {
    CheckCircle,
    ChevronRight,
    Clock,
    MoreVertical,
    Package,
    RefreshCw,
    Truck,
    XCircle
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { toast } from 'sonner';

interface OrdersDataTableProps {
  orders: Order[];
}

// Status configuration
const statusConfig: Record<OrderStatus, { 
  label: string; 
  icon: React.ElementType; 
  className: string;
  bgClass: string;
}> = {
  Pending: { 
    label: 'Pending', 
    icon: Clock, 
    className: 'text-amber-600 dark:text-amber-400',
    bgClass: 'bg-amber-100 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800'
  },
  Processing: { 
    label: 'Processing', 
    icon: RefreshCw, 
    className: 'text-blue-600 dark:text-blue-400',
    bgClass: 'bg-blue-100 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800'
  },
  Shipped: { 
    label: 'Shipped', 
    icon: Truck, 
    className: 'text-violet-600 dark:text-violet-400',
    bgClass: 'bg-violet-100 dark:bg-violet-950/50 border-violet-200 dark:border-violet-800'
  },
  Delivered: { 
    label: 'Delivered', 
    icon: CheckCircle, 
    className: 'text-emerald-600 dark:text-emerald-400',
    bgClass: 'bg-emerald-100 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800'
  },
  Cancelled: { 
    label: 'Cancelled', 
    icon: XCircle, 
    className: 'text-red-600 dark:text-red-400',
    bgClass: 'bg-red-100 dark:bg-red-950/50 border-red-200 dark:border-red-800'
  },
};

/**
 * Mobile-optimized Orders Data Table
 * Clean card layout optimized for touch interaction
 */
export const OrdersDataTable = ({ orders }: OrdersDataTableProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    startTransition(async () => {
      const result = await updateOrderStatusAction(orderId, newStatus);
      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  };

  const getCustomerName = (order: Order) => {
    try {
      const address = JSON.parse(order.shippingAddress as string);
      return address.name || 'Unknown';
    } catch {
      return 'Unknown';
    }
  };

  if (orders.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-16 text-center'>
        <div className='w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4'>
          <Package className='h-8 w-8 text-muted-foreground/50' />
        </div>
        <p className='font-semibold text-foreground'>No orders found</p>
        <p className='text-sm text-muted-foreground mt-1'>Orders will appear here</p>
      </div>
    );
  }

  return (
    <div className='space-y-3'>
      {orders.map((order) => {
        const config = statusConfig[order.status as OrderStatus];
        const StatusIcon = config?.icon || Package;

        return (
          <Link
            key={order.id}
            href={`/admin/orders/${order.id}`}
            className='block'
          >
            <div
              className={cn(
                'relative bg-card rounded-2xl border overflow-hidden',
                'active:scale-[0.99] transition-all duration-200',
                'hover:shadow-lg hover:border-primary/30'
              )}
            >
              {/* Status Color Bar */}
              <div className={cn('absolute left-0 top-0 bottom-0 w-1', config?.bgClass?.split(' ')[0])} />
              
              <div className='p-4 pl-5'>
                {/* Top Row: Order ID, Status, Total */}
                <div className='flex items-start justify-between gap-3'>
                  <div className='flex-1 min-w-0'>
                    {/* Order ID */}
                    <div className='flex items-center gap-2'>
                      <span className='font-bold text-base text-foreground'>
                        #{order.id.slice(-8)}
                      </span>
                      <Badge 
                        variant='secondary'
                        className={cn(
                          'text-[10px] font-bold px-2 py-0.5 rounded-full border',
                          config?.bgClass,
                          config?.className
                        )}
                      >
                        {config?.label || order.status}
                      </Badge>
                    </div>
                    
                    {/* Customer Name */}
                    <p className='text-sm text-muted-foreground mt-1 truncate'>
                      {getCustomerName(order)}
                    </p>
                  </div>

                  {/* Total + Actions */}
                  <div className='flex items-center gap-2 shrink-0'>
                    <div className='text-right'>
                      <p className='font-bold text-base text-foreground'>
                        {formatPrice(order.total)}
                      </p>
                      <p className='text-[11px] text-muted-foreground'>
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>

                    {/* Menu Button */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                        <Button
                          variant='ghost'
                          size='sm'
                          disabled={isPending}
                          className='h-8 w-8 p-0 rounded-full shrink-0'
                        >
                          <MoreVertical className='h-4 w-4' />
                          <span className='sr-only'>Order actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end' className='w-44'>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/orders/${order.id}`} className='cursor-pointer'>
                            <ChevronRight className='h-4 w-4 mr-2' />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {(
                          [
                            'Pending',
                            'Processing',
                            'Shipped',
                            'Delivered',
                            'Cancelled',
                          ] as OrderStatus[]
                        ).map((status) => {
                          const statusConf = statusConfig[status];
                          const Icon = statusConf.icon;
                          const isCurrentStatus = order.status === status;
                          return (
                            <DropdownMenuItem
                              key={status}
                              onClick={(e) => {
                                e.preventDefault();
                                handleStatusChange(order.id, status);
                              }}
                              disabled={isCurrentStatus}
                              className={cn(
                                'cursor-pointer',
                                isCurrentStatus && 'opacity-50'
                              )}
                            >
                              <Icon className={cn('h-4 w-4 mr-2', statusConf.className)} />
                              {status}
                              {isCurrentStatus && (
                                <span className='ml-auto text-[10px] text-muted-foreground'>Current</span>
                              )}
                            </DropdownMenuItem>
                          );
                        })}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Bottom Row: Quick Info */}
                <div className='flex items-center gap-4 mt-3 pt-3 border-t border-border/50'>
                  <div className='flex items-center gap-1.5 text-xs text-muted-foreground'>
                    <StatusIcon className={cn('h-3.5 w-3.5', config?.className)} />
                    <span>{config?.label}</span>
                  </div>
                  <div className='flex-1' />
                  <div className='flex items-center gap-1 text-xs text-primary font-medium'>
                    <span>View details</span>
                    <ChevronRight className='h-3.5 w-3.5' />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};
