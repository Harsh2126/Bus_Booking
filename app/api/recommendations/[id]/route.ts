import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../models/db';
import Recommendation from '../../models/Recommendation';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const { icon, route, desc } = await req.json();
  const recommendation = await Recommendation.findByIdAndUpdate(
    params.id,
    { icon, route, desc },
    { new: true }
  );
  return NextResponse.json({ recommendation });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  await Recommendation.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
} 