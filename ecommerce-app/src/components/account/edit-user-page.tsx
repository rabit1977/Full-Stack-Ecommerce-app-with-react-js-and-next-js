'use client';

import { updateProfileAction } from '@/actions/auth-actions';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { EditProfileFormValues, EditUserForm } from './edit-user-form';

export default function EditUserPage() {
  const { data: session, status, update } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdateProfile = async (values: EditProfileFormValues) => {
    setIsSubmitting(true);
    try {
      const result = await updateProfileAction(values);
      if (result.success) {
        toast.success('Profile updated successfully.');
        // Manually trigger a session update to reflect the changes
        await update({
          ...session,
          user: {
            ...session?.user,
            name: result.user?.name,
          },
        });
      } else {
        toast.error(result.message || 'An unknown error occurred.');
      }
    } catch (error) {
      toast.error('Failed to update profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'unauthenticated' || !session?.user) {
    return <div>Please sign in to view your profile.</div>;
  }

  // Use session user directly for the form
  const userForForm = session.user;

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>Edit Profile</h1>
      <div className='max-w-2xl mx-auto'>
        <EditUserForm
          user={userForForm}
          onSubmit={handleUpdateProfile}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
