'use client';

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
import { useAppDispatch } from '@/lib/store/hooks';
import { updateOrderStatusInStore } from '@/lib/store/thunks/orderThunks';
import { Order } from '@/lib/types';
import { formatPrice } from '@/lib/utils/formatters';
import { MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { useTransition } from 'react';

interface OrdersDataTableProps {
  orders: Order[];
}

export const OrdersDataTable = ({ orders }: OrdersDataTableProps) => {
  const [isPending, startTransition] = useTransition();

  const dispatch = useAppDispatch();

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    startTransition(() => {
      dispatch(updateOrderStatusInStore(orderId, newStatus));
    });
  };

  return (
    <div className='rounded-lg border bg-white dark:bg-slate-900 dark:border-slate-800'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Customer</TableHead>
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
              <TableCell className='font-medium'>{order.id}</TableCell>
              <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
              <TableCell>{order.shippingAddress.name}</TableCell>
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
                      : 'default'
                  }
                >
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button aria-haspopup='true' size='icon' variant='ghost'>
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
                        <DropdownMenuItem
                          onClick={() =>
                            handleStatusChange(order.id, 'Pending')
                          }
                        >
                          Pending
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleStatusChange(order.id, 'Shipped')
                          }
                        >
                          Shipped
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleStatusChange(order.id, 'Delivered')
                          }
                        >
                          Delivered
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleStatusChange(order.id, 'Cancelled')
                          }
                        >
                          Cancelled
                        </DropdownMenuItem>
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
