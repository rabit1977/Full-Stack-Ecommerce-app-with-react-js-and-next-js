'use client';

import { syncUserData } from '@/actions/sync-user-actions';
import { useAppDispatch } from '@/lib/store/hooks';
import { setUser } from '@/lib/store/slices/userSlice';
import { SessionProvider, useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { setWishlist } from '../store/slices/wishlistSlice';

interface AppUser {
  id: string;
  email: string | null;
  name: string | null;
  role: string;
  wishlist: string[];
  cart: string[];
  savedForLater: string[];
  helpfulReviews: string[];
}

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
      const syncUserState = async () => {
        try {
          // Call server action to fetch cart and saved items
          const { cart, savedForLater } = await syncUserData(session.user.id);

          const user: AppUser = {
            id: session.user.id,
            email: session.user.email || null,
            name: session.user.name || 'User',
            role: session.user.role || 'CUSTOMER',
            wishlist: session.user.wishlist || [],
            cart,
            savedForLater,
            helpfulReviews: [],
          };

          dispatch(setUser(user));
          dispatch(setWishlist(user.wishlist));
        } catch (error) {
          console.error('Failed to sync user state:', error);
        }
      };

      syncUserState();
    }
  }, [session, status, dispatch]);

  return null;
}
