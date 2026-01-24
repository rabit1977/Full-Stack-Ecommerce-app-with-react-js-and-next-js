'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AnimatePresence, motion } from 'framer-motion';
import {
    AlertCircle,
    CheckCircle2,
    Eye,
    EyeOff,
    KeyRound,
    Loader2,
    Lock,
    Mail,
    Sparkles,
    User,
    Zap
} from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useMemo, useState, useTransition } from 'react';
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

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN_LENGTH = 6;

/**
 * Calculate password strength
 */
const getPasswordStrength = (password: string): { score: number; label: string; color: string } => {
  let score = 0;
  
  if (password.length >= 6) score += 1;
  if (password.length >= 10) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;

  if (score <= 1) return { score, label: 'Weak', color: 'bg-red-500' };
  if (score <= 2) return { score, label: 'Fair', color: 'bg-orange-500' };
  if (score <= 3) return { score, label: 'Good', color: 'bg-amber-500' };
  if (score <= 4) return { score, label: 'Strong', color: 'bg-emerald-500' };
  return { score, label: 'Excellent', color: 'bg-emerald-600' };
};

/**
 * Validate form fields based on current mode
 */
const validateForm = (formData: FormData, mode: AuthMode): FormErrors => {
  const errors: FormErrors = {};

  if (!formData.email.trim()) {
    errors.email = 'Email is required';
  } else if (!EMAIL_REGEX.test(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!formData.password) {
    errors.password = 'Password is required';
  } else if (formData.password.length < PASSWORD_MIN_LENGTH) {
    errors.password = `Password must be at least ${PASSWORD_MIN_LENGTH} characters`;
  }

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
 * Premium Authentication Form Component
 */
export function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const callbackUrl = searchParams.get('callbackUrl') || '/';

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordStrength = useMemo(
    () => getPasswordStrength(formData.password),
    [formData.password]
  );

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setServerError('');
  }, []);

  const handleModeChange = useCallback((newMode: AuthMode) => {
    setMode(newMode);
    setErrors({});
    setServerError('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  }, []);

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

  const handleSignup = async () => {
    setIsSubmitting(true);
    setServerError('');

    try {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');

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
    <div className='flex min-h-[80vh] items-center justify-center gradient-hero p-4'>
      <div className='w-full max-w-md'>
        {/* Logo Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className='text-center mb-8'
        >
          <div className='inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-xl shadow-primary/25 mb-4'>
            <Zap className='h-8 w-8 text-white' />
          </div>
          <h1 className='text-2xl font-bold text-foreground'>Electro Store</h1>
          <p className='text-muted-foreground mt-1'>Premium Electronics</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className='rounded-2xl border border-border/50 bg-card/95 backdrop-blur-xl shadow-2xl shadow-primary/5 overflow-hidden'
        >
          {/* Tab Navigation */}
          <div className='flex border-b border-border/50 bg-muted/30'>
            <button
              type='button'
              onClick={() => handleModeChange('login')}
              className={`flex-1 px-6 py-4 font-semibold transition-all relative ${
                mode === 'login'
                  ? 'text-primary bg-background'
                  : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
              }`}
              disabled={isLoading}
            >
              Login
              {mode === 'login' && (
                <motion.div
                  layoutId='authTab'
                  className='absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent'
                />
              )}
            </button>
            <button
              type='button'
              onClick={() => handleModeChange('signup')}
              className={`flex-1 px-6 py-4 font-semibold transition-all relative ${
                mode === 'signup'
                  ? 'text-primary bg-background'
                  : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
              }`}
              disabled={isLoading}
            >
              Sign Up
              {mode === 'signup' && (
                <motion.div
                  layoutId='authTab'
                  className='absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent'
                />
              )}
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className='p-6 sm:p-8'>
            <AnimatePresence mode='wait'>
              <motion.div
                key={mode}
                initial={{ opacity: 0, x: mode === 'login' ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: mode === 'login' ? 20 : -20 }}
                transition={{ duration: 0.2 }}
              >
                <div className='space-y-6'>
                  {/* Title */}
                  <div className='text-center'>
                    <h2 className='text-xl sm:text-2xl font-bold text-foreground'>
                      {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                    </h2>
                    <p className='text-muted-foreground mt-2'>
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
                      className='bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-xl text-sm flex items-start gap-3'
                    >
                      <AlertCircle className='h-5 w-5 shrink-0 mt-0.5' />
                      <span>{serverError}</span>
                    </motion.div>
                  )}

                  {/* Name Field (Signup only) */}
                  {mode === 'signup' && (
                    <div className='space-y-2'>
                      <label htmlFor='name' className='form-label'>
                        <User className='h-4 w-4 text-muted-foreground' />
                        Full Name
                      </label>
                      <div className='relative'>
                        <Input
                          id='name'
                          name='name'
                          placeholder='John Doe'
                          value={formData.name}
                          onChange={handleChange}
                          disabled={isLoading}
                          className='input-premium pl-11'
                        />
                        <User className='absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                      </div>
                      {errors.name && (
                        <p className='text-destructive text-xs flex items-center gap-1'>
                          <AlertCircle className='h-3 w-3' />
                          {errors.name}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Email Field */}
                  <div className='space-y-2'>
                    <label htmlFor='email' className='form-label'>
                      <Mail className='h-4 w-4 text-muted-foreground' />
                      Email Address
                    </label>
                    <div className='relative'>
                      <Input
                        id='email'
                        name='email'
                        type='email'
                        placeholder='you@example.com'
                        value={formData.email}
                        onChange={handleChange}
                        disabled={isLoading}
                        className='input-premium pl-11'
                      />
                      <Mail className='absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                    </div>
                    {errors.email && (
                      <p className='text-destructive text-xs flex items-center gap-1'>
                        <AlertCircle className='h-3 w-3' />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div className='space-y-2'>
                    <label htmlFor='password' className='form-label'>
                      <Lock className='h-4 w-4 text-muted-foreground' />
                      Password
                    </label>
                    <div className='relative'>
                      <Input
                        id='password'
                        name='password'
                        type={showPassword ? 'text' : 'password'}
                        placeholder='••••••••'
                        value={formData.password}
                        onChange={handleChange}
                        disabled={isLoading}
                        className='input-premium pl-11 pr-11'
                      />
                      <Lock className='absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                      <button
                        type='button'
                        onClick={() => setShowPassword(!showPassword)}
                        className='absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors'
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOff className='h-4 w-4' />
                        ) : (
                          <Eye className='h-4 w-4' />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className='text-destructive text-xs flex items-center gap-1'>
                        <AlertCircle className='h-3 w-3' />
                        {errors.password}
                      </p>
                    )}
                    
                    {/* Password Strength Indicator */}
                    {mode === 'signup' && formData.password && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className='space-y-2'
                      >
                        <div className='flex gap-1.5'>
                          {[1, 2, 3, 4, 5].map((level) => (
                            <div
                              key={level}
                              className={`h-1.5 flex-1 rounded-full transition-colors ${
                                level <= passwordStrength.score
                                  ? passwordStrength.color
                                  : 'bg-muted'
                              }`}
                            />
                          ))}
                        </div>
                        <p className='text-xs text-muted-foreground flex items-center gap-1'>
                          <KeyRound className='h-3 w-3' />
                          Password strength: <span className='font-medium'>{passwordStrength.label}</span>
                        </p>
                      </motion.div>
                    )}
                  </div>

                  {/* Confirm Password Field (Signup only) */}
                  {mode === 'signup' && (
                    <div className='space-y-2'>
                      <label htmlFor='confirmPassword' className='form-label'>
                        <CheckCircle2 className='h-4 w-4 text-muted-foreground' />
                        Confirm Password
                      </label>
                      <div className='relative'>
                        <Input
                          id='confirmPassword'
                          name='confirmPassword'
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder='••••••••'
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          disabled={isLoading}
                          className='input-premium pl-11 pr-11'
                        />
                        <CheckCircle2 className='absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                        <button
                          type='button'
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className='absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors'
                          tabIndex={-1}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className='h-4 w-4' />
                          ) : (
                            <Eye className='h-4 w-4' />
                          )}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className='text-destructive text-xs flex items-center gap-1'>
                          <AlertCircle className='h-3 w-3' />
                          {errors.confirmPassword}
                        </p>
                      )}
                      {formData.confirmPassword && formData.password === formData.confirmPassword && (
                        <p className='text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-1'>
                          <CheckCircle2 className='h-3 w-3' />
                          Passwords match
                        </p>
                      )}
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button
                    type='submit'
                    className='w-full h-12 text-base font-semibold rounded-xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/95 hover:to-primary shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300'
                    size='lg'
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className='h-5 w-5 animate-spin mr-2' />
                        {mode === 'login' ? 'Logging in...' : 'Creating account...'}
                      </>
                    ) : (
                      <>
                        <Sparkles className='h-4 w-4 mr-2' />
                        {mode === 'login' ? 'Login' : 'Create Account'}
                      </>
                    )}
                  </Button>

                  {/* Forgot Password */}
                  {mode === 'login' && (
                    <div className='text-center'>
                      <Button
                        type='button'
                        variant='link'
                        size='sm'
                        className='text-muted-foreground hover:text-primary'
                        onClick={() => toast.info('Password reset coming soon!')}
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

          {/* Footer */}
          <div className='px-6 sm:px-8 pb-6 text-center'>
            <p className='text-xs text-muted-foreground'>
              By continuing, you agree to our{' '}
              <a href='/terms' className='text-primary hover:underline'>Terms of Service</a>
              {' '}and{' '}
              <a href='/privacy' className='text-primary hover:underline'>Privacy Policy</a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
