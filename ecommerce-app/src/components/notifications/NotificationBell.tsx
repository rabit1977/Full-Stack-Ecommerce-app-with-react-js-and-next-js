'use client';

import {
    deleteNotificationAction,
    getNotificationsAction,
    getUnreadCountAction,
    markAllNotificationsAsReadAction,
    markNotificationAsReadAction,
    NotificationWithMeta,
} from '@/actions/notification-actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, CheckCheck, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useState, useTransition } from 'react';
import { NotificationList } from './NotificationList';

// ============================================
// TYPES
// ============================================

interface NotificationBellProps {
  initialUnreadCount?: number;
  className?: string;
}

// ============================================
// COMPONENT
// ============================================

export function NotificationBell({
  initialUnreadCount = 0,
  className,
}: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount);
  const [notifications, setNotifications] = useState<NotificationWithMeta[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Fetch notifications when dropdown opens
  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getNotificationsAction({ limit: 5 });
      setNotifications(result.notifications);
      setUnreadCount(result.unreadCount);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch unread count periodically (polling)
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const count = await getUnreadCountAction();
        setUnreadCount(count);
      } catch (error) {
        // Silently fail
      }
    };

    // Initial fetch
    fetchUnreadCount();

    // Poll every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  // Fetch notifications when popup opens
  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen, fetchNotifications]);

  // Mark single notification as read
  const handleMarkAsRead = useCallback(async (id: string) => {
    await markNotificationAsReadAction(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true, readAt: new Date() } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, []);

  // Mark all as read
  const handleMarkAllAsRead = useCallback(() => {
    startTransition(async () => {
      await markAllNotificationsAsReadAction();
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true, readAt: new Date() }))
      );
      setUnreadCount(0);
    });
  }, []);

  // Delete notification
  const handleDelete = useCallback(async (id: string) => {
    const notification = notifications.find((n) => n.id === id);
    await deleteNotificationAction(id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (notification && !notification.isRead) {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
  }, [notifications]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'relative h-10 w-10 rounded-full hover:bg-primary/10 hover:text-primary transition-colors',
            className
          )}
          aria-label={`Notifications (${unreadCount} unread)`}
        >
          <Bell className="h-5 w-5" />
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.div
                key="notification-badge"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -right-0.5 -top-0.5"
              >
                <Badge
                  variant="default"
                  className="h-4 min-w-4 px-1 rounded-full flex items-center justify-center text-[10px] font-bold bg-primary text-primary-foreground border-2 border-background shadow-xs"
                >
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[360px] p-0 rounded-2xl shadow-xl border-border/50"
        align="end"
        sideOffset={10}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="font-bold text-sm">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              disabled={isPending}
              className="h-7 text-xs text-primary hover:text-primary hover:bg-primary/10"
            >
              {isPending ? (
                <Loader2 className="w-3 h-3 animate-spin mr-1" />
              ) : (
                <CheckCheck className="w-3 h-3 mr-1" />
              )}
              Mark all read
            </Button>
          )}
        </div>

        {/* Notification List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <NotificationList
            notifications={notifications}
            onMarkAsRead={handleMarkAsRead}
            onDelete={handleDelete}
            compact
            maxHeight="max-h-[320px]"
            emptyMessage="You're all caught up!"
          />
        )}

        {/* Footer */}
        <div className="border-t p-2">
          <Link
            href="/account/notifications"
            onClick={() => setIsOpen(false)}
            className="block w-full text-center py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-xl transition-colors"
          >
            View all notifications
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
