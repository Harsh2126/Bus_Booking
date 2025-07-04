import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../models/db';
import User from '../models/User';

// POST /api/users/promote
export async function POST(req: NextRequest) {
  await dbConnect();
  const data = await req.json();
  if (!data.email) {
    return NextResponse.json({ error: 'Missing email' }, { status: 400 });
  }
  try {
    const user = await User.findOneAndUpdate(
      { email: data.email },
      { role: 'admin' },
      { new: true }
    );
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  await dbConnect();
  const users = await User.find();
  return NextResponse.json({ users });
} 