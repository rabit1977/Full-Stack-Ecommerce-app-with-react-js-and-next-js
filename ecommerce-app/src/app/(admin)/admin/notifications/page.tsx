import { NotificationsSender } from '@/components/admin/notifications-sender';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Notifications | Admin Dashboard',
  description: 'Manage and broadcast system notifications',
};

export default function AdminNotificationsPage() {
  return (
    <div className='flex-1 space-y-4 p-8 pt-6'>
      <NotificationsSender />
    </div>
  );
}
