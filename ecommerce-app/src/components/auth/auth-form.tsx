'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppDispatch } from '@/lib/store/hooks';
import { login, signup } from '@/lib/store/thunks/authThunks';
import { showToast } from '@/lib/store/thunks/uiThunks';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useCallback, useState, useTransition } from 'react';

type AuthMode = 'login' | 'signup' | 'forgot';

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

  // Password validation (skip for forgot password)
  if (mode !== 'forgot') {
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < PASSWORD_MIN_LENGTH) {
      errors.password = `Password must be at least ${PASSWORD_MIN_LENGTH} characters`;
    }
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
 * Authentication form component with login, signup, and password reset
 */
export const AuthForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

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

    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        const result = await dispatch(login(formData.email, formData.password));

        if (!result.success) {
          setServerError(result.message || 'Invalid email or password');
        } else {
          startTransition(() => {
            router.push('/');
          });
        }
      } else if (mode === 'signup') {
        const result = await dispatch(
          signup(formData.name, formData.email, formData.password)
        );

        if (!result.success) {
          setServerError(result.message || 'Failed to create account');
        } else {
          startTransition(() => {
            router.push('/');
          });
        }
      } else if (mode === 'forgot') {
        // Password reset logic
        dispatch(
          showToast(
            `If an account exists for ${formData.email}, a reset link has been sent.`,
            'info'
          )
        );
        setMode('login');
        setFormData({ name: '', email: '', password: '', confirmPassword: '' });
      }
    } catch (error) {
      console.error('Auth error:', error);
      setServerError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = isSubmitting || isPending;

  return (
    <div className='flex min-h-[70vh] items-center justify-center bg-slate-50 p-4 dark:bg-slate-900'>
      <div className='w-full max-w-md'>
        <div className='rounded-xl border bg-white p-6 shadow-lg dark:bg-slate-900 dark:border-slate-600'>
          {/* Tab Navigation (Login/Signup) */}
          {mode !== 'forgot' && (
            <div className='flex border-b dark:border-slate-800'>
              <button
                type='button'
                onClick={() => handleModeChange('login')}
                className={`flex-1 p-4 font-medium transition-colors ${
                  mode === 'login'
                    ? 'text-slate-900 border-b-2 border-slate-900 dark:text-white dark:border-white'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
                disabled={isLoading}
              >
                Login
              </button>
              <button
                type='button'
                onClick={() => handleModeChange('signup')}
                className={`flex-1 p-4 font-medium transition-colors ${
                  mode === 'signup'
                    ? 'text-slate-900 border-b-2 border-slate-900 dark:text-white dark:border-white'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
                disabled={isLoading}
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className='p-8'>
            <AnimatePresence mode='wait'>
              <motion.div
                key={mode}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div className='space-y-4'>
                  {/* Title */}
                  <h2 className='text-2xl font-bold text-center dark:text-white'>
                    {mode === 'login' && 'Welcome Back'}
                    {mode === 'signup' && 'Create an Account'}
                    {mode === 'forgot' && 'Reset Password'}
                  </h2>

                  {/* Server Error */}
                  {serverError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2 dark:bg-red-900 dark:border-red-900 dark:text-red-300'
                    >
                      <AlertCircle className='h-4 w-4 flex-shrink-0' />
                      <span>{serverError}</span>
                    </motion.div>
                  )}

                  {/* Name Field (Signup only) */}
                  {mode === 'signup' && (
                    <div>
                      <Input
                        name='name'
                        placeholder='Full Name'
                        value={formData.name}
                        onChange={handleChange}
                        disabled={isLoading}
                        aria-invalid={!!errors.name}
                        aria-describedby={
                          errors.name ? 'name-error' : undefined
                        }
                      />
                      {errors.name && (
                        <p
                          id='name-error'
                          className='text-red-500 text-xs mt-1'
                        >
                          {errors.name}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Email Field */}
                  <div>
                    <Input
                      name='email'
                      type='email'
                      placeholder='Email Address'
                      value={formData.email}
                      onChange={handleChange}
                      disabled={isLoading}
                      aria-invalid={!!errors.email}
                      aria-describedby={
                        errors.email ? 'email-error' : undefined
                      }
                    />
                    {errors.email && (
                      <p id='email-error' className='text-red-500 text-xs mt-1'>
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Password Field (not for forgot password) */}
                  {mode !== 'forgot' && (
                    <div>
                      <Input
                        name='password'
                        type='password'
                        placeholder='Password'
                        value={formData.password}
                        onChange={handleChange}
                        disabled={isLoading}
                        aria-invalid={!!errors.password}
                        aria-describedby={
                          errors.password ? 'password-error' : undefined
                        }
                      />
                      {errors.password && (
                        <p
                          id='password-error'
                          className='text-red-500 text-xs mt-1'
                        >
                          {errors.password}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Confirm Password Field (Signup only) */}
                  {mode === 'signup' && (
                    <div>
                      <Input
                        name='confirmPassword'
                        type='password'
                        placeholder='Confirm Password'
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        disabled={isLoading}
                        aria-invalid={!!errors.confirmPassword}
                        aria-describedby={
                          errors.confirmPassword
                            ? 'confirm-password-error'
                            : undefined
                        }
                      />
                      {errors.confirmPassword && (
                        <p
                          id='confirm-password-error'
                          className='text-red-500 text-xs mt-1'
                        >
                          {errors.confirmPassword}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button
                    type='submit'
                    className='w-full mt-4 '
                    size='lg'
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className='h-4 w-4 animate-spin mr-2' />
                        {mode === 'login' && 'Logging in...'}
                        {mode === 'signup' && 'Creating account...'}
                        {mode === 'forgot' && 'Sending...'}
                      </>
                    ) : (
                      <>
                        {mode === 'login' && 'Login'}
                        {mode === 'signup' && 'Create Account'}
                        {mode === 'forgot' && 'Send Reset Link'}
                      </>
                    )}
                  </Button>

                  {/* Forgot Password Link */}
                  {mode === 'login' && (
                    <div className='text-center'>
                      <Button
                        type='button'
                        variant='link'
                        size='sm'
                        onClick={() => handleModeChange('forgot')}
                        disabled={isLoading}
                      >
                        Forgot Password?
                      </Button>
                    </div>
                  )}

                  {/* Back to Login Link */}
                  {mode === 'forgot' && (
                    <div className='text-center'>
                      <Button
                        type='button'
                        variant='link'
                        size='sm'
                        onClick={() => handleModeChange('login')}
                        disabled={isLoading}
                      >
                        Back to Login
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
};
