'use client';

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
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

/**
 * Enhanced profile schema with more fields
 */
const editProfileSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters' })
    .max(50, { message: 'Name must be less than 50 characters' }),
  bio: z
    .string()
    .max(500, { message: 'Bio cannot be longer than 500 characters' })
    .optional(),
  image: z.string().optional(),
});

export type EditProfileFormValues = z.infer<typeof editProfileSchema>;

interface EditProfileFormProps {
  user: {
    id?: string;
    name?: string | null;
    email?: string | null;
    bio?: string | null;
    image?: string | null;
  } | null;
  onSubmit: (values: EditProfileFormValues) => void | Promise<void>;
  isSubmitting: boolean;
}

/**
 * Enhanced Edit Profile Form
 * 
 * Features:
 * - Name editing with validation
 * - Bio textarea with character count
 * - Better UI/UX
 * - Loading states
 */
export function EditProfileForm({
  user,
  onSubmit,
  isSubmitting,
}: EditProfileFormProps) {
  const form = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: user?.name || '',
      bio: user?.bio || '',
      image: user?.image || '',
    },
  });

  const bioLength = form.watch('bio')?.length || 0;

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
                <Input
                  placeholder='John Doe'
                  {...field}
                  disabled={isSubmitting}
                  className='text-base'
                />
              </FormControl>
              <FormDescription>
                This is your public display name. It will be visible to other users.
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
              <FormLabel>Biography</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Tell us a little about yourself...'
                  className='resize-none min-h-[120px]'
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <div className='flex items-center justify-between'>
                <FormDescription>
                  Share a brief description about yourself
                </FormDescription>
                <span className={`text-xs ${
                  bioLength > 500 
                    ? 'text-destructive' 
                    : bioLength > 450 
                    ? 'text-amber-600' 
                    : 'text-muted-foreground'
                }`}>
                  {bioLength}/500
                </span>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Action Buttons */}
        <div className='flex flex-col sm:flex-row gap-4 pt-4'>
          <Button
            type='submit'
            disabled={isSubmitting}
            className='w-full sm:flex-1'
          >
            {isSubmitting ? (
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
          <Button
            type='button'
            variant='outline'
            onClick={() => form.reset()}
            disabled={isSubmitting}
            className='w-full sm:w-auto'
          >
            Reset
          </Button>
        </div>

        {/* Info Box */}
        <div className='rounded-lg border bg-muted/50 p-4'>
          <p className='text-sm text-muted-foreground'>
            <strong>Note:</strong> Your email address cannot be changed. If you need to update it, 
            please contact support.
          </p>
        </div>
      </form>
    </Form>
  );
}