'use client';

import { UserForm } from '@/components/admin/user-form';
import { updateUser } from '@/lib/actions/user-actions';

import { User } from '@/lib/types';
import { useTransition } from 'react';
import { toast } from 'sonner';

interface EditUserFormProps {
  user: User;
}

export function EditUserForm({ user }: EditUserFormProps) {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (values: { name: string; email: string; role: 'admin' | 'customer'; password?: string }) => {
    startTransition(async () => {
      const result = await updateUser(user.id, values);
      if (!result.success) {
        toast.error(result.error);
      } else {
        toast.success('User updated successfully!');
      }
    });
  };

  return (
    <UserForm user={user} onSubmit={handleSubmit} isSubmitting={isPending} />
  );
}
