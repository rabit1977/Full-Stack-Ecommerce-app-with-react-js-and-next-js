'use client';

import { deleteCouponAction, toggleCouponStatusAction } from '@/actions/coupon-actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Calendar, MoreHorizontal, Percent, Power, PowerOff, Tag, Ticket, Trash, Users } from 'lucide-react';
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

/**
 * Mobile-optimized Coupons Data Table
 * Displays coupons as cards for better touch interaction
 */
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

  if (coupons.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-12 text-center'>
        <Ticket className='h-12 w-12 text-muted-foreground/30 mb-3' />
        <p className='text-muted-foreground font-medium'>No coupons found</p>
      </div>
    );
  }

  return (
    <div className='space-y-2 sm:space-y-3'>
      {coupons.map((coupon) => {
        const isExpired = coupon.expiresAt && new Date(coupon.expiresAt) < new Date();
        const isActiveNow = coupon.isActive && !isExpired;

        return (
          <div
            key={coupon.id}
            className={cn(
              'group relative bg-card border border-border/50 rounded-xl',
              'p-3 sm:p-4',
              'hover:bg-muted/30 hover:border-primary/20 transition-all duration-200',
              !isActiveNow && 'opacity-60'
            )}
          >
            <div className='flex items-start gap-3'>
              {/* Icon */}
              <div className={cn(
                'shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center',
                isActiveNow 
                  ? 'bg-emerald-100 dark:bg-emerald-950/50' 
                  : 'bg-muted'
              )}>
                <Ticket className={cn(
                  'h-5 w-5 sm:h-6 sm:w-6',
                  isActiveNow 
                    ? 'text-emerald-600 dark:text-emerald-400' 
                    : 'text-muted-foreground'
                )} />
              </div>

              {/* Coupon Info */}
              <div className='flex-1 min-w-0 space-y-1'>
                {/* Code + Status */}
                <div className='flex items-center gap-2 flex-wrap'>
                  <span className='font-bold text-sm sm:text-base text-foreground uppercase tracking-wider'>
                    {coupon.code}
                  </span>
                  <Badge 
                    variant={isActiveNow ? 'default' : 'secondary'}
                    className='text-[9px] sm:text-[10px] px-1.5 py-0 h-5'
                  >
                    {isActiveNow ? 'Active' : isExpired ? 'Expired' : 'Inactive'}
                  </Badge>
                </div>

                {/* Discount + Expiry */}
                <div className='flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-muted-foreground'>
                  <span className='inline-flex items-center gap-1 font-semibold text-foreground'>
                    {coupon.type === 'PERCENTAGE' ? (
                      <><Percent className='h-3 w-3' />{coupon.discount}% off</>
                    ) : (
                      <><Tag className='h-3 w-3' />${coupon.discount} off</>
                    )}
                  </span>
                  <span className='hidden sm:inline'>•</span>
                  <span className='inline-flex items-center gap-1'>
                    <Calendar className='h-3 w-3' />
                    {coupon.expiresAt 
                      ? new Date(coupon.expiresAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                      : 'Never expires'
                    }
                  </span>
                </div>

                {/* Usage + Actions Row */}
                <div className='flex items-center justify-between gap-2 mt-2'>
                  <span className='inline-flex items-center gap-1 text-[10px] sm:text-xs text-muted-foreground'>
                    <Users className='h-3 w-3' />
                    {coupon._count.orders} uses
                  </span>

                  {/* Actions */}
                  <div className='flex items-center gap-1'>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => handleToggleStatus(coupon.id, coupon.isActive)}
                      disabled={isPending}
                      className={cn(
                        'h-8 px-2 sm:px-3 rounded-lg text-xs',
                        coupon.isActive 
                          ? 'text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/30' 
                          : 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30'
                      )}
                    >
                      {coupon.isActive ? (
                        <>
                          <PowerOff className='h-3.5 w-3.5 sm:mr-1' />
                          <span className='hidden sm:inline'>Deactivate</span>
                        </>
                      ) : (
                        <>
                          <Power className='h-3.5 w-3.5 sm:mr-1' />
                          <span className='hidden sm:inline'>Activate</span>
                        </>
                      )}
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          size='sm' 
                          variant='ghost' 
                          disabled={isPending}
                          className='h-8 w-8 p-0 rounded-lg'
                        >
                          <MoreHorizontal className='h-4 w-4' />
                          <span className='sr-only'>Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end' className='w-40'>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleToggleStatus(coupon.id, coupon.isActive)}
                          className='cursor-pointer'
                        >
                          {coupon.isActive ? (
                            <><PowerOff className='mr-2 h-4 w-4' /> Deactivate</>
                          ) : (
                            <><Power className='mr-2 h-4 w-4' /> Activate</>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className='text-destructive focus:text-destructive cursor-pointer'
                          onClick={() => handleDelete(coupon.id)}
                        >
                          <Trash className='mr-2 h-4 w-4' /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
