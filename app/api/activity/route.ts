import { NextResponse } from 'next/server';
import Booking from '../models/Booking';
import dbConnect from '../models/db';

export async function GET() {
  await dbConnect();
  // Fetch the 10 most recent bookings
  const bookings = await Booking.find().sort({ createdAt: -1 }).limit(10);

  const activities = bookings.map(b => ({
    icon: '🚌',
    text: `Booked a ticket for exam "${b.exam}" in ${b.city} (Bus: ${b.bus}, Seat: ${b.seatNumber})`,
    time: new Date(b.createdAt).toLocaleString(),
  }));

  return NextResponse.json({ activities });
} 