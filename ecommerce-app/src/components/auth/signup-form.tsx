'use client';

import { signupAction } from '@/actions/auth-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Eye, EyeOff, KeyRound, Loader2, Lock, Mail, Sparkles, User } from 'lucide-react';
import { useActionState, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

// Password minimum length is 6 (used in getPasswordStrength)

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
  if (score <= 4) return { score, label: 'Strong', color: 'bg-blue-500' };
  return { score, label: 'Excellent', color: 'bg-primary' };
};

export function SignUpForm({ onSuccess }: { onSuccess: (email: string, password: string) => void }) {
  const [state, formAction, isPending] = useActionState(signupAction, null);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // We need to track email/password to pass to login on success
  // But useActionState handles the submission.
  // We can capture the values using standard state or Refs if we want to auto-login.
  // For simplicity, let's just track them in state as well or extract from formData in a wrapper? 
  // Wrapper is cleaner but let's stick to state for password strength visibility.
  const [formValues, setFormValues] = useState({ name: '', email: '', password: '' });

  const passwordStrength = useMemo(
    () => getPasswordStrength(formValues.password),
    [formValues.password]
  );

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
      onSuccess(formValues.email, formValues.password);
    } else if (state?.message) {
      toast.error(state.message);
    }
  }, [state, onSuccess, formValues.email, formValues.password]);

  return (
    <form action={formAction} className="space-y-5">
      {state?.message && !state.success && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className='bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-xl text-sm flex items-start gap-3'
        >
          <AlertCircle className='h-5 w-5 shrink-0 mt-0.5' />
          <span>{state.message}</span>
        </motion.div>
      )}

      {/* Name Field */}
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
            required
            minLength={2}
            className='pl-11'
            onChange={(e) => setFormValues(v => ({ ...v, name: e.target.value }))}
          />
          <User className='absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
        </div>
      </div>

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
            required
            className='pl-11'
            onChange={(e) => setFormValues(v => ({ ...v, email: e.target.value }))}
          />
          <Mail className='absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
        </div>
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
            required
            minLength={6}
            className='pl-11 pr-11'
            value={formValues.password}
            onChange={(e) => {
              setFormValues(v => ({ ...v, password: e.target.value }));
              setPassword(e.target.value);
            }}
          />
          <Lock className='absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
          <button
            type='button'
            onClick={() => setShowPassword(!showPassword)}
            className='absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors'
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
          </button>
        </div>
        
        {/* Password Strength */}
        {formValues.password && (
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

      {/* Confirm Password (client-side validation only for visual, but we rely on server or manual check) */}
      {/* Since useActionState submits raw FormData, we can't easily validate "confirmPassword" unless we check it here or send it to server.
          Let's just validate on change or submit event interception? 
          Actually, let's keep it simple and add it to FormData via hidden input if server needed it, 
          but server action doesn't check confirmPassword currently.
          We can add client-side check by wrapping the action?
      */}
      <div className='space-y-2'>
        <label htmlFor='confirmPassword' className='form-label'>
          <CheckCircle2 className='h-4 w-4 text-muted-foreground' />
          Confirm Password
        </label>
        <div className='relative'>
          <Input
            id='confirmPassword'
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder='••••••••'
            required
            className='pl-11 pr-11'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <CheckCircle2 className='absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
          <button
            type='button'
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className='absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors'
            tabIndex={-1}
          >
            {showConfirmPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
          </button>
        </div>
        {confirmPassword && password !== confirmPassword && (
           <p className='text-destructive text-xs flex items-center gap-1'>
             <AlertCircle className='h-3 w-3' />
             Passwords do not match
           </p>
        )}
      </div>

      <Button
        type='submit'
        className='w-full h-12 text-base font-semibold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300'
        size='lg'
        disabled={isPending || (password !== confirmPassword && confirmPassword.length > 0)}
      >
        {isPending ? (
          <>
            <Loader2 className='h-5 w-5 animate-spin mr-2' />
            Creating account...
          </>
        ) : (
          <>
            <Sparkles className='h-4 w-4 mr-2' />
            Create Account
          </>
        )}
      </Button>
    </form>
  );
}
