import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../models/db';
import User from '../../models/User';

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  await User.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const update = await req.json();
  const user = await User.findByIdAndUpdate(params.id, update, { new: true });
  return NextResponse.json({ user });
} 