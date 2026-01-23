import { UserRole } from '@/generated/prisma/client';
import { prisma } from '@/lib/db';
import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/auth/sign-in',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // This block runs only on sign-in
        token.id = user.id;
        token.role = user.role as UserRole;
        token.bio = user.bio;
        token.helpfulReviews = user.helpfulReviews;
        token.createdAt = user.createdAt; // 🔥 Add createdAt to token

        // On sign-in, fetch the wishlist from the DB
        try {
          const wishlistItems = await prisma.wishlistItem.findMany({
            where: { userId: user.id },
            select: { productId: true },
          });
          token.wishlist = wishlistItems.map((item) => item.productId);
        } catch (error) {
          console.error(
            "Database error fetching wishlist. Have you run 'npx prisma migrate dev'?",
            error,
          );
          // Default to empty wishlist if DB query fails
          token.wishlist = [];
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
        session.user.role = (token.role as UserRole) || 'USER';
        session.user.bio = (token.bio as string | null) || null;
        session.user.image = (token.picture as string | null) || (token.image as string | null);
        session.user.createdAt = token.createdAt as Date;
        session.user.helpfulReviews = (token.helpfulReviews as string[]) || [];
        session.user.wishlist = (token.wishlist as string[]) || [];
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnProtected =
        nextUrl.pathname.startsWith('/account') ||
        nextUrl.pathname.startsWith('/checkout');

      if (isOnProtected) {
        if (isLoggedIn) return true;
        return false; // Redirect to login
      }
      return true;
    },
  },
  providers: [], // Configured in auth.ts
} satisfies NextAuthConfig;
