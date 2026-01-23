// app/admin/users/create/page.tsx
'use client';

import { createUserAction } from '@/actions/user-actions';
import { UserForm } from '@/components/admin/user-form';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { ArrowLeft, UserPlus } from 'lucide-react';
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
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-3xl mx-auto space-y-6'>
        {/* Header */}
        <div className='space-y-4'>
          <Button variant='ghost' asChild>
            <Link href='/admin/users'>
              <ArrowLeft className='h-4 w-4 mr-2' />
              Back to Users
            </Link>
          </Button>
          
          <div className='flex items-center gap-3'>
            <div className='h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center'>
              <UserPlus className='h-6 w-6 text-primary' />
            </div>
            <div>
              <h1 className='text-3xl font-bold tracking-tight'>Create New User</h1>
              <p className='text-muted-foreground mt-1'>
                Add a new user account to the system
              </p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>
              Fill in the details below to create a new user account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UserForm 
              onSubmit={handleSubmit} 
              isSubmitting={isPending}
            />
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className='border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20'>
          <CardHeader>
            <CardTitle className='text-base'>Password Requirements</CardTitle>
          </CardHeader>
          <CardContent className='text-sm text-muted-foreground space-y-1'>
            <ul className='list-disc list-inside space-y-1'>
              <li>Minimum 6 characters long</li>
              <li>Users will be able to change their password after first login</li>
              <li>Admin accounts have elevated privileges</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}