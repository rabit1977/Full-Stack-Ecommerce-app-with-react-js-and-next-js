// types/next-auth.d.ts
import { UserRole } from '@prisma/client';
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  /**
   * Extends the built-in session.user type
   */
  interface Session {
    user: {
      id: string;
      role: UserRole;
      bio?: string | null;
      wishlist: string[];
      createdAt: Date; // 🔥 Add createdAt here
    } & DefaultSession['user'];
  }

  /**
   * Extends the built-in user type (returned from authorize callback)
   */
  interface User {
    id: string;
    role: UserRole;
    bio?: string | null;
    createdAt: Date; // 🔥 Add createdAt here
  }
}

declare module 'next-auth/jwt' {
  /**
   * Extends the built-in JWT token type
   */
  interface JWT {
    id: string;
    role: UserRole;
    bio?: string | null;
    wishlist: string[];
    createdAt: Date; // 🔥 Add createdAt here
  }
}