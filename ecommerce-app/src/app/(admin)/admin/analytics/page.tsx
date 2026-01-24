import { getAnalyticsDataAction } from '@/actions/analytics-actions';
import { auth } from '@/auth';
import AnalyticsClient from '@/components/admin/AnalyticsClient';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Analytics | Admin Dashboard',
  description: 'Detailed revenue and performance reports.',
};

export default async function AnalyticsPage() {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') {
    redirect('/');
  }

  const result = await getAnalyticsDataAction();
  
  const data = result.success && result.data ? result.data : {
      revenue: 0,
      orders: 0,
      users: 0,
      products: 0,
      chartData: [],
      categoryData: [],
  };

  return (
    <div className="p-4 sm:p-8 max-w-[1600px] mx-auto">
        <AnalyticsClient initialData={data} />
    </div>
  );
}
