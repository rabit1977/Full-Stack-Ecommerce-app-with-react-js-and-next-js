'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, Loader2 } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useState, useTransition } from 'react';
import { toast } from 'sonner';

type AuthMode = 'login' | 'signup';

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

/**
 * Email validation regex
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Password requirements
 */
const PASSWORD_MIN_LENGTH = 6;

/**
 * Validate form fields based on current mode
 */
const validateForm = (formData: FormData, mode: AuthMode): FormErrors => {
  const errors: FormErrors = {};

  // Email validation
  if (!formData.email.trim()) {
    errors.email = 'Email is required';
  } else if (!EMAIL_REGEX.test(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  // Password validation
  if (!formData.password) {
    errors.password = 'Password is required';
  } else if (formData.password.length < PASSWORD_MIN_LENGTH) {
    errors.password = `Password must be at least ${PASSWORD_MIN_LENGTH} characters`;
  }

  // Signup-specific validation
  if (mode === 'signup') {
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
  }

  return errors;
};

/**
 * Modern Authentication Form Component
 *
 * Uses NextAuth for authentication without Redux
 * React 19 patterns with useTransition
 */
export function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Get callback URL from query params or default to home
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  // Form state
  const [mode, setMode] = useState<AuthMode>('login');
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Handle input changes
   */
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field when user types
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setServerError('');
  }, []);

  /**
   * Switch between auth modes
   */
  const handleModeChange = useCallback((newMode: AuthMode) => {
    setMode(newMode);
    setErrors({});
    setServerError('');
  }, []);

  /**
   * Handle login
   */
  const handleLogin = async () => {
    setIsSubmitting(true);
    setServerError('');

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setServerError('Invalid email or password');
        toast.error('Invalid email or password');
      } else if (result?.ok) {
        toast.success('Welcome back!');
        startTransition(() => {
          router.push(callbackUrl);
          router.refresh();
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      setServerError('An unexpected error occurred');
      toast.error('Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle signup
   */
  const handleSignup = async () => {
    setIsSubmitting(true);
    setServerError('');

    try {
      // Call your signup API endpoint
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setServerError(data.message || 'Failed to create account');
        toast.error(data.message || 'Signup failed');
        return;
      }

      // After successful signup, automatically log in
      toast.success('Account created! Logging you in...');

      const signInResult = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (signInResult?.ok) {
        toast.success('Welcome!');
        startTransition(() => {
          router.push(callbackUrl);
          router.refresh();
        });
      }
    } catch (error) {
      console.error('Signup error:', error);
      setServerError('An unexpected error occurred');
      toast.error('Signup failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');

    // Validate form
    const validationErrors = validateForm(formData, mode);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (mode === 'login') {
      await handleLogin();
    } else {
      await handleSignup();
    }
  };

  const isLoading = isSubmitting || isPending;

  return (
    <div className='flex min-h-[70vh] items-center justify-center bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4'>
      <div className='w-full max-w-md'>
        <div className='rounded-2xl border bg-white shadow-xl dark:bg-slate-900 dark:border-slate-700 overflow-hidden'>
          {/* Tab Navigation */}
          <div className='flex border-b dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50'>
            <button
              type='button'
              onClick={() => handleModeChange('login')}
              className={`flex-1 px-6 py-4 font-semibold transition-all ${
                mode === 'login'
                  ? 'text-primary border-b-2 border-primary bg-white dark:bg-slate-900'
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/50 dark:hover:bg-slate-900/50'
              }`}
              disabled={isLoading}
            >
              Login
            </button>
            <button
              type='button'
              onClick={() => handleModeChange('signup')}
              className={`flex-1 px-6 py-4 font-semibold transition-all ${
                mode === 'signup'
                  ? 'text-primary border-b-2 border-primary bg-white dark:bg-slate-900'
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/50 dark:hover:bg-slate-900/50'
              }`}
              disabled={isLoading}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className='p-8'>
            <AnimatePresence mode='wait'>
              <motion.div
                key={mode}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className='space-y-6'>
                  {/* Title */}
                  <div className='text-center'>
                    <h2 className='leading-tight'>
                      {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                    </h2>
                    <p className='text-muted-foreground mt-3 text-lg'>
                      {mode === 'login'
                        ? 'Enter your credentials to continue'
                        : 'Fill in your details to get started'}
                    </p>
                  </div>

                  {/* Server Error */}
                  {serverError && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className='bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm flex items-start gap-3'
                    >
                      <AlertCircle className='h-5 w-5 shrink-0 mt-0.5' />
                      <span>{serverError}</span>
                    </motion.div>
                  )}

                  {/* Name Field (Signup only) */}
                  {mode === 'signup' && (
                    <div className='space-y-2'>
                      <label htmlFor='name' className='text-sm font-medium'>
                        Full Name
                      </label>
                      <Input
                        id='name'
                        name='name'
                        placeholder='John Doe'
                        value={formData.name}
                        onChange={handleChange}
                        disabled={isLoading}
                        aria-invalid={!!errors.name}
                        aria-describedby={
                          errors.name ? 'name-error' : undefined
                        }
                        className='h-11'
                      />
                      {errors.name && (
                        <p id='name-error' className='text-destructive text-xs'>
                          {errors.name}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Email Field */}
                  <div className='space-y-2'>
                    <label htmlFor='email' className='text-sm font-medium'>
                      Email Address
                    </label>
                    <Input
                      id='email'
                      name='email'
                      type='email'
                      placeholder='you@example.com'
                      value={formData.email}
                      onChange={handleChange}
                      disabled={isLoading}
                      aria-invalid={!!errors.email}
                      aria-describedby={
                        errors.email ? 'email-error' : undefined
                      }
                      className='h-11'
                    />
                    {errors.email && (
                      <p id='email-error' className='text-destructive text-xs'>
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div className='space-y-2'>
                    <label htmlFor='password' className='text-sm font-medium'>
                      Password
                    </label>
                    <Input
                      id='password'
                      name='password'
                      type='password'
                      placeholder='••••••••'
                      value={formData.password}
                      onChange={handleChange}
                      disabled={isLoading}
                      aria-invalid={!!errors.password}
                      aria-describedby={
                        errors.password ? 'password-error' : undefined
                      }
                      className='h-11'
                    />
                    {errors.password && (
                      <p
                        id='password-error'
                        className='text-destructive text-xs'
                      >
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password Field (Signup only) */}
                  {mode === 'signup' && (
                    <div className='space-y-2'>
                      <label
                        htmlFor='confirmPassword'
                        className='text-sm font-medium'
                      >
                        Confirm Password
                      </label>
                      <Input
                        id='confirmPassword'
                        name='confirmPassword'
                        type='password'
                        placeholder='••••••••'
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        disabled={isLoading}
                        aria-invalid={!!errors.confirmPassword}
                        aria-describedby={
                          errors.confirmPassword
                            ? 'confirm-password-error'
                            : undefined
                        }
                        className='h-11'
                      />
                      {errors.confirmPassword && (
                        <p
                          id='confirm-password-error'
                          className='text-destructive text-xs'
                        >
                          {errors.confirmPassword}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button
                    type='submit'
                    className='w-full h-11 text-base font-semibold'
                    size='lg'
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className='h-5 w-5 animate-spin mr-2' />
                        {mode === 'login'
                          ? 'Logging in...'
                          : 'Creating account...'}
                      </>
                    ) : (
                      <>{mode === 'login' ? 'Login' : 'Create Account'}</>
                    )}
                  </Button>

                  {/* Additional Links */}
                  {mode === 'login' && (
                    <div className='text-center'>
                      <Button
                        type='button'
                        variant='link'
                        size='sm'
                        className='text-muted-foreground hover:text-primary'
                        onClick={() =>
                          toast.info('Password reset coming soon!')
                        }
                        disabled={isLoading}
                      >
                        Forgot your password?
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </form>
        </div>
      </div>
    </div>
  );
}
