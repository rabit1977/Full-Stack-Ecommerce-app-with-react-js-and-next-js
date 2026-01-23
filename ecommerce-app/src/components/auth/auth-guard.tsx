'use client';

import { Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

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
 */
const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  redirectTo = '/auth',
  fallback,
}) => {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace(redirectTo);
    }
  }, [status, router, redirectTo]);

  if (status === 'loading') {
    return (
      fallback || (
        <div className='flex min-h-[70vh] items-center justify-center'>
          <div className='text-center space-y-4'>
            <Loader2 className='h-16 w-16 animate-spin text-slate-400 mx-auto' />
            <p className='text-slate-600 dark:text-slate-400'>Loading...</p>
          </div>
        </div>
      )
    );
  }

  if (status === 'authenticated') {
    return <>{children}</>;
  }

  return null;
};

export default AuthGuard;