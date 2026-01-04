'use client';

import { createUserAction } from '@/actions/auth-actions';
import { CreateUserFormValues, UserForm } from '@/components/admin/user-form';
import { useState } from 'react';
import { toast } from 'sonner';

export default function CreateUserPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateUser = async (values: CreateUserFormValues) => {
    setIsSubmitting(true);
    try {
      const result = await createUserAction(
        values.name,
        values.email,
        values.password,
        values.role as any
      );
      if (result.success) {
        toast.success('User created successfully.');
      } else {
        toast.error(result.message || 'An unknown error occurred.');
      }
    } catch (error) {
      toast.error('Failed to create user.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>Create New User</h1>
      <div className='max-w-2xl mx-auto'>
        <UserForm onSubmit={handleCreateUser} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
}