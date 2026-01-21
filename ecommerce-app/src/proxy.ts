import NextAuth from 'next-auth';
import { NextRequest } from 'next/server';
import { authConfig } from './auth.config';

// Wrap the auth middleware to trigger session callback on every request
const authMiddleware = NextAuth(authConfig).auth;

export default async function middleware(request: NextRequest) {
  // Call auth to trigger session callback which fetches fresh role from DB
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return authMiddleware(request as any);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\.png$|.*\.jpg$|.*\.svg$).*)'],
};
