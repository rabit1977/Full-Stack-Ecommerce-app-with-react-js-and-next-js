'use client';

import { useAppDispatch } from '@/lib/store/hooks';
import { setUser } from '@/lib/store/slices/userSlice';
import { User } from '@/lib/types';
import { SessionProvider, useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { setWishlist } from '../store/slices/wishlistSlice';

export function AuthSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}

export function AuthSync() {
  const { data: session, status } = useSession();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (status === 'authenticated' && session?.user && session.user.email) {
      // Sync NextAuth session to Redux state
      const user: User = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name || 'User',
        role: session.user.role || 'customer',
        wishlist: session.user.wishlist || [],
        // These are not on the session, initialize as empty
        cart: [],
        savedForLater: [],
        helpfulReviews: [],
      };
      dispatch(setUser(user));
      dispatch(setWishlist(user.wishlist));
    }
  }, [session, status, dispatch]);

  return null;
}
