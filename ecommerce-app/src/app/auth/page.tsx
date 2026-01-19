// app/auth/page.tsx
import { AuthForm } from '@/components/auth/auth-form';
import { ReverseAuthGuard } from '@/components/auth/ReverseAuthGuard';

/**
 * Authentication Page
 *
 * Handles both login and signup
 * Redirects authenticated users to home page
 */
export default function AuthPage() {
  return (
    <ReverseAuthGuard redirectTo='/'>
      <AuthForm />
    </ReverseAuthGuard>
  );
}
