import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../models/db';
import User from '../../models/User';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  const { id } = await params;
  await User.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  const { id } = await params;
  const update = await req.json();
  const user = await User.findByIdAndUpdate(id, update, { new: true });
  return NextResponse.json({ user });
} 