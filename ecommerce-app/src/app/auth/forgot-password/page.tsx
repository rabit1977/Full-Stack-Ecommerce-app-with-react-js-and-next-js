'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Loader2, Mail, Zap } from 'lucide-react';
import Link from 'next/link';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch('/api/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || 'Something went wrong');
          return;
        }

        setIsSubmitted(true);
        toast.success('Password reset email sent!');
      } catch {
        setError('Failed to send reset email. Please try again.');
      }
    });
  };

  return (
    <div className='page-wrapper flex min-h-[80vh] items-center justify-center p-4'>
      <div className='w-full max-w-md'>
        {/* Logo Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className='text-center mb-8'
        >
          <div className='inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary shadow-xl shadow-primary/25 mb-4'>
            <Zap className='h-8 w-8 text-primary-foreground' />
          </div>
          <h1 className='text-2xl font-bold text-foreground'>Reset Password</h1>
          <p className='text-muted-foreground mt-1'>
            Enter your email to receive reset instructions
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className='rounded-2xl border border-border bg-card shadow-xl p-6 sm:p-8'
        >
          {isSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className='text-center py-8'
            >
              <div className='w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6'>
                <CheckCircle2 className='h-8 w-8 text-primary' />
              </div>
              <h2 className='text-xl font-semibold text-foreground mb-2'>
                Check your email
              </h2>
              <p className='text-muted-foreground mb-6'>
                We&apos;ve sent password reset instructions to <strong>{email}</strong>
              </p>
              <p className='text-sm text-muted-foreground mb-6'>
                Didn&apos;t receive the email? Check your spam folder or try again.
              </p>
              <div className='flex flex-col gap-3'>
                <Button
                  variant='outline'
                  onClick={() => setIsSubmitted(false)}
                  className='w-full rounded-xl'
                >
                  Try another email
                </Button>
                <Button asChild className='w-full rounded-xl'>
                  <Link href='/auth'>
                    <ArrowLeft className='h-4 w-4 mr-2' />
                    Back to login
                  </Link>
                </Button>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className='space-y-6'>
              <div className='space-y-2'>
                <label htmlFor='email' className='form-label'>
                  <Mail className='h-4 w-4 text-muted-foreground' />
                  Email Address
                </label>
                <div className='relative'>
                  <Input
                    id='email'
                    type='email'
                    placeholder='you@example.com'
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    disabled={isPending}
                    className='pl-11'
                  />
                  <Mail className='absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                </div>
                {error && (
                  <p className='text-destructive text-sm'>{error}</p>
                )}
              </div>

              <Button
                type='submit'
                className='w-full h-12 text-base font-semibold rounded-xl shadow-lg shadow-primary/20'
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className='h-5 w-5 animate-spin mr-2' />
                    Sending...
                  </>
                ) : (
                  'Send Reset Instructions'
                )}
              </Button>

              <div className='text-center'>
                <Link
                  href='/auth'
                  className='text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1'
                >
                  <ArrowLeft className='h-4 w-4' />
                  Back to login
                </Link>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
