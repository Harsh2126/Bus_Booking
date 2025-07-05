import { NextRequest, NextResponse } from 'next/server';
import Booking from '../../../models/Booking';
import Bus from '../../../models/Bus';
import dbConnect from '../../../models/db';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    // Get all buses
    const buses = await Bus.find();
    // For each bus, calculate total bookings and average occupancy
    const busPerformance = await Promise.all(
      buses.map(async (bus) => {
        const totalBookings = await Booking.countDocuments({ bus: bus.name });
        // Find all bookings for this bus and sum up seatNumbers
        const bookings = await Booking.find({ bus: bus.name });
        const totalSeatsBooked = bookings.reduce((sum, b) => sum + (Array.isArray(b.seatNumbers) ? b.seatNumbers.length : 0), 0);
        const avgOccupancy = bus.capacity > 0 ? (totalSeatsBooked / (bookings.length * bus.capacity)) * 100 : 0;
        return {
          name: bus.name,
          number: bus.number,
          capacity: bus.capacity,
          status: bus.status,
          totalBookings,
          avgOccupancy: Math.round(avgOccupancy * 10) / 10,
        };
      })
    );
    // Top 5 buses by bookings
    const topBuses = [...busPerformance].sort((a, b) => b.totalBookings - a.totalBookings).slice(0, 5);
    // Status distribution
    const statusCounts = busPerformance.reduce<Record<string, number>>((acc, bus) => {
      acc[bus.status] = (acc[bus.status] || 0) + 1;
      return acc;
    }, {});
    return NextResponse.json({
      buses: busPerformance,
      topBuses,
      statusCounts,
    });
  } catch (error) {
    console.error('Error fetching bus performance:', error);
    return NextResponse.json({ error: 'Failed to fetch bus performance' }, { status: 500 });
  }
} 