'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAppSelector } from '@/lib/store/hooks';
import { useAppDispatch } from '@/lib/store/hooks';
import { showToast } from '@/lib/store/thunks/uiThunks';

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
  const { user } = useAppSelector((state) => state.user);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isChecking, setIsChecking] = useState(true);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const checkRoleAccess = () => {
      // If user is undefined, we're still rehydrating
      if (user === undefined) {
        timeoutId = setTimeout(checkRoleAccess, 100);
        return;
      }

      // Prevent multiple redirects
      if (hasChecked) return;
      setHasChecked(true);

      // User is not authenticated
      if (!user) {
        dispatch(showToast('You must be logged in to access this page.', 'error'));
        router.replace(authRedirectTo);
        return;
      }

      // Check if user has required role
      const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
      const hasRequiredRole = allowedRoles.includes(user.role as UserRole);

      if (!hasRequiredRole) {
        dispatch(showToast(unauthorizedMessage, 'error'));
        router.replace(unauthorizedRedirectTo);
        return;
      }

      // User has required role - allow access
      setIsChecking(false);
    };

    checkRoleAccess();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [
    user,
    router,
    dispatch,
    hasChecked,
    requiredRole,
    authRedirectTo,
    unauthorizedRedirectTo,
    unauthorizedMessage,
  ]);

  // Show loading state
  if (isChecking) {
    return fallback || (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center space-y-4">
          <Loader2 className="h-16 w-16 animate-spin text-slate-400 mx-auto" />
          <p className="text-slate-600 dark:text-slate-400 font-medium">
            Verifying permissions...
          </p>
        </div>
      </div>
    );
  }

  // User has required role - render protected content
  return <>{children}</>;
};

export { RoleGuard };