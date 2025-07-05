import { NextRequest, NextResponse } from 'next/server';
import Bus from '../../models/Bus';
import dbConnect from '../../models/db';
import Recommendation from '../../models/Recommendation';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  const { id } = await params;
  const { name, number, capacity, type, status, exams, routeFrom, routeTo, date, contactNumber, timing, price } = await req.json();
  const update = { name, number, capacity, type, status, exams, routeFrom, routeTo, date, contactNumber, timing, price };
  const bus = await Bus.findByIdAndUpdate(id, update, { new: true }).populate('exams');
  return NextResponse.json({ bus });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  const { id } = await params;
  const bus = await Bus.findById(id);
  if (bus) {
    const routeString = `${bus.routeFrom} → ${bus.routeTo}`;
    await Recommendation.deleteMany({ route: routeString });
  }
  await Bus.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
} 