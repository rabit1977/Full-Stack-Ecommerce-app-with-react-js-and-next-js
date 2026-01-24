import { prisma } from '@/lib/db';
import crypto from 'crypto';
import { NextResponse } from 'next/server';

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
      return NextResponse.json({
        message: 'If an account exists, a reset link has been sent',
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Save token to user (you'll need to add these fields to your User model)
    await prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    // In production, you would send an email here
    // For now, we'll just log the reset link
    const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`;
    
    console.log('Password reset requested for:', email);
    console.log('Reset URL:', resetUrl);
    
    // TODO: Integrate with email service (e.g., Resend, SendGrid, Nodemailer)
    // await sendEmail({
    //   to: email,
    //   subject: 'Reset your password - Electro Store',
    //   html: `
    //     <h1>Reset Your Password</h1>
    //     <p>Click the link below to reset your password:</p>
    //     <a href="${resetUrl}">${resetUrl}</a>
    //     <p>This link will expire in 1 hour.</p>
    //   `,
    // });

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
