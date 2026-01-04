'use client';

import { updateProfileAction } from '@/actions/auth-actions';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { EditUserForm, EditProfileFormValues } from './edit-user-form';
import { User } from '@/lib/types';

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
            }
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
  
      // The User type from next-auth session is slightly different from our app's User type
    // We need to ensure the object passed to the form matches what it expects.
    const userForForm: User = {
      id: session.user.id,
      name: session.user.name || '',
      email: session.user.email || '',
      // These fields might not be on the session user, provide defaults
      role: session.user.role || 'USER', 
      bio: session.user.bio || '',
      cart: [],
      savedForLater: [],
      wishlist: [],
    };

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