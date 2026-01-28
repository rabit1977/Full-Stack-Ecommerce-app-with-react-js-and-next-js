'use client';

import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, Loader2, Phone, Save, User } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

/**
 * Enhanced profile schema with all new fields
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
  phone: z.string().max(20).optional(),
  dateOfBirth: z.date().optional().nullable(),
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say', '']).optional(),
});

export type EditProfileFormValues = z.infer<typeof editProfileSchema>;

interface EditProfileFormProps {
  user: {
    id?: string;
    name?: string | null;
    email?: string | null;
    bio?: string | null;
    image?: string | null;
    phone?: string | null;
    dateOfBirth?: Date | string | null;
    gender?: string | null;
  } | null;
  onSubmit: (values: EditProfileFormValues) => void | Promise<void>;
  isSubmitting: boolean;
}

const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' },
];

/**
 * Enhanced Edit Profile Form
 * 
 * Features:
 * - Name editing with validation
 * - Bio textarea with character count
 * - Phone number input
 * - Date of birth picker
 * - Gender selection
 * - Better UI/UX
 * - Loading states
 */
export function EditProfileForm({
  user,
  onSubmit,
  isSubmitting,
}: EditProfileFormProps) {
  const form = useForm<EditProfileFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(editProfileSchema) as any,
    defaultValues: {
      name: user?.name || '',
      bio: user?.bio || '',
      image: user?.image || '',
      phone: user?.phone || '',
      dateOfBirth: user?.dateOfBirth 
        ? (typeof user.dateOfBirth === 'string' ? new Date(user.dateOfBirth) : user.dateOfBirth) 
        : null,
      gender: (user?.gender as EditProfileFormValues['gender']) || '',
    },
  });

  const bioLength = form.watch('bio')?.length || 0;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        {/* Personal Information Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <User className="w-5 h-5 text-primary" />
            Personal Information
          </div>
          
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
                  This is your public display name.
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
                    className='resize-none min-h-[100px]'
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <div className='flex items-center justify-between'>
                  <FormDescription>
                    A brief description about yourself
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
        </div>

        {/* Contact & Demographics Section */}
        <div className="space-y-4 pt-4 border-t">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <Phone className="w-5 h-5 text-primary" />
            Contact & Demographics
          </div>

          {/* Phone Field */}
          <FormField
            control={form.control}
            name='phone'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder='+1 (555) 123-4567'
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormDescription>
                  Used for order notifications and account recovery
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Date of Birth & Gender Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Date of Birth */}
            <FormField
              control={form.control}
              name='dateOfBirth'
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date of Birth</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                          disabled={isSubmitting}
                        >
                          {field.value ? (
                            format(field.value, 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={field.value || undefined}
                        onSelect={field.onChange}
                        disabled={(date: Date) =>
                          date > new Date() || date < new Date('1900-01-01')
                        }
                        autoFocus
                        captionLayout="dropdown"
                        fromYear={1920}
                        toYear={new Date().getFullYear()}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    For birthday offers and age verification
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Gender */}
            <FormField
              control={form.control}
              name='gender'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value || ''}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {genderOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Optional demographic info
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex flex-col sm:flex-row gap-4 pt-4 border-t'>
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
            <strong>Note:</strong> Your email address cannot be changed here. If you need to update it, 
            please contact support.
          </p>
        </div>
      </form>
    </Form>
  );
}