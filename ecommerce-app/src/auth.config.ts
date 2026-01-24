import { UserRole } from '@/generated/prisma/client';
import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/auth/sign-in',
  },
  callbacks: {
    async jwt({ token, user, trigger, session, account }) {
      // 1. Initial sign-in - for credentials, user.id is the DB id
      //    For OAuth, user.id is the provider's id, so we need to look up by email
      if (user) {
        // For OAuth providers, look up the database user by email
        if (account?.provider === 'google' || account?.provider === 'github') {
          try {
            const { prisma } = await import('@/lib/db');
            
            // Find or create user in database
            let dbUser = await prisma.user.findUnique({ 
              where: { email: user.email! },
              select: { id: true, role: true, name: true, image: true, bio: true, createdAt: true },
            });
            
            if (!dbUser) {
              // Create user if they don't exist (first OAuth sign-in)
              dbUser = await prisma.user.create({
                data: {
                  email: user.email!,
                  name: user.name,
                  image: user.image,
                  role: 'USER',
                },
                select: { id: true, role: true, name: true, image: true, bio: true, createdAt: true },
              });
            } else {
              // Update image on subsequent OAuth sign-ins
              await prisma.user.update({
                where: { email: user.email! },
                data: { image: user.image || dbUser.image },
              });
            }
            
            // Set token with database user info
            token.id = dbUser.id;
            token.role = dbUser.role as UserRole;
            token.name = dbUser.name;
            token.image = dbUser.image;
            token.bio = dbUser.bio;
            token.createdAt = dbUser.createdAt;
          } catch (error) {
            console.error('[JWT Callback] OAuth user lookup/creation error:', error);
          }
        } else {
          // Credentials provider - user.id is already the database ID
          token.id = user.id;
          token.role = user.role as UserRole;
          token.bio = user.bio;
          token.image = user.image;
          token.createdAt = user.createdAt;
        }
      }

      // 2. Handle session updates (e.g. from updateProfileAction)
      if (trigger === 'update' && session?.user) {
        return { ...token, ...session.user };
      }

      // 3. Fresh data fetch from DB on subsequent requests (not initial sign-in)
      // Only fetch if token.id exists and is a valid CUID-like string
      if (!user && token.id && typeof token.id === 'string' && token.id.length > 10) {
        try {
          const { prisma } = await import('@/lib/db');
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id },
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
