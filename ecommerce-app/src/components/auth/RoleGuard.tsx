'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

type UserRole = 'user' | 'admin' | 'moderator'; // Extend as needed

interface RoleGuardProps {
  children: React.ReactNode;
  /**
   * Required role(s) to access this route
   */
  requiredRole: UserRole | UserRole[];
  /**
   * Optional redirect path for non-authenticated users
   */
  authRedirectTo?: string;
  /**
   * Optional redirect path for users without required role
   */
  unauthorizedRedirectTo?: string;
  /**
   * Custom error message for unauthorized access
   */
  unauthorizedMessage?: string;
  /**
   * Custom loading component
   */
  fallback?: React.ReactNode;
}

/**
 * Generic role-based guard component
 * Can protect routes based on any role(s)
 */
const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  requiredRole,
  authRedirectTo = '/auth',
  unauthorizedRedirectTo = '/',
  unauthorizedMessage = 'You do not have permission to access this page.',
  fallback,
}) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      toast.error('You must be logged in to access this page.');
      router.replace(authRedirectTo);
      return;
    }

    if (status === 'authenticated') {
      const user = session.user;
      const allowedRoles = Array.isArray(requiredRole)
        ? requiredRole
        : [requiredRole];
      const hasRequiredRole = allowedRoles.includes(user.role as UserRole);

      if (!hasRequiredRole) {
        toast.error(unauthorizedMessage);
        router.replace(unauthorizedRedirectTo);
      }
    }
  }, [
    status,
    session,
    router,
    requiredRole,
    authRedirectTo,
    unauthorizedRedirectTo,
    unauthorizedMessage,
  ]);

  // Show loading state
  if (status === 'loading') {
    return (
      fallback || (
        <div className='flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900'>
          <div className='text-center space-y-4'>
            <Loader2 className='h-16 w-16 animate-spin text-slate-400 mx-auto' />
            <p className='text-slate-600 dark:text-slate-400 font-medium'>
              Verifying permissions...
            </p>
          </div>
        </div>
      )
    );
  }

  // User has required role - render protected content
  if (status === 'authenticated') {
    const user = session.user;
    const allowedRoles = Array.isArray(requiredRole)
      ? requiredRole
      : [requiredRole];
    const hasRequiredRole = allowedRoles.includes(user.role as UserRole);
    if (hasRequiredRole) {
      return <>{children}</>;
    }
  }

  return null;
};

export { RoleGuard };