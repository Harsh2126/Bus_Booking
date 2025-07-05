import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../models/db';
import User from '../../../models/User';
 
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  const { id } = await params;
  const user = await User.findByIdAndUpdate(id, { role: 'admin' }, { new: true });
  return NextResponse.json({ user });
} 