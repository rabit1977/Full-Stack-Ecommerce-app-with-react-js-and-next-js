'use client';

import { updateOrderStatusAction } from '@/actions/order-actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatPrice } from '@/lib/utils/formatters';
import { Order, OrderStatus } from '@/generated/prisma/client';
import { MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { toast } from 'sonner';

interface OrdersDataTableProps {
  orders: Order[];
}

export const OrdersDataTable = ({ orders }: OrdersDataTableProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    startTransition(async () => {
      const result = await updateOrderStatusAction(orderId, newStatus);
      if (result.success) {
        toast.success(result.message);
        router.refresh(); // Or rely on revalidatePath from action
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <div className='rounded-lg border bg-white dark:bg-slate-900 dark:border-slate-800'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>User</TableHead>
            <TableHead className='hidden md:table-cell'>Total</TableHead>
            <TableHead className='hidden md:table-cell'>Status</TableHead>
            <TableHead>
              <span className='sr-only'>Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className='font-medium'>
                {order.id.slice(-8)}
              </TableCell>
              <TableCell>
                {new Date(order.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {JSON.parse(order.shippingAddress as string).name}
              </TableCell>
              <TableCell className='hidden md:table-cell'>
                {formatPrice(order.total)}
              </TableCell>
              <TableCell className='hidden md:table-cell'>
                <Badge
                  variant={
                    order.status === 'Pending'
                      ? 'secondary'
                      : order.status === 'Shipped'
                        ? 'outline'
                        : order.status === 'Delivered'
                          ? 'default'
                          : 'destructive'
                  }
                >
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      aria-haspopup='true'
                      size='icon'
                      variant='ghost'
                      disabled={isPending}
                    >
                      <MoreHorizontal className='h-4 w-4' />
                      <span className='sr-only'>Toggle menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/orders/${order.id}`}>
                        View Details
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        Update Status
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        {(
                          [
                            'Pending',
                            'Processing',
                            'Shipped',
                            'Delivered',
                            'Cancelled',
                          ] as OrderStatus[]
                        ).map((status) => (
                          <DropdownMenuItem
                            key={status}
                            onClick={() => handleStatusChange(order.id, status)}
                            disabled={order.status === status}
                          >
                            {status}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
