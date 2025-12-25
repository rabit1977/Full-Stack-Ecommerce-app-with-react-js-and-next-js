'use client';

import { useAppSelector } from '@/lib/store/hooks';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  /**
   * Optional redirect path (defaults to '/auth')
   */
  redirectTo?: string;
  /**
   * Optional loading component
   */
  fallback?: React.ReactNode;
}

/**
 * Auth guard component - protects routes from unauthenticated users
 * Handles redux-persist rehydration gracefully
 */
const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  redirectTo = '/auth',
  fallback 
}) => {
  const { user } = useAppSelector((state) => state.user);
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Handle initial authentication check
    let timeoutId: NodeJS.Timeout;

    const checkAuth = () => {
      // If user is undefined, we're still rehydrating from persist
      if (user === undefined) {
        timeoutId = setTimeout(checkAuth, 100);
        return;
      }

      // User is authenticated
      if (user) {
        setIsChecking(false);
        return;
      }

      // User is not authenticated - redirect
      if (user === null) {
        router.replace(redirectTo);
        return;
      }
    };

    checkAuth();

    // Cleanup timeout on unmount
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [user, router, redirectTo]);

  // Show loading state while checking authentication
  if (isChecking) {
    return fallback || (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-16 w-16 animate-spin text-slate-400 mx-auto" />
          <p className="text-slate-600 dark:text-slate-400">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  // User is authenticated - render children
  return <>{children}</>;
};

export default AuthGuard;