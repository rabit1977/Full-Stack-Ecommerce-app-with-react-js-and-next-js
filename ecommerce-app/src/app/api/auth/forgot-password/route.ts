import { ResetPasswordEmail } from '@/components/emails/reset-password-email';
import { prisma } from '@/lib/db';
import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * POST /api/auth/forgot-password
 * Request password reset email
 */
export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Always return success to prevent email enumeration
    if (!user) {
      // Simulate partial delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return NextResponse.json({
        message: 'If an account exists, a reset link has been sent',
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Save token to user
    await prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`;
    
    // Send email using Resend
    await resend.emails.send({
      from: 'Electro Store <onboarding@resend.dev>', // Should use verified domain in production
      to: email,
      subject: 'Reset your password - Electro Store',
      react: ResetPasswordEmail({ email, resetUrl }),
    });

    console.log('Password reset email sent to:', email); // Log for debugging

    return NextResponse.json({
      message: 'If an account exists, a reset link has been sent',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { message: 'An error occurred' },
      { status: 500 }
    );
  }
}
