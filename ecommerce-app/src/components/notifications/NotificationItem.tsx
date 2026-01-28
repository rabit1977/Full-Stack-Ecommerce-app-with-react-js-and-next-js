'use client';

import { Button } from '@/components/ui/button';
import { NotificationType } from '@/generated/prisma/browser';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import {
    AlertCircle,
    Bell,
    Heart,
    LucideIcon,
    MessageSquare,
    Package,
    RefreshCw,
    Tag,
    TrendingDown,
    Truck,
    X,
} from 'lucide-react';
import Link from 'next/link';
import { useTransition } from 'react';

// ============================================
// TYPE ICON MAPPING
// ============================================

interface TypeConfig {
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

const typeConfigs: Record<NotificationType, TypeConfig> = {
  ORDER_UPDATE: {
    icon: Package,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  PRICE_DROP: {
    icon: TrendingDown,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  BACK_IN_STOCK: {
    icon: RefreshCw,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
  PROMOTION: {
    icon: Tag,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
  },
  REVIEW_REPLY: {
    icon: MessageSquare,
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-500/10',
  },
  SHIPMENT_UPDATE: {
    icon: Truck,
    color: 'text-blue-600',
    bgColor: 'bg-blue-600/10',
  },
  ACCOUNT_ALERT: {
    icon: AlertCircle,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
  },
  WISHLIST_SALE: {
    icon: Heart,
    color: 'text-rose-500',
    bgColor: 'bg-rose-500/10',
  },
  SYSTEM: {
    icon: Bell,
    color: 'text-muted-foreground',
    bgColor: 'bg-muted',
  },
};

// ============================================
// TYPES
// ============================================

export interface NotificationItemProps {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  link: string | null;
  isRead: boolean;
  createdAt: Date;
  onMarkAsRead?: (id: string) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  compact?: boolean;
}

// ============================================
// COMPONENT
// ============================================

export function NotificationItem({
  id,
  type,
  title,
  message,
  link,
  isRead,
  createdAt,
  onMarkAsRead,
  onDelete,
  compact = false,
}: NotificationItemProps) {
  const [isPending, startTransition] = useTransition();
  const config = typeConfigs[type] || typeConfigs.SYSTEM;
  const Icon = config.icon;

  const handleClick = () => {
    if (!isRead && onMarkAsRead) {
      startTransition(() => {
        onMarkAsRead(id);
      });
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) {
      startTransition(() => {
        onDelete(id);
      });
    }
  };

  const content = (
    <div
      className={cn(
        'group relative flex gap-3 p-3 rounded-xl transition-all duration-200',
        !isRead && 'bg-primary/5 dark:bg-primary/10',
        isPending && 'opacity-50 pointer-events-none',
        compact ? 'p-2.5' : 'p-3',
        'hover:bg-muted/50'
      )}
    >
      {/* Unread indicator */}
      {!isRead && (
        <span className="absolute left-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary" />
      )}

      {/* Icon */}
      <div
        className={cn(
          'shrink-0 flex items-center justify-center rounded-xl',
          config.bgColor,
          compact ? 'w-9 h-9' : 'w-10 h-10'
        )}
      >
        <Icon className={cn('w-4 h-4', config.color)} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            'font-semibold text-foreground truncate',
            compact ? 'text-sm' : 'text-sm'
          )}
        >
          {title}
        </p>
        <p
          className={cn(
            'text-muted-foreground line-clamp-2',
            compact ? 'text-xs' : 'text-sm'
          )}
        >
          {message}
        </p>
        <p className="text-xs text-muted-foreground/70 mt-1">
          {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
        </p>
      </div>

      {/* Delete button */}
      {onDelete && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDelete}
          className="shrink-0 h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
          aria-label="Delete notification"
        >
          <X className="w-3.5 h-3.5" />
        </Button>
      )}
    </div>
  );

  if (link) {
    return (
      <Link href={link} onClick={handleClick} className="block">
        {content}
      </Link>
    );
  }

  return (
    <div onClick={handleClick} className="cursor-pointer">
      {content}
    </div>
  );
}
