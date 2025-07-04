import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../models/db';
import Recommendation from '../models/Recommendation';

export async function GET(req: NextRequest) {
  await dbConnect();
  const recommendations = await Recommendation.find().sort({ createdAt: -1 }).limit(5);
  return NextResponse.json({ recommendations });
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const { icon, route, desc } = await req.json();
  const recommendation = await Recommendation.create({ icon, route, desc });
  return NextResponse.json({ recommendation });
} 