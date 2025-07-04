import { NextRequest, NextResponse } from 'next/server';
import Bus from '../../models/Bus';
import dbConnect from '../../models/db';
import Recommendation from '../../models/Recommendation';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const { name, number, capacity, type, status, exams, routeFrom, routeTo, date, contactNumber, timing, price } = await req.json();
  const update = { name, number, capacity, type, status, exams, routeFrom, routeTo, date, contactNumber, timing, price };
  const bus = await Bus.findByIdAndUpdate(params.id, update, { new: true }).populate('exams');
  return NextResponse.json({ bus });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const bus = await Bus.findById(params.id);
  if (bus) {
    const routeString = `${bus.routeFrom} → ${bus.routeTo}`;
    await Recommendation.deleteMany({ route: routeString });
  }
  await Bus.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
} 