import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

// Wrap the auth middleware to trigger session callback on every request
const authMiddleware = NextAuth(authConfig).auth;

export default async function middleware(request: any) {
  // Call auth to trigger session callback which fetches fresh role from DB
  return authMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\.png$|.*\.jpg$|.*\.svg$).*)'],
};
