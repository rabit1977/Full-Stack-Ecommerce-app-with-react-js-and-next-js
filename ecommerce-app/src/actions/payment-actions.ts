'use server';

import { auth } from '@/auth';
import { stripe } from '@/lib/stripe';

export async function createPaymentIntentAction(amount: number, currency = 'usd') {
  try {
    const session = await auth();
    // Optional: user metadata

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // convert to cents
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        userId: session?.user?.id || 'guest',
      },
    });

    return {
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    };
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create payment intent',
    };
  }
}

export async function updatePaymentIntentAction(paymentIntentId: string, amount: number) {
  try {
    const session = await auth();
    // Verify ownership if possible, or trust ID (Stripe handles validity)
    
    await stripe.paymentIntents.update(paymentIntentId, {
      amount: Math.round(amount * 100),
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating payment intent:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update payment intent',
    };
  }
}
