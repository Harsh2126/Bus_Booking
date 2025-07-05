import { NextRequest, NextResponse } from 'next/server';
import Booking from '../../../models/Booking';
import dbConnect from '../../../models/db';
import User from '../../../models/User';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    // Bookings per month (last 12 months)
    const bookingsPerMonth = [];
    const revenuePerMonth = [];
    const registrationsPerMonth = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
      // Bookings
      const bookingsCount = await Booking.countDocuments({ createdAt: { $gte: startOfMonth, $lte: endOfMonth } });
      bookingsPerMonth.push({ month: startOfMonth.toLocaleString('default', { month: 'short' }), count: bookingsCount });
      // Revenue
      const revenueResult = await Booking.aggregate([
        { $match: { createdAt: { $gte: startOfMonth, $lte: endOfMonth }, status: 'confirmed' } },
        { $group: { _id: null, total: { $sum: '$price' } } }
      ]);
      revenuePerMonth.push({ month: startOfMonth.toLocaleString('default', { month: 'short' }), revenue: revenueResult.length > 0 ? revenueResult[0].total : 0 });
      // User registrations
      const regCount = await User.countDocuments({ createdAt: { $gte: startOfMonth, $lte: endOfMonth } });
      registrationsPerMonth.push({ month: startOfMonth.toLocaleString('default', { month: 'short' }), count: regCount });
    }
    // Top 5 cities by bookings
    const topCities = await Booking.aggregate([
      { $group: { _id: '$routeFrom', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $project: { city: '$_id', count: 1, _id: 0 } }
    ]);
    // Top 5 routes by bookings
    const topRoutes = await Booking.aggregate([
      { $group: { _id: { routeFrom: '$routeFrom', routeTo: '$routeTo' }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $project: { route: { $concat: ['$_id.routeFrom', ' → ', '$_id.routeTo'] }, count: 1, _id: 0 } }
    ]);
    return NextResponse.json({
      bookingsPerMonth,
      revenuePerMonth,
      registrationsPerMonth,
      topCities,
      topRoutes,
    });
  } catch (error) {
    console.error('Error fetching trends:', error);
    return NextResponse.json({ error: 'Failed to fetch trends' }, { status: 500 });
  }
} 