// app/admin/users/create/page.tsx
'use client';

import { createUserAction } from '@/actions/user-actions';
import { UserForm } from '@/components/admin/user-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Info, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { toast } from 'sonner';

/**
 * Form values interface
 */
interface CreateUserFormValues {
  name: string;
  email: string;
  password: string;
  role: 'USER' | 'ADMIN';
  bio?: string;
}

/**
 * Create User Page Component
 * 
 * Admin interface for creating new user accounts
 * Uses React 19 patterns for optimal performance
 */
export default function CreateUserPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  /**
   * Handle form submission
   */
  const handleSubmit = async (values: CreateUserFormValues) => {
    startTransition(async () => {
      try {
        const result = await createUserAction({
          name: values.name,
          email: values.email,
          password: values.password,
          role: values.role,
          bio: values.bio,
        });

        if (result.success) {
          toast.success(result.message || 'User created successfully');
          router.push('/admin/users');
          router.refresh(); // Refresh the page data
        } else {
          toast.error(result.error || 'Failed to create user');
        }
      } catch (error) {
        console.error('Create user error:', error);
        toast.error(
          error instanceof Error ? error.message : 'An unexpected error occurred'
        );
      }
    });
  };

  return (
    <div className='max-w-4xl mx-auto pb-20'>
      <div className='mb-8 animate-in fade-in slide-in-from-top-4 duration-500'>
        <Button variant='ghost' asChild className='hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full mb-6 -ml-3'>
           <Link href='/admin/users'>
             <ArrowLeft className='h-4 w-4 mr-2' />
             Back to Users
           </Link>
        </Button>
        <div className='flex items-center gap-4'>
           <div className='h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center shadow-lg shadow-primary/25'>
             <UserPlus className='h-6 w-6 text-white' />
           </div>
           <div>
              <h1 className='text-3xl sm:text-4xl font-black tracking-tight text-foreground'>
                Create New User
              </h1>
              <p className='text-lg text-muted-foreground font-medium mt-1'>
                Add a new user account to the system
              </p>
           </div>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Form Card */}
        <div className='glass-card rounded-[2.5rem] p-8 sm:p-10 shadow-xl shadow-black/5 border border-border/60 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100'>
            <UserForm 
              onSubmit={handleSubmit} 
              isSubmitting={isPending}
            />
        </div>

        {/* Info Card */}
        <div className='p-6 rounded-3xl border border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20 max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200'>
          <h3 className='text-base font-bold flex items-center gap-2 mb-3 text-blue-800 dark:text-blue-300'>
             <Info className="h-4 w-4" />
             Password Requirements
          </h3>
          <ul className='list-disc list-inside space-y-1 text-sm text-blue-700/80 dark:text-blue-300/80'>
             <li>Minimum 6 characters long</li>
             <li>Users will be able to change their password after first login</li>
             <li>Admin accounts have elevated privileges</li>
          </ul>
        </div>
      </div>
    </div>
  );
}