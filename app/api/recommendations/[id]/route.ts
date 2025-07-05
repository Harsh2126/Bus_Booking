import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../models/db';
import Recommendation from '../../models/Recommendation';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  const { id } = await params;
  const { icon, route, desc } = await req.json();
  const recommendation = await Recommendation.findByIdAndUpdate(
    id,
    { icon, route, desc },
    { new: true }
  );
  return NextResponse.json({ recommendation });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  const { id } = await params;
  await Recommendation.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
} 