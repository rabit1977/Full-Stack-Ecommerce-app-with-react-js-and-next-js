'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface ReverseAuthGuardProps {
  children: React.ReactNode;
  /**
   * Redirect authenticated users to this path
   */
  redirectTo?: string;
}

/**
 * Reverse Auth Guard - NextAuth Version
 * 
 * Redirects authenticated users away from public pages
 * Useful for login/signup pages
 */
export function ReverseAuthGuard({ 
  children, 
  redirectTo = '/' 
}: ReverseAuthGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // If user is authenticated, redirect away from auth pages
    if (status === 'authenticated' && session?.user) {
      router.replace(redirectTo);
    }
  }, [status, session, router, redirectTo]);

  // Show loading while checking auth status
  if (status === 'loading') {
    return (
      <div className='flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900'>
        <div className='text-center space-y-4'>
          <Loader2 className='h-12 w-12 animate-spin text-slate-400 mx-auto' />
          <p className='text-slate-600 dark:text-slate-400'>Loading...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated, don't render anything (will redirect)
  if (status === 'authenticated') {
    return (
      <div className='flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900'>
        <div className='text-center space-y-4'>
          <Loader2 className='h-12 w-12 animate-spin text-slate-400 mx-auto' />
          <p className='text-slate-600 dark:text-slate-400'>Redirecting...</p>
        </div>
      </div>
    );
  }

  // User is not authenticated - show auth form
  return <>{children}</>;
}