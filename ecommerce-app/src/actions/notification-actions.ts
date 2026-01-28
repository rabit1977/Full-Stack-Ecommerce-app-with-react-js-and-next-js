'use server';

import { auth } from '@/auth';
import { NotificationType, Prisma } from '@/generated/prisma/client';
import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

// ============================================
// TYPES
// ============================================

export interface NotificationWithMeta {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  link: string | null;
  isRead: boolean;
  readAt: Date | null;
  metadata: unknown;
  createdAt: Date;
}

export interface GetNotificationsOptions {
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
  type?: NotificationType;
}

export interface GetNotificationsResult {
  notifications: NotificationWithMeta[];
  totalCount: number;
  unreadCount: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

// ============================================
// HELPER
// ============================================

async function requireAuth() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized: Please log in');
  }
  return session.user;
}

// ============================================
// GET NOTIFICATIONS
// ============================================

/**
 * Get notifications for the current user with pagination and filters
 */
export async function getNotificationsAction(
  options: GetNotificationsOptions = {}
): Promise<GetNotificationsResult> {
  const { page = 1, limit = 10, unreadOnly = false, type } = options;

  try {
    const user = await requireAuth();

    const where = {
      userId: user.id,
      ...(unreadOnly && { isRead: false }),
      ...(type && { type }),
    };

    const [notifications, totalCount, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({
        where: { userId: user.id, isRead: false },
      }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      notifications: notifications as NotificationWithMeta[],
      totalCount,
      unreadCount,
      page,
      totalPages,
      hasMore: page < totalPages,
    };
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw new Error('Failed to fetch notifications');
  }
}

// ============================================
// GET UNREAD COUNT
// ============================================

/**
 * Get the count of unread notifications for the current user
 */
export async function getUnreadCountAction(): Promise<number> {
  try {
    const user = await requireAuth();

    const count = await prisma.notification.count({
      where: { userId: user.id, isRead: false },
    });

    return count;
  } catch {
    // Return 0 if not authenticated or error
    return 0;
  }
}

// ============================================
// MARK AS READ
// ============================================

/**
 * Mark a single notification as read
 */
export async function markNotificationAsReadAction(
  notificationId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await requireAuth();

    await prisma.notification.updateMany({
      where: {
        id: notificationId,
        userId: user.id,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    revalidatePath('/account/notifications');
    return { success: true };
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return { success: false, error: 'Failed to mark notification as read' };
  }
}

/**
 * Mark all notifications as read for the current user
 */
export async function markAllNotificationsAsReadAction(): Promise<{
  success: boolean;
  count?: number;
  error?: string;
}> {
  try {
    const user = await requireAuth();

    const result = await prisma.notification.updateMany({
      where: {
        userId: user.id,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    revalidatePath('/account/notifications');
    return { success: true, count: result.count };
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return { success: false, error: 'Failed to mark notifications as read' };
  }
}

// ============================================
// DELETE NOTIFICATION
// ============================================

/**
 * Delete a notification
 */
export async function deleteNotificationAction(
  notificationId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await requireAuth();

    await prisma.notification.deleteMany({
      where: {
        id: notificationId,
        userId: user.id,
      },
    });

    revalidatePath('/account/notifications');
    return { success: true };
  } catch (error) {
    console.error('Error deleting notification:', error);
    return { success: false, error: 'Failed to delete notification' };
  }
}

// ============================================
// CREATE NOTIFICATION (System/Admin use)
// ============================================

export interface CreateNotificationData {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Create a notification for a user (internal use)
 */
export async function createNotificationAction(
  data: CreateNotificationData
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId: data.userId,
        type: data.type,
        title: data.title,
        message: data.message,
        link: data.link,
        metadata: data.metadata as Prisma.InputJsonValue | undefined,
      },
    });

    return { success: true, id: notification.id };
  } catch (error) {
    console.error('Error creating notification:', error);
    return { success: false, error: 'Failed to create notification' };
  }
}

// ============================================
// BULK CREATE (for system events)
// ============================================

/**
 * Create notifications for multiple users (e.g., promotions)
 */
export async function createBulkNotificationsAction(
  userIds: string[],
  data: Omit<CreateNotificationData, 'userId'>
): Promise<{ success: boolean; count?: number; error?: string }> {
  try {
    const result = await prisma.notification.createMany({
      data: userIds.map((userId) => ({
        userId,
        type: data.type,
        title: data.title,
        message: data.message,
        link: data.link,
        metadata: data.metadata as Prisma.InputJsonValue | undefined,
      })),
    });

    return { success: true, count: result.count };
  } catch (error) {
    console.error('Error creating bulk notifications:', error);
    return { success: false, error: 'Failed to create notifications' };
  }
}
