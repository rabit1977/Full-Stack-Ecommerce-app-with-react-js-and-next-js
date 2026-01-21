'use client';

import { Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface AdminAuthGuardProps {
  children: React.ReactNode;
  /**
   * Optional redirect path for non-authenticated users
   */
  authRedirectTo?: string;
  /**
   * Optional redirect path for non-admin users
   */
  unauthorizedRedirectTo?: string;
  /**
   * Custom loading component
   */
  fallback?: React.ReactNode;
}

/**
 * Admin auth guard - protects routes that require admin access
 * Checks both authentication and admin role using NextAuth session
 */
const AdminAuthGuard: React.FC<AdminAuthGuardProps> = ({
  children,
  authRedirectTo = '/auth/sign-in',
  unauthorizedRedirectTo = '/',
  fallback,
}) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    // Wait for session to load
    if (status === 'loading') return;

    // Prevent multiple redirects
    if (hasChecked) return;
    setHasChecked(true);

    // User is not authenticated
    if (status === 'unauthenticated' || !session?.user) {
      toast.error('You must be logged in to access this page.');
      router.replace(authRedirectTo);
      return;
    }

    // User is authenticated but not an admin
    const userRole = session.user.role;
    if (userRole !== 'ADMIN') {
      toast.error('You do not have permission to access this page.');
      router.replace(unauthorizedRedirectTo);
      return;
    }

    // User is an admin - access granted
  }, [
    status,
    session,
    router,
    hasChecked,
    authRedirectTo,
    unauthorizedRedirectTo,
  ]);

  // Show loading state while checking
  if (status === 'loading' || !hasChecked) {
    return (
      fallback || (
        <div className='flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900'>
          <div className='text-center space-y-4'>
            <Loader2 className='h-16 w-16 animate-spin text-slate-400 mx-auto' />
            <p className='text-slate-600 dark:text-slate-400 font-medium'>
              Verifying admin access...
            </p>
          </div>
        </div>
      )
    );
  }

  // If we're still checking or redirecting, show loading
  if (
    status === 'unauthenticated' ||
    (session?.user && session.user.role !== 'ADMIN')
  ) {
    return (
      fallback || (
        <div className='flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900'>
          <div className='text-center space-y-4'>
            <Loader2 className='h-16 w-16 animate-spin text-slate-400 mx-auto' />
            <p className='text-slate-600 dark:text-slate-400 font-medium'>
              Redirecting...
            </p>
          </div>
        </div>
      )
    );
  }

  // User is an admin - render protected content
  return <>{children}</>;
};

export default AdminAuthGuard;
