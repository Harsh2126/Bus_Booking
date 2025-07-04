import { NextResponse } from 'next/server';
import Booking from '../../models/Booking';
import dbConnect from '../../models/db';
import User from '../../models/User';

export async function GET() {
  await dbConnect();
  const totalBookings = await Booking.countDocuments();
  const totalUsers = await User.countDocuments();
  const totalAdmins = await User.countDocuments({ role: 'admin' });

  // Count pending bookings
  const pendingBookings = await Booking.countDocuments({ status: 'pending' });

  // Top 3 cities by booking count
  const cityAgg = await Booking.aggregate([
    { $group: { _id: '$city', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 3 }
  ]);
  const topCities = cityAgg.map(c => ({ city: c._id, count: c.count }));

  // Bookings per day for last 7 days
  const today = new Date();
  const lastWeek = new Date(today);
  lastWeek.setDate(today.getDate() - 6);
  const bookingsPerDay = await Booking.aggregate([
    { $match: { createdAt: { $gte: lastWeek } } },
    { $group: {
      _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
      count: { $sum: 1 }
    }},
    { $sort: { _id: 1 } }
  ]);

  // Calculate total revenue from confirmed bookings
  const revenueAgg = await Booking.aggregate([
    { $match: { status: 'confirmed' } },
    { $group: { _id: null, total: { $sum: { $multiply: ["$price", { $size: "$seatNumbers" }] } } } }
  ]);
  const totalRevenue = revenueAgg[0]?.total || 0;

  return NextResponse.json({
    totalBookings,
    totalUsers,
    totalAdmins,
    topCities,
    bookingsPerDay,
    pendingBookings,
    totalRevenue
  });
} 