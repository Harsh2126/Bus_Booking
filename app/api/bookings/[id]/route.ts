import { NextRequest, NextResponse } from 'next/server';
import Booking from '../../models/Booking';
import dbConnect from '../../models/db';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  const { id } = await params;
  const update = await req.json();
  const booking = await Booking.findByIdAndUpdate(id, update, { new: true });
  return NextResponse.json({ booking });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  const { id } = await params;
  await Booking.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
} 