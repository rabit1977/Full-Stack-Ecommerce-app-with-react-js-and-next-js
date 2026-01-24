import { AdminBottomNav, AdminMobileHeader, AdminSidebar } from '@/components/admin/admin-sidebar';
import AdminAuthGuard from '@/components/auth/admin-auth-guard';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthGuard>
      <div className='flex min-h-screen relative'>
        {/* Background Pattern */}
        <div className='fixed inset-0 -z-10 bg-gradient-to-br from-muted/30 via-background to-muted/20 dark:from-background dark:via-background dark:to-muted/10' />
        <div className='fixed inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.05),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.1),transparent)]' />
        
        {/* Admin Sidebar */}
        <AdminSidebar />
        
        {/* Content Wrapper */}
        <div className="flex-1 flex flex-col min-w-0 pt-16 lg:pt-0">
          {/* Mobile Header */}
          <AdminMobileHeader />
          
          {/* Main Content with bottom padding on mobile */}
          <main className='flex-1 overflow-x-hidden pb-20 lg:pb-0'>
            <div className='container-wide py-6 lg:py-8'>
              <div className='page-enter'>{children}</div>
            </div>
          </main>
        </div>

        {/* Bottom Navigation for Mobile/Tablet */}
        <AdminBottomNav />
      </div>
    </AdminAuthGuard>
  );
}
