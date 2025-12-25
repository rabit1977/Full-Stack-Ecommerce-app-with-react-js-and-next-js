'use client';

import { useAppSelector } from '@/lib/store/hooks';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

interface ReverseAuthGuardProps {
  children: React.ReactNode;
  /**
   * Redirect authenticated users to this path
   */
  redirectTo?: string;
}

/**
 * Reverse auth guard - redirects authenticated users away from public pages
 * Useful for login/signup pages
 */
const ReverseAuthGuard: React.FC<ReverseAuthGuardProps> = ({ 
  children, 
  redirectTo = '/' 
}) => {
  const { user } = useAppSelector((state) => state.user);
  const router = useRouter();

  useEffect(() => {
    // If user is authenticated, redirect away from public auth pages
    if (user) {
      router.replace(redirectTo);
    }
  }, [user, router, redirectTo]);

  // If user is authenticated, don't render anything (will redirect)
  if (user) {
    return null;
  }

  // User is not authenticated - show auth form
  return <>{children}</>;
};

export { ReverseAuthGuard };