'use server'

import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function signupAction(name: string, email: string, password: string) {
  // Validate input
  if (!email || !password || !name) {
    return { success: false, message: 'Missing fields' };
  }

  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { success: false, message: 'Email already exists' };
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  try {
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        // Default role is "customer" from schema
        role: email === 'rabit@gmail.com' ? 'admin' : 'customer', // Simple admin auto-grant for testing
      },
    });
    return { success: true };
  } catch (error) {
    console.error('Signup error:', error);
    return { success: false, message: 'Failed to create account' };
  }
}
