import { writeFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
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
  let data: any = null;
  let upiScreenshot = undefined;
  let upiTxnId = undefined;

  // Check if multipart/form-data (for UPI/QR with screenshot)
  const contentType = req.headers.get('content-type') || '';
  if (contentType.includes('multipart/form-data')) {
    const formData = await req.formData();
    const detailsStr = formData.get('bookingDetails');
    if (!detailsStr || typeof detailsStr !== 'string') {
      return NextResponse.json({ error: 'Missing booking details' }, { status: 400 });
    }
    try {
      data = JSON.parse(detailsStr);
    } catch {
      return NextResponse.json({ error: 'Invalid booking details' }, { status: 400 });
    }
    upiTxnId = formData.get('txnId');
    const screenshotFile = formData.get('screenshot');
    if (screenshotFile && typeof screenshotFile === 'object' && 'arrayBuffer' in screenshotFile) {
      // Save screenshot to /public/uploads/
      const buffer = Buffer.from(await screenshotFile.arrayBuffer());
      const ext = (screenshotFile.name || 'png').split('.').pop();
      const filename = `${Date.now()}-${screenshotFile.name || 'upi'}.${ext}`;
      const uploadPath = path.join(process.cwd(), 'public', 'uploads', filename);
      await writeFile(uploadPath, buffer);
      upiScreenshot = `/uploads/${filename}`;
    }
  } else {
    // Fallback: normal JSON
    data = await req.json();
    upiTxnId = data.upiTxnId;
    upiScreenshot = data.upiScreenshot;
  }

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
    upiScreenshot,
    upiTxnId,
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