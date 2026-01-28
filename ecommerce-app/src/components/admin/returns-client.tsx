'use client';

import { updateReturnRequestStatus } from '@/actions/admin/return-actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ReturnStatus } from '@prisma/client';
import {
    AlertCircle,
    CheckCircle,
    MoreHorizontal,
    Package,
    RotateCcw,
    Truck,
    XCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { toast } from 'sonner';

interface ReturnRequest {
  id: string;
  orderId: string;
  user: {
    name: string | null;
    email: string | null;
  };
  order: {
    orderNumber: string;
    total: number;
  };
  reason: string;
  status: ReturnStatus;
  createdAt: Date;
}

interface ReturnsClientProps {
  requests: ReturnRequest[];
}

const statusConfig: Record<ReturnStatus, { label: string; icon: any; color: string; bg: string }> = {
  REQUESTED: { label: 'Requested', icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  APPROVED: { label: 'Approved', icon: CheckCircle, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  REJECTED: { label: 'Rejected', icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
  SHIPPED: { label: 'Shipped', icon: Truck, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  RECEIVED: { label: 'Received', icon: Package, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
  REFUNDED: { label: 'Refunded', icon: RotateCcw, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  CLOSED: { label: 'Closed', icon: XCircle, color: 'text-slate-500', bg: 'bg-slate-500/10' },
};

export function ReturnsClient({ requests: initialRequests }: ReturnsClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function onUpdateStatus(id: string, status: ReturnStatus) {
    startTransition(async () => {
      const result = await updateReturnRequestStatus(id, status);
      if (result.success) {
        toast.success(`Return request updated to ${status}`);
        router.refresh();
      } else {
        toast.error('Failed to update request');
      }
    });
  }

  if (!initialRequests.length) {
    return (
      <div className='flex flex-col items-center justify-center py-12 text-center border rounded-xl bg-card'>
        <div className='p-4 rounded-full bg-muted mb-4'>
           <RotateCcw className='h-8 w-8 text-muted-foreground' />
        </div>
        <h3 className='font-semibold text-lg'>No Return Requests</h3>
        <p className='text-sm text-muted-foreground'>There are no return requests to process.</p>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {initialRequests.map((request) => {
        const config = statusConfig[request.status];
        const Icon = config.icon;

        return (
          <div
            key={request.id}
            className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border bg-card hover:shadow-md transition-all'
          >
            <div className='flex items-start gap-4'>
              <div className={`p-3 rounded-full shrink-0 ${config.bg} ${config.color}`}>
                <Icon className='h-5 w-5' />
              </div>
              <div>
                <div className='flex items-center gap-2 mb-1'>
                  <span className='font-bold text-sm'>
                    Order #{request.order.orderNumber}
                  </span>
                  <Badge variant='outline' className={`${config.color} border-current opacity-80`}>
                    {config.label}
                  </Badge>
                </div>
                <p className='text-sm font-medium'>{request.reason.replace(/_/g, ' ')}</p>
                <div className='flex items-center gap-2 mt-1 text-xs text-muted-foreground'>
                  <span>{request.user.name || request.user.email}</span>
                  <span>•</span>
                  <span>{new Date(request.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className='flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0'>
                {/* Actions */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='ghost' size='icon' disabled={isPending}>
                      <MoreHorizontal className='h-4 w-4' />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    <DropdownMenuItem disabled>
                        Update Status
                    </DropdownMenuItem>
                    {Object.keys(statusConfig).map((key) => {
                        const status = key as ReturnStatus;
                        if (status === request.status) return null;
                        return (
                             <DropdownMenuItem
                                key={status}
                                onClick={() => onUpdateStatus(request.id, status)}
                            >
                                Mark as {statusConfig[status].label}
                            </DropdownMenuItem>
                        )
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
            </div>
          </div>
        );
      })}
    </div>
  );
}
