import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../models/db';
import User from '../../../models/User';
 
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const user = await User.findByIdAndUpdate(params.id, { role: 'user' }, { new: true });
  return NextResponse.json({ user });
} 