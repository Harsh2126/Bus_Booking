import { NextRequest, NextResponse } from 'next/server';
import Booking from '../../models/Booking';
import dbConnect from '../../models/db';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const update = await req.json();
  const booking = await Booking.findByIdAndUpdate(params.id, update, { new: true });
  return NextResponse.json({ booking });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  await Booking.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
} 