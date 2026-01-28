import { getActivityLogs } from '@/actions/admin/activity-actions';
import { auth } from '@/auth';
import { ActivityLogs } from '@/components/admin/activity-logs';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Activity Logs | Admin Dashboard',
  description: 'View system activity and audit logs.',
};

export default async function ActivityPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/');
  }

  const { data: logs } = await getActivityLogs(100);

  return (
    <div className='flex-1 space-y-4 p-8 pt-6'>
      <div className='flex items-center justify-between space-y-2'>
        <h2 className='text-3xl font-bold tracking-tight'>Activity Logs</h2>
        <p className='text-muted-foreground'>
            Recent actions and system events.
        </p>
      </div>
      <div className='grid gap-4 md:grid-cols-1 lg:grid-cols-1'>
          <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
             <ActivityLogs logs={logs || []} />
          </div>
      </div>
    </div>
  );
}
