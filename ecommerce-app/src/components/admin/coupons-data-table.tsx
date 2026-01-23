'use client';

import { deleteCouponAction, toggleCouponStatusAction } from '@/actions/coupon-actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
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
import { MoreHorizontal, Power, PowerOff, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { toast } from 'sonner';

export interface CouponWithStats {
  id: string;
  code: string;
  discount: number;
  type: 'PERCENTAGE' | 'FIXED';
  expiresAt: Date | null;
  isActive: boolean;
  createdAt: Date;
  _count: {
    orders: number;
    users: number;
  };
}

interface CouponsDataTableProps {
  coupons: CouponWithStats[];
}

export const CouponsDataTable = ({ coupons }: CouponsDataTableProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleToggleStatus = (id: string, currentStatus: boolean) => {
    startTransition(async () => {
      const result = await toggleCouponStatusAction(id, !currentStatus);
      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;
    
    startTransition(async () => {
      const result = await deleteCouponAction(id);
      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <div className='rounded-lg border bg-white dark:bg-slate-900 dark:border-slate-800'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Discount</TableHead>
            <TableHead>Expires</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className='hidden md:table-cell'>Usage</TableHead>
            <TableHead>
              <span className='sr-only'>Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {coupons.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                No coupons found.
              </TableCell>
            </TableRow>
          ) : (
            coupons.map((coupon) => (
              <TableRow key={coupon.id}>
                <TableCell className='font-bold uppercase'>
                  {coupon.code}
                </TableCell>
                <TableCell>
                  {coupon.type === 'PERCENTAGE' ? `${coupon.discount}%` : `$${coupon.discount}`}
                </TableCell>
                <TableCell>
                  {coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString() : 'Never'}
                </TableCell>
                <TableCell>
                  <Badge variant={coupon.isActive ? 'default' : 'secondary'}>
                    {coupon.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell className='hidden md:table-cell'>
                  {coupon._count.orders} orders
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size='icon' variant='ghost' disabled={isPending}>
                        <MoreHorizontal className='h-4 w-4' />
                        <span className='sr-only'>Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleToggleStatus(coupon.id, coupon.isActive)}>
                        {coupon.isActive ? (
                          <div className="flex items-center"><PowerOff className="mr-2 h-4 w-4" /> Deactivate</div>
                        ) : (
                          <div className="flex items-center"><Power className="mr-2 h-4 w-4" /> Activate</div>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleDelete(coupon.id)}
                      >
                        <div className="flex items-center"><Trash className="mr-2 h-4 w-4" /> Delete</div>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
