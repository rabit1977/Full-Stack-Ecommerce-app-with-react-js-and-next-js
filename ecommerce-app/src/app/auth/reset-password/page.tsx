'use client';

import { resetPasswordAction } from '@/actions/auth-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowRight, CheckCircle2, Eye, EyeOff, Lock, Zap } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState, useTransition } from 'react';
import { toast } from 'sonner';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  if (!token) {
    return (
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 text-destructive mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold">Invalid Link</h1>
        <p className="text-muted-foreground">This password reset link is invalid or has expired.</p>
        <Button asChild variant="secondary" className="mt-4">
          <Link href="/auth/forgot-password">Request a new link</Link>
        </Button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    startTransition(async () => {
      try {
        const result = await resetPasswordAction({ token, password });
        
        if (result.success) {
          toast.success('Password reset successfully!');
          router.push('/auth');
        } else {
          setError(result.error || 'Failed to reset password');
        }
      } catch (err) {
        console.error(err);
        setError('Something went wrong. Please try again.');
      }
    });
  };

  return (
    <div className='w-full max-w-md'>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className='text-center mb-8'
      >
        <div className='inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary shadow-xl shadow-primary/25 mb-4'>
          <Zap className='h-8 w-8 text-primary-foreground' />
        </div>
        <h1 className='text-2xl font-bold text-foreground'>Set New Password</h1>
        <p className='text-muted-foreground mt-1'>
          Enter your new password below
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className='rounded-2xl border border-border bg-card shadow-xl p-6 sm:p-8'
      >
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <label className='form-label'>New Password</label>
            <div className='relative'>
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='pl-11 pr-10'
                placeholder='••••••••'
                required
              />
              <Lock className='absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
              >
                {showPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
              </button>
            </div>
          </div>

          <div className='space-y-2'>
            <label className='form-label'>Confirm Password</label>
            <div className='relative'>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className='pl-11'
                placeholder='••••••••'
                required
              />
              <CheckCircle2 className='absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <Button 
            type='submit' 
            className='w-full h-11 text-base font-semibold shadow-lg shadow-primary/20'
            disabled={isPending}
          >
            {isPending ? 'Resetting...' : 'Reset Password'}
            {!isPending && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className='page-wrapper flex min-h-[80vh] items-center justify-center p-4'>
      <Suspense fallback={<div className="animate-pulse w-full max-w-md h-96 bg-secondary/20 rounded-2xl" />}>
        <ResetPasswordContent />
      </Suspense>
    </div>
  );
}
