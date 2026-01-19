'use client';

import { updateUserAction } from '@/actions/user-actions';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { User } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

/**
 * Form validation schema
 */
const editUserFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['USER', 'ADMIN']),
  bio: z.string().optional(),
});

type EditUserFormValues = z.infer<typeof editUserFormSchema>;

interface EditUserFormProps {
  user: User;
  isEditingSelf?: boolean;
}

/**
 * Edit User Form Component
 *
 * Form for editing existing user details
 */
export function EditUserForm({
  user,
  isEditingSelf = false,
}: EditUserFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<EditUserFormValues>({
    resolver: zodResolver(editUserFormSchema),
    defaultValues: {
      name: user.name || '',
      email: user.email || '',
      role: user.role || 'USER',
      bio: user.bio || '',
    },
  });

  /**
   * Handle form submission
   */
  const onSubmit = async (values: EditUserFormValues) => {
    startTransition(async () => {
      try {
        const result = await updateUserAction(user.id, {
          name: values.name,
          email: values.email,
          role: values.role,
          bio: values.bio,
        });

        if (result.success) {
          toast.success(result.message || 'User updated successfully');
          router.push('/admin/users');
          router.refresh();
        } else {
          toast.error(result.error || 'Failed to update user');
        }
      } catch (error) {
        console.error('Update user error:', error);
        toast.error(
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred',
        );
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        {/* Name Field */}
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder='John Doe' {...field} disabled={isPending} />
              </FormControl>
              <FormDescription>
                The user's full name as it appears in the system
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email Field */}
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input
                  type='email'
                  placeholder='john@example.com'
                  {...field}
                  disabled={isPending}
                />
              </FormControl>
              <FormDescription>
                Changing email will require re-verification
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Role Field */}
        <FormField
          control={form.control}
          name='role'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Role</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isPending || isEditingSelf}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select a role' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value='USER'>User (Standard Access)</SelectItem>
                  <SelectItem value='ADMIN'>Admin (Full Access)</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                {isEditingSelf
                  ? 'You cannot change your own role'
                  : 'Admin users have full access to all features'}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Bio Field */}
        <FormField
          control={form.control}
          name='bio'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Biography (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Tell us a bit about this user...'
                  className='resize-none'
                  rows={4}
                  {...field}
                  disabled={isPending}
                />
              </FormControl>
              <FormDescription>
                Optional biography or notes about the user
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Action Buttons */}
        <div className='flex justify-end gap-4 pt-4'>
          <Button
            type='button'
            variant='outline'
            onClick={() => router.push('/admin/users')}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type='submit' disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                Saving Changes...
              </>
            ) : (
              <>
                <Save className='h-4 w-4 mr-2' />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
