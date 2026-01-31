'use client';

import { cancelSubscriptionAction } from '@/actions/subscription-actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { SubscriptionStatus } from '@/generated/prisma/client';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/utils/formatters';
import {
    Ban,
    Calendar,
    CreditCard,
    MoreVertical,
    User as UserIcon
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { toast } from 'sonner';

type SubscriptionWithUser = {
  id: string;
  userId: string;
  name: string;
  status: SubscriptionStatus;
  price: number;
  billingInterval: string;
  nextBillingDate: Date;
  cancelledAt: Date | null;
  cancelReason: string | null;
  user: {
    name: string | null;
    email: string | null;
    image: string | null;
  };
  createdAt: Date;
};

interface SubscriptionsDataTableProps {
  subscriptions: SubscriptionWithUser[];
}

const statusConfig: Partial<Record<SubscriptionStatus, { 
    label: string; 
    className: string;
    bgClass: string;
  }>> = {
    ACTIVE: { 
      label: 'Active', 
      className: 'text-emerald-600 dark:text-emerald-400',
      bgClass: 'bg-emerald-100 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800'
    },
    PAUSED: { 
      label: 'Paused', 
      className: 'text-amber-600 dark:text-amber-400',
      bgClass: 'bg-amber-100 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800'
    },
    CANCELLED: { 
      label: 'Cancelled', 
      className: 'text-red-600 dark:text-red-400',
      bgClass: 'bg-red-100 dark:bg-red-950/50 border-red-200 dark:border-red-800'
    },
    EXPIRED: { 
      label: 'Expired', 
      className: 'text-gray-600 dark:text-gray-400',
      bgClass: 'bg-gray-100 dark:bg-gray-950/50 border-gray-200 dark:border-gray-800'
    },
  };

export function SubscriptionsDataTable({ subscriptions }: SubscriptionsDataTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleCancel = (id: string) => {
    startTransition(async () => {
      const result = await cancelSubscriptionAction(id);
      if (result.success) {
        toast.success(result.message);
        router.refresh(); // Refresh to show updated status
      } else {
        toast.error(result.error);
      }
    });
  };

  if (subscriptions.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-16 text-center'>
        <div className='w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4'>
          <CreditCard className='h-8 w-8 text-muted-foreground/50' />
        </div>
        <p className='font-semibold text-foreground'>No subscriptions found</p>
        <p className='text-sm text-muted-foreground mt-1'>Active subscriptions will appear here</p>
      </div>
    );
  }

  return (
    <div className='space-y-3'>
      {subscriptions.map((sub) => {
        const config = statusConfig[sub.status] || statusConfig.ACTIVE!;
        
        return (
          <div
            key={sub.id}
            className={cn(
              'relative bg-card rounded-2xl border overflow-hidden group',
              'hover:shadow-lg hover:border-primary/30 transition-all duration-200'
            )}
          >
             {/* Status Color Bar */}
             <div className={cn('absolute left-0 top-0 bottom-0 w-1', config.bgClass.split(' ')[0])} />

             <div className='p-4 pl-5'>
                <div className='flex flex-col sm:flex-row sm:items-center gap-4 justify-between'>
                    {/* User & Plan Info */}
                    <div className='flex items-start gap-3'>
                        <div className='shrink-0'>
                            {sub.user.image ? (
                                <div className='relative h-10 w-10 sm:h-12 sm:w-12 rounded-full overflow-hidden ring-2 ring-border'>
                                    <Image 
                                    src={sub.user.image.startsWith('http') || sub.user.image.startsWith('/') ? sub.user.image : `/${sub.user.image}`} 
                                    alt={sub.user.name || 'User'} 
                                    fill
                                    className='object-cover'
                                    />
                                </div>
                            ) : (
                                <div className='h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-secondary flex items-center justify-center ring-2 ring-border'>
                                    <UserIcon className='h-5 w-5 text-muted-foreground' />
                                </div>
                            )}
                        </div>
                        
                        <div>
                             <h3 className='font-bold text-base text-foreground flex items-center gap-2'>
                                {sub.name}
                                <Badge 
                                    variant='outline' 
                                    className={cn('text-[10px] h-5 px-1.5 border-0 font-bold', config.bgClass, config.className)}
                                >
                                    {config.label}
                                </Badge>
                             </h3>
                             <p className='text-sm text-muted-foreground'>
                                {sub.user.name} ({sub.user.email})
                             </p>
                             <div className='flex items-center gap-3 mt-1 text-xs text-muted-foreground font-medium'>
                                <span className='flex items-center gap-1'>
                                    <CreditCard className='h-3 w-3' />
                                    {formatPrice(sub.price)}/{sub.billingInterval}
                                </span>
                                <span className='flex items-center gap-1'>
                                    <Calendar className='h-3 w-3' />
                                    Next billing: {new Date(sub.nextBillingDate).toLocaleDateString()}
                                </span>
                             </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className='flex items-center justify-end gap-2 mt-2 sm:mt-0'>
                        {sub.status === 'ACTIVE' && (
                             <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant='ghost' size='sm' className='h-8 w-8 p-0 rounded-full'>
                                        <MoreVertical className='h-4 w-4' />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align='end'>
                                    <DropdownMenuItem 
                                        className='text-destructive focus:text-destructive cursor-pointer'
                                        onClick={() => handleCancel(sub.id)}
                                        disabled={isPending}
                                    >
                                        <Ban className='h-4 w-4 mr-2' />
                                        Cancel Subscription
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                             </DropdownMenu>
                        )}
                         {sub.status === 'CANCELLED' && (
                             <span className='text-xs text-muted-foreground italic px-2'>
                                 Cancelled on {sub.cancelledAt ? new Date(sub.cancelledAt).toLocaleDateString() : 'N/A'}
                             </span>
                         )}
                    </div>
                </div>
             </div>
          </div>
        );
      })}
    </div>
  );
}
