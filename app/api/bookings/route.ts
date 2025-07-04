import { NextRequest, NextResponse } from 'next/server';
import Booking from '../models/Booking';
import Bus from '../models/Bus';
import dbConnect from '../models/db';

// GET /api/bookings?userId=demo-user
export async function GET(req: NextRequest) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const bus = searchParams.get('bus');
  const routeFrom = searchParams.get('routeFrom');
  const routeTo = searchParams.get('routeTo');
  const date = searchParams.get('date');
  const query: Record<string, unknown> = {};
  
  if (userId) query.userId = userId;
  if (bus) query.bus = bus;
  if (routeFrom) query.routeFrom = routeFrom;
  if (routeTo) query.routeTo = routeTo;
  if (date) query.date = date;
  
  const bookings = await Booking.find(query);
  return NextResponse.json({ bookings });
}

// POST /api/bookings
export async function POST(req: NextRequest) {
  await dbConnect();
  const data = await req.json();
  if (!data.exam || !data.city || !data.date || !data.bus || !data.userId || !Array.isArray(data.seatNumbers) || data.seatNumbers.length === 0) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  const { bus, busId, date, seatNumbers } = data;
  // Check if any of the requested seats are already booked
  const existing = await Booking.find({ bus, date, seatNumbers: { $in: seatNumbers } });
  if (existing.length > 0) {
    return NextResponse.json({ error: 'One or more seats already booked' }, { status: 400 });
  }
  // Fetch bus price (try busId, then exact name, then partial/case-insensitive name)
  let price = 0;
  let busDoc = null;
  try {
    if (busId) {
      busDoc = await Bus.findById(busId);
    }
    if (!busDoc && bus) {
      busDoc = await Bus.findOne({ name: bus });
    }
    if (!busDoc && bus) {
      busDoc = await Bus.findOne({ name: new RegExp(bus, 'i') });
    }
    if (busDoc && typeof busDoc.price === 'number') {
      price = busDoc.price;
    }
    console.log('Booking API: bus lookup', { bus, busId, found: !!busDoc, price });
  } catch (err) {
    console.log('Booking API: bus lookup error', err);
  }
  // Only include status if provided, otherwise let schema default it
  const bookingData = {
    exam: data.exam,
    city: data.city,
    date: data.date,
    bus: data.bus,
    busNumber: data.busNumber,
    userId: data.userId,
    seatNumbers: data.seatNumbers,
    routeFrom: data.routeFrom,
    routeTo: data.routeTo,
    contactNumber: data.contactNumber,
    timing: data.timing,
    upiScreenshot: data.upiScreenshot,
    upiTxnId: data.upiTxnId,
    price,
    ...(data.status && { status: data.status })
  };
  const booking = await Booking.create(bookingData);
  return NextResponse.json(booking);
}

// DELETE /api/bookings?id=BOOKING_ID
export async function DELETE(req: NextRequest) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }
  await Booking.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}

// PATCH /api/bookings
export async function PATCH(req: NextRequest) {
  await dbConnect();
  const data = await req.json();
  const { id, ...updateFields } = data;
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }
  const updatedBooking = await Booking.findByIdAndUpdate(id, updateFields, { new: true });
  if (!updatedBooking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
  }
  return NextResponse.json(updatedBooking);
}

export const dynamic = 'force-dynamic'; 