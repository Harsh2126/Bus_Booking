import { NextRequest, NextResponse } from 'next/server';
import Bus from '../models/Bus';
import dbConnect from '../models/db';

export async function GET(req: NextRequest) {
  await dbConnect();
  const buses = await Bus.find().populate('exams');
  // Map exams to exam names for frontend filtering
  const mappedBuses = buses.map(bus => ({
    ...bus.toObject(),
    exams: Array.isArray(bus.exams) ? bus.exams.map((e: any) => typeof e === 'object' && e !== null ? e.name : e) : [],
  }));
  return NextResponse.json({ buses: mappedBuses });
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const { name, number, capacity, type, status, exams, routeFrom, routeTo, date, contactNumber, timing, price } = await req.json();
  const bus = await Bus.create({ name, number, capacity, type, status, exams, routeFrom, routeTo, date, contactNumber, timing, price });
  return NextResponse.json({ bus });
} 