// app/admin/users/new/page.tsx
'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { UserForm, CreateUserFormValues } from '@/components/admin/user-form';
import { Button } from '@/components/ui/button';
import { createUserAction } from '@/actions/auth-actions';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

export default function NewUserPage() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = async (values: CreateUserFormValues) => {
    startTransition(async () => {
      try {
        const result = await createUserAction(
          values.name,
          values.email,
          values.password,
          values.role as 'admin' | 'customer'
        );

        if (result.success) {
          toast.success(result.message || 'User created successfully');
          router.push('/admin/users');
          // Optionally, revalidate the path if you're caching user lists
          // revalidatePath('/admin/users');
        } else {
          toast.error(result.message || 'Failed to create user');
        }
      } catch (error) {
        toast.error('An error occurred while creating the user');
        console.error('Create user error:', error);
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <Button
          variant="ghost"
          onClick={() => router.push('/admin/users')}
          className="hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Users
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight dark:text-white">
            Add New User
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Create a new customer or admin account
          </p>
        </div>
      </div>

      {/* Form - user is undefined/null for create mode */}
      <UserForm onSubmit={handleSubmit} isSubmitting={isPending} />
    </div>
  );
}