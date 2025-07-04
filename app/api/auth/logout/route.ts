import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const res = NextResponse.json({ message: 'Logged out' });
  res.cookies.set('token', '', { httpOnly: true, path: '/', expires: new Date(0) });
  return res;
} 