import { prisma } from '@/lib/db';
import { UserRole } from '@prisma/client';
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
      // Add user ID, role, wishlist, and createdAt to session
      if (session.user && token.id) {
        session.user.id = token.id as string;

        // Fetch the latest role, bio, and createdAt from the database on every session check
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: {
              role: true,
              bio: true,
              helpfulReviews: true,
              createdAt: true, // 🔥 Fetch createdAt from database
            },
          });

          let userRole: UserRole = 'USER';
          if (dbUser?.role) {
            userRole = dbUser.role;
          } else if (token.role) {
            userRole = token.role as UserRole;
          }
          session.user.role = userRole;

          session.user.bio =
            dbUser?.bio || (token.bio as string | null) || null;

          // 🔥 Add createdAt to session (prefer DB value, fallback to token)
          session.user.createdAt =
            dbUser?.createdAt || (token.createdAt as Date);

          // Add helpfulReviews to session
          session.user.helpfulReviews =
            dbUser?.helpfulReviews || (token.helpfulReviews as string[]) || [];
        } catch (error) {
          console.error('Error fetching user data from database:', error);
          // Fallback to cached data if DB query fails
          session.user.role = (token.role as UserRole) || 'USER';
          session.user.bio = (token.bio as string | null) || null;
          session.user.createdAt = token.createdAt as Date; // 🔥 Fallback to token value
          session.user.helpfulReviews = (token.helpfulReviews as string[]) || [];
        }

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
