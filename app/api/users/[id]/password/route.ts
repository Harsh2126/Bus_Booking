import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../models/db';
import User from '../../../models/User';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  const { id } = await params;
  const { oldPassword, newPassword } = await req.json();
  if (!oldPassword || !newPassword) {
    return NextResponse.json({ error: 'Both old and new passwords are required.' }, { status: 400 });
  }
  const user = await User.findById(id);
  if (!user) {
    return NextResponse.json({ error: 'User not found.' }, { status: 404 });
  }
  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    return NextResponse.json({ error: 'Old password is incorrect.' }, { status: 401 });
  }
  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  return NextResponse.json({ success: true });
} 