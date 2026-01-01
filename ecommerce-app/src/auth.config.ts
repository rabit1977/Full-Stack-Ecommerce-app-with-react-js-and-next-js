import type { NextAuthConfig } from "next-auth";
import { prisma } from "@/lib/db";

export const authConfig = {
  pages: {
    signIn: '/auth/sign-in',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) { // This block runs only on sign-in
        token.id = user.id;
        token.role = user.role;
        // On sign-in, fetch the wishlist from the DB
        try {
          const wishlistItems = await prisma.wishlistItem.findMany({
            where: { userId: user.id },
            select: { productId: true },
          });
          token.wishlist = wishlistItems.map(item => item.productId);
        } catch (error) {
          console.error("Database error fetching wishlist. Have you run 'npx prisma migrate dev'?", error);
          // Default to empty wishlist if DB query fails
          token.wishlist = [];
        }
      }
      return token;
    },
    async session({ session, token }) {
      // Add user ID, role, and wishlist to session
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.wishlist = token.wishlist as string[];
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnProtected = nextUrl.pathname.startsWith('/account') || nextUrl.pathname.startsWith('/checkout');
      
      if (isOnProtected) {
        if (isLoggedIn) return true;
        return false; // Redirect to login
      }
      return true;
    },
  },
  providers: [], // Configured in auth.ts
} satisfies NextAuthConfig;
