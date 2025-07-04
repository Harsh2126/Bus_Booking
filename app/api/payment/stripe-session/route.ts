import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2022-11-15' });

export async function POST(req: NextRequest) {
  const { amount, email } = await req.json();
  if (!amount || !email) {
    return NextResponse.json({ error: 'Missing amount or email' }, { status: 400 });
  }
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: 'Bus Ticket',
            },
            unit_amount: amount, // in paise
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: email,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/book-exam?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/book-exam?canceled=true`,
    });
    return NextResponse.json({ sessionId: session.id });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create Stripe session' }, { status: 500 });
  }
} 