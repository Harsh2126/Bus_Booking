import { NextRequest, NextResponse } from 'next/server';
import Booking from '../../models/Booking';
import dbConnect from '../../models/db';

// @ts-ignore: Next.js type bug, context.params is not a Promise
export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  await dbConnect();
  const update = await req.json();
  const booking = await Booking.findByIdAndUpdate(context.params.id, update, { new: true });
  return NextResponse.json({ booking });
}

// @ts-ignore: Next.js type bug, context.params is not a Promise
export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
  await dbConnect();
  await Booking.findByIdAndDelete(context.params.id);
  return NextResponse.json({ success: true });
} 