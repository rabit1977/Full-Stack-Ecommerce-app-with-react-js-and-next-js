
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { SubscriptionConfirmationEmail } from '@/components/emails/subscription-confirmation-email';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    const { email } = await req.json();

    if (!email) {
        return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Subscription Confirmation',
            react: SubscriptionConfirmationEmail({ email }),
        });

        return NextResponse.json({ message: 'Successfully subscribed!' });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
}
