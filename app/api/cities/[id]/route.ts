import { NextRequest, NextResponse } from 'next/server';
import City from '../../models/City';
import dbConnect from '../../models/db';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const update = await req.json();
  const city = await City.findByIdAndUpdate(params.id, update, { new: true });
  return NextResponse.json({ city: { id: city._id.toString(), name: city.name, state: city.state, country: city.country } });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  await City.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
} 