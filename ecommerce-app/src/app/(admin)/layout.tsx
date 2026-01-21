import { AdminBottomNav, AdminSidebar } from '@/components/admin/admin-sidebar';
import AdminAuthGuard from '@/components/auth/admin-auth-guard';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthGuard>
      <div className='flex min-h-screen bg-gray-100 dark:bg-gray-900'>
        {/* Admin Sidebar */}
        <AdminSidebar />

        {/* Main Content with bottom padding on mobile */}
        <main className='flex-1 overflow-x-hidden pb-20 lg:pb-0'>
          <div className='container-wide py-6 lg:py-8'>{children}</div>
        </main>

        {/* Bottom Navigation for Mobile/Tablet */}
        <AdminBottomNav />
      </div>
    </AdminAuthGuard>
  );
}
