import { getAllSubscriptionsAction } from '@/actions/subscription-actions';
import { auth } from '@/auth';
import { SubscriptionsClient } from '@/components/admin/subscriptions-client';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Subscriptions | Admin Dashboard',
  description: 'Manage user subscriptions and memberships.',
};

export default async function SubscriptionsPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/');
  }

  const result = await getAllSubscriptionsAction();
  const subscriptions = result.success && result.data ? result.data : [];

  return <SubscriptionsClient subscriptions={subscriptions} />;
}
