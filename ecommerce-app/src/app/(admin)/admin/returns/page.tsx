import { getReturnRequests } from '@/actions/admin/return-actions';
import { auth } from '@/auth';
import { ReturnsClient } from '@/components/admin/returns-client';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Returns | Admin Dashboard',
  description: 'Manage return requests and refunds.',
};

export default async function ReturnsPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/');
  }

  const { data: requests } = await getReturnRequests();

  return (
    <div className='flex-1 space-y-4 p-8 pt-6'>
       <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-3xl font-bold tracking-tight'>Returns & Refunds</h2>
          <p className='text-muted-foreground'>
            Process return requests and manage refunds.
          </p>
        </div>
      </div>
      
      <ReturnsClient requests={requests || []} />
    </div>
  );
}
