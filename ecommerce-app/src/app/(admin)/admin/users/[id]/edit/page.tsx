'use client';

import { use, Suspense, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { UserForm } from '@/components/admin/user-form';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { updateUserFromAdmin } from '@/lib/store/thunks/authThunks';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import * as z from 'zod';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters.' })
    .optional()
    .or(z.literal('')),
  role: z.enum(['admin', 'customer'], { message: 'Please select a role.' }),
});

export type EditUserFormValues = z.infer<typeof formSchema>;

interface EditUserPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Edit user skeleton
 */
function EditUserSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}

/**
 * Edit user content
 */
function EditUserContent({ userId }: { userId: string }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isPending, startTransition] = useTransition();
  
  const user = useAppSelector((state) =>
    state.user.users.find((u) => u.id === userId)
  );

  const handleSubmit = async (values: EditUserFormValues) => {
    startTransition(async () => {
      try {
        const result = await dispatch(updateUserFromAdmin(userId, values));
        
        if (result.success) {
          toast.success('User updated successfully');
          router.push('/admin/users');
        } else {
          toast.error(result.message || 'Failed to update user');
        }
      } catch (error) {
        toast.error('An error occurred while updating the user');
        console.error('Update user error:', error);
      }
    });
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600 dark:text-slate-400">User not found</p>
        <Button onClick={() => router.push('/admin/users')} className="mt-4">
          Back to Users
        </Button>
      </div>
    );
  }

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
            Edit User
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Update user information for {user.name}
          </p>
        </div>
      </div>

      {/* Form */}
      <UserForm user={user} onSubmit={handleSubmit} isSubmitting={isPending} />
    </div>
  );
}

/**
 * Edit user page with Suspense
 */
export default function EditUserPage({ params }: EditUserPageProps) {
  const { id } = use(params);

  return (
    <Suspense fallback={<EditUserSkeleton />}>
      <EditUserContent userId={id} />
    </Suspense>
  );
}