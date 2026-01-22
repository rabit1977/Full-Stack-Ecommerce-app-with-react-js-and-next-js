'use client';

import { updateProfileAction } from '@/actions/auth-actions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ArrowLeft,
  Calendar,
  Camera,
  Mail,
  Shield,
  User as UserIcon
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { EditProfileForm, EditProfileFormValues } from './edit-user-form';

/**
 * Loading State Component
 */
function ProfileSkeleton() {
  return (
    <div className='space-y-6'>
      <Skeleton className='h-32 w-32 rounded-full mx-auto' />
      <Skeleton className='h-10 w-full' />
      <Skeleton className='h-32 w-full' />
      <Skeleton className='h-10 w-40' />
    </div>
  );
}

/**
 * Edit Profile Page Component
 * 
 * Modern profile editing with:
 * - Avatar upload
 * - Profile statistics
 * - Account information
 * - Bio editing
 */
export default function EditProfilePage() {
  const { data: session, status, update } = useSession();
  const [isPending, startTransition] = useTransition();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleUpdateProfile = async (values: EditProfileFormValues) => {
    startTransition(async () => {
      try {
        const result = await updateProfileAction({
          ...values,
          image: imagePreview || undefined,
        });

        if (result.success) {
          toast.success('Profile updated successfully');
          
          // Update session with new data
          await update({
            ...session,
            user: {
              ...session?.user,
              name: result.user?.name,
              bio: result.user?.bio,
              image: imagePreview || session?.user?.image,
            },
          });
        } else {
          toast.error(result.message || 'Failed to update profile');
        }
      } catch (error) {
        console.error('Profile update error:', error);
        toast.error('An unexpected error occurred');
      }
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (status === 'loading') {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950'>
        <div className='container mx-auto px-4 py-12'>
          <ProfileSkeleton />
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated' || !session?.user) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900'>
        <Card className='w-full max-w-md'>
          <CardContent className='pt-6 text-center'>
            <UserIcon className='h-12 w-12 mx-auto text-slate-400 mb-4' />
            <h3 className='text-lg font-semibold mb-2'>Authentication Required</h3>
            <p className='text-muted-foreground mb-4'>
              Please sign in to view your profile
            </p>
            <Link href='/auth'>
              <Button>Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const user = session.user;
  const userInitials = user.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950'>
      <div className='container mx-auto px-4 py-8 sm:py-12'>
        {/* Header */}
        <div className='mb-8'>
          <Link href='/account'>
            <Button variant='ghost' className='mb-4 -ml-2'>
              <ArrowLeft className='h-4 w-4 mr-2' />
              Back to Account
            </Button>
          </Link>
          
          <h1 className='text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent'>
            Edit Profile
          </h1>
          <p className='text-muted-foreground mt-2'>
            Manage your account information and preferences
          </p>
        </div>

        <div className='grid lg:grid-cols-3 gap-8'>
          {/* Left Column - Avatar & Account Info */}
          <div className='space-y-6'>
            {/* Avatar Card */}
            <Card>
              <CardHeader>
                <CardTitle className='text-lg'>Profile Picture</CardTitle>
                <CardDescription>
                  Upload a photo to personalize your account
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='flex flex-col items-center'>
                  <div className='relative group'>
                    <Avatar className='h-32 w-32 border-4 border-white dark:border-slate-800 shadow-xl'>
                      <AvatarImage 
                        src={imagePreview || user.image || undefined} 
                        alt={user.name || 'User'} 
                      />
                      <AvatarFallback className='text-3xl bg-gradient-to-br from-blue-500 to-purple-500 text-white'>
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    
                    {/* Upload Overlay */}
                    <label 
                      htmlFor='avatar-upload'
                      className='absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer'
                    >
                      <Camera className='h-8 w-8 text-white' />
                    </label>
                    <input
                      id='avatar-upload'
                      type='file'
                      accept='image/*'
                      onChange={handleImageChange}
                      className='hidden'
                    />
                  </div>
                  
                  <p className='text-xs text-muted-foreground mt-4 text-center'>
                    Click to upload • Max 5MB
                  </p>
                </div>

                {imagePreview && (
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => setImagePreview(null)}
                    className='w-full'
                  >
                    Remove Photo
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Account Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className='text-lg'>Account Details</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-1'>
                  <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                    <Mail className='h-4 w-4' />
                    <span>Email</span>
                  </div>
                  <p className='font-medium truncate'>{user.email}</p>
                </div>

                <Separator />

                <div className='space-y-1'>
                  <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                    <Shield className='h-4 w-4' />
                    <span>Role</span>
                  </div>
                  <Badge variant='secondary' className='capitalize'>
                    {(user as any).role?.toLowerCase() || 'User'}
                  </Badge>
                </div>

                <Separator />

                <div className='space-y-1'>
                  <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                    <Calendar className='h-4 w-4' />
                    <span>Member Since</span>
                  </div>
                  <p className='font-medium'>
                    {(user as any).createdAt
                      ? new Date((user as any).createdAt).toLocaleDateString('en-US', {
                          month: 'long',
                          year: 'numeric',
                        })
                      : 'N/A'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Edit Form */}
          <div className='lg:col-span-2'>
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your profile details and bio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EditProfileForm
                  user={user}
                  onSubmit={handleUpdateProfile}
                  isSubmitting={isPending}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}