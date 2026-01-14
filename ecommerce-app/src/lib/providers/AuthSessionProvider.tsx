'use client';

import { syncUserData } from '@/actions/sync-user-actions';
import { useAppDispatch } from '@/lib/store/hooks';
import { setCurrentUser } from '@/lib/store/slices/userSlice';
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
    if (status === 'authenticated' && session?.user) {
      const syncUserState = async () => {
        try {
          // Call server action to fetch cart and saved items
          const { cart, savedForLater } = await syncUserData(session.user.id);

          // Cache user from session in Redux (cast to User type)
          // session.user is a SafeUser from next-auth, can cast for UI purposes
          dispatch(setCurrentUser(session.user as any));

          // Set wishlist
          dispatch(setWishlist(session.user.wishlist || []));
        } catch (error) {
          console.error('Failed to sync user state:', error);
        }
      };

      syncUserState();
    }
  }, [session, status, dispatch]);

  return null;
}
