import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(req: NextRequest) {
  const { amount, currency } = await req.json();
  if (!amount || !currency) {
    return NextResponse.json({ error: 'Missing amount or currency' }, { status: 400 });
  }
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });
  try {
    const order = await razorpay.orders.create({
      amount,
      currency,
      payment_capture: true,
    });
    return NextResponse.json({ orderId: order.id, amount: order.amount, currency: order.currency });
  } catch {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
} 