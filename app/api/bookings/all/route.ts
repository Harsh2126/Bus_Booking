import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import Booking from '../../models/Booking';
import dbConnect from '../../models/db';

export async function GET(req: NextRequest) {
  await dbConnect();
  const token = req.cookies.get('token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  let user;
  try {
    user = jwt.verify(token, process.env.JWT_SECRET!);
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Admin only' }, { status: 401 });
  }
  const bookings = await Booking.find().sort({ createdAt: -1 });
  return NextResponse.json({ bookings });
} 