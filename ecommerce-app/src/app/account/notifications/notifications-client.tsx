'use client';

import {
    deleteNotificationAction,
    getNotificationsAction,
    GetNotificationsResult,
    markAllNotificationsAsReadAction,
    markNotificationAsReadAction,
    NotificationWithMeta,
} from '@/actions/notification-actions';
import { NotificationList } from '@/components/notifications';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { NotificationType } from '@/generated/prisma/browser';
import {
    AlertCircle,
    Bell,
    CheckCheck,
    Heart,
    Loader2,
    MessageSquare,
    Package,
    RefreshCw,
    Tag,
    TrendingDown,
    Truck,
} from 'lucide-react';
import { useCallback, useState, useTransition } from 'react';

// ============================================
// TYPES
// ============================================

interface NotificationsClientProps {
  initialData: GetNotificationsResult;
}

const typeOptions: { value: string; label: string; icon: React.ReactNode }[] = [
  { value: 'ALL', label: 'All Notifications', icon: <Bell className="w-4 h-4" /> },
  { value: 'ORDER_UPDATE', label: 'Order Updates', icon: <Package className="w-4 h-4" /> },
  { value: 'SHIPMENT_UPDATE', label: 'Shipment Updates', icon: <Truck className="w-4 h-4" /> },
  { value: 'PRICE_DROP', label: 'Price Drops', icon: <TrendingDown className="w-4 h-4" /> },
  { value: 'BACK_IN_STOCK', label: 'Back in Stock', icon: <RefreshCw className="w-4 h-4" /> },
  { value: 'PROMOTION', label: 'Promotions', icon: <Tag className="w-4 h-4" /> },
  { value: 'WISHLIST_SALE', label: 'Wishlist Sale', icon: <Heart className="w-4 h-4" /> },
  { value: 'REVIEW_REPLY', label: 'Review Replies', icon: <MessageSquare className="w-4 h-4" /> },
  { value: 'ACCOUNT_ALERT', label: 'Account Alerts', icon: <AlertCircle className="w-4 h-4" /> },
  { value: 'SYSTEM', label: 'System', icon: <Bell className="w-4 h-4" /> },
];

// ============================================
// COMPONENT
// ============================================

export function NotificationsClient({ initialData }: NotificationsClientProps) {
  const [notifications, setNotifications] = useState<NotificationWithMeta[]>(
    initialData.notifications
  );
  const [unreadCount, setUnreadCount] = useState(initialData.unreadCount);
  const [totalCount, setTotalCount] = useState(initialData.totalCount);
  const [page, setPage] = useState(initialData.page);
  const [hasMore, setHasMore] = useState(initialData.hasMore);
  const [filter, setFilter] = useState<string>('ALL');
  const [isPending, startTransition] = useTransition();
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Fetch notifications with filter
  const fetchNotifications = useCallback(async (type: string, pageNum: number = 1) => {
    startTransition(async () => {
      try {
        const result = await getNotificationsAction({
          page: pageNum,
          limit: 20,
          type: type === 'ALL' ? undefined : (type as NotificationType),
        });
        
        if (pageNum === 1) {
          setNotifications(result.notifications);
        } else {
          setNotifications((prev) => [...prev, ...result.notifications]);
        }
        
        setUnreadCount(result.unreadCount);
        setTotalCount(result.totalCount);
        setPage(result.page);
        setHasMore(result.hasMore);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    });
  }, []);

  // Handle filter change
  const handleFilterChange = useCallback((value: string) => {
    setFilter(value);
    setPage(1);
    fetchNotifications(value, 1);
  }, [fetchNotifications]);

  // Load more
  const handleLoadMore = useCallback(async () => {
    setIsLoadingMore(true);
    await fetchNotifications(filter, page + 1);
    setIsLoadingMore(false);
  }, [fetchNotifications, filter, page]);

  // Mark as read
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
    setTotalCount((prev) => prev - 1);
    if (notification && !notification.isRead) {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
  }, [notifications]);

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Select value={filter} onValueChange={handleFilterChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter notifications" />
            </SelectTrigger>
            <SelectContent>
              {typeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    {option.icon}
                    <span>{option.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <span className="text-sm text-muted-foreground">
            {totalCount} {totalCount === 1 ? 'notification' : 'notifications'}
            {unreadCount > 0 && (
              <span className="text-primary font-medium"> ({unreadCount} unread)</span>
            )}
          </span>
        </div>
        
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllAsRead}
            disabled={isPending}
            className="gap-2"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCheck className="w-4 h-4" />
            )}
            Mark all as read
          </Button>
        )}
      </div>

      {/* Notifications List */}
      <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
        {isPending && notifications.length === 0 ? (
          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <NotificationList
            notifications={notifications}
            onMarkAsRead={handleMarkAsRead}
            onDelete={handleDelete}
            maxHeight="max-h-[600px]"
            emptyMessage={
              filter === 'ALL'
                ? "You don't have any notifications yet"
                : `No ${typeOptions.find(o => o.value === filter)?.label.toLowerCase() || 'notifications'} found`
            }
          />
        )}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="gap-2"
          >
            {isLoadingMore ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading...
              </>
            ) : (
              'Load more notifications'
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
