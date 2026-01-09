'use client';

import { updateUserAction } from '@/actions/auth-actions';
import { UserForm, EditUserFormValues } from '@/components/admin/user-form';
import { User } from '@prisma/client';
import { useTransition } from 'react';
import { toast } from 'sonner';

interface EditUserFormProps {
  user: User;
}

export function EditUserForm({ user }: EditUserFormProps) {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (values: EditUserFormValues) => {
    startTransition(async () => {
      const result = await updateUserAction(user.id, values);
      if (!result.success) {
        toast.error(result.message || 'Failed to update user');
      } else {
        toast.success('User updated successfully!');
      }
    });
  };

  return (
    <UserForm user={user} onSubmit={handleSubmit} isSubmitting={isPending} />
  );
}