import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../models/db';
import User from '../../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
    await dbConnect();
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ user: {
      userId: decoded.userId,
      email: decoded.email,
      role: user.role,
      name: user.name,
      age: user.age,
      course: user.course,
      college: user.college
    } });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 