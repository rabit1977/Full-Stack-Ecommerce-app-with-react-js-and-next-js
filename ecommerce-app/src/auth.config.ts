import { UserRole } from '@/generated/prisma/client';
import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/auth/sign-in',
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // 1. Initial sign-in
      if (user) {
        token.id = user.id;
        token.role = user.role as UserRole;
        token.bio = user.bio;
        token.image = user.image;
        token.createdAt = user.createdAt;
      }

      // 2. Handle session updates (e.g. from updateProfileAction)
      if (trigger === 'update' && session?.user) {
        return { ...token, ...session.user };
      }

      // 3. Fresh role fetch from DB on every call
      if (token.id) {
        try {
          // We use a dynamic import for prisma to avoid environment issues in middleware
          const { prisma } = await import('@/lib/db');
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: { role: true, name: true, image: true, bio: true },
          });

          if (dbUser) {
            token.role = dbUser.role as UserRole;
            token.name = dbUser.name;
            token.image = dbUser.image;
            token.bio = dbUser.bio;
          }
        } catch (error) {
          console.error('[JWT Callback] Error fetching fresh user data:', error);
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
        session.user.role = (token.role as UserRole) || 'USER';
        session.user.bio = (token.bio as string | null) || null;
        session.user.image = (token.image as string | null) || (token.picture as string | null);
        session.user.createdAt = token.createdAt as Date;
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
