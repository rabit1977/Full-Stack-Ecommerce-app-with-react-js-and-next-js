import { getStoreSettings } from '@/actions/admin/settings-actions';
import { auth } from '@/auth';
import { SettingsClient } from '@/components/admin/settings-client';
import { redirect } from 'next/navigation';

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/');
  }

  const { data: settings } = await getStoreSettings();

  return (
    <div className='flex-1 space-y-4 p-8 pt-6'>
      <SettingsClient initialData={settings} />
    </div>
  );
}
