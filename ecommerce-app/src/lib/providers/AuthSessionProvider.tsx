'use client';

import { useAppDispatch } from '@/lib/store/hooks';
import { setUser } from '@/lib/store/slices/userSlice';
import { User } from '@/lib/types';
import { SessionProvider, useSession } from 'next-auth/react';
import { useEffect } from 'react';

export function AuthSessionProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}

export function AuthSync() {
  const { data: session, status } = useSession();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (status === 'authenticated' && session?.user && session.user.email) {
      // Sync NextAuth session to Redux state
      const user: User = {
          id: (session.user as any).id || session.user.email, // Use ID from session or fallback to email
          email: session.user.email,
          name: session.user.name || 'User',
          role: (session.user as any).role || 'customer', // Get role from session
          cart: [],
          wishlist: [],
          savedForLater: [],
          helpfulReviews: [],
          createdAt: new Date().toISOString(),
      };
      dispatch(setUser(user));
    }
  }, [session, status, dispatch]);

  return null;
}
