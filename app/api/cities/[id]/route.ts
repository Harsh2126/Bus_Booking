import { NextRequest, NextResponse } from 'next/server';
import City from '../../models/City';
import dbConnect from '../../models/db';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  const { id } = await params;
  const update = await req.json();
  const city = await City.findByIdAndUpdate(id, update, { new: true });
  return NextResponse.json({ city: { id: city._id.toString(), name: city.name, state: city.state, country: city.country } });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  const { id } = await params;
  await City.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
} 