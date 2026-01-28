'use client';

import { NotificationWithMeta } from '@/actions/notification-actions';
import { cn } from '@/lib/utils';
import { Inbox } from 'lucide-react';
import { NotificationItem } from './NotificationItem';

// ============================================
// TYPES
// ============================================

export interface NotificationListProps {
  notifications: NotificationWithMeta[];
  onMarkAsRead?: (id: string) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  compact?: boolean;
  maxHeight?: string;
  emptyMessage?: string;
  showEmptyIcon?: boolean;
}

// ============================================
// COMPONENT
// ============================================

export function NotificationList({
  notifications,
  onMarkAsRead,
  onDelete,
  compact = false,
  maxHeight = 'max-h-[400px]',
  emptyMessage = 'No notifications yet',
  showEmptyIcon = true,
}: NotificationListProps) {
  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
        {showEmptyIcon && (
          <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-3">
            <Inbox className="w-7 h-7 text-muted-foreground" />
          </div>
        )}
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={cn('overflow-y-auto', maxHeight)}>
      <div className="space-y-1 p-1">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            id={notification.id}
            type={notification.type}
            title={notification.title}
            message={notification.message}
            link={notification.link}
            isRead={notification.isRead}
            createdAt={notification.createdAt}
            onMarkAsRead={onMarkAsRead}
            onDelete={onDelete}
            compact={compact}
          />
        ))}
      </div>
    </div>
  );
}
