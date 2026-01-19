import { z } from 'zod';

/**
 * User form validation schema
 */
export const userFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters' })
    .max(50, { message: 'Name must be less than 50 characters' }),
  email: z
    .string()
    .email({ message: 'Invalid email address' })
    .min(5, { message: 'Email must be at least 5 characters' }),
  role: z.enum(['admin', 'User'], {
    message: 'Role must be either admin or User',
  }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' })
    .optional()
    .or(z.literal('')),
});

export type UserFormData = z.infer<typeof userFormSchema>;
