import { NextRequest, NextResponse } from 'next/server';
import Booking from '../../../models/Booking';
import dbConnect from '../../../models/db';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    // Get total bookings count
    const totalBookings = await Booking.countDocuments();
    
    // Get bookings by status
    const completedBookings = await Booking.countDocuments({ status: 'confirmed' });
    const cancelledBookings = await Booking.countDocuments({ status: 'rejected' });
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    
    // Get bookings this week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const bookingsThisWeek = await Booking.countDocuments({
      createdAt: { $gte: oneWeekAgo }
    });
    
    // Get bookings this month
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const bookingsThisMonth = await Booking.countDocuments({
      createdAt: { $gte: oneMonthAgo }
    });
    
    // Calculate average booking value
    const totalRevenue = await Booking.aggregate([
      { $match: { status: 'confirmed' } },
      { $group: { _id: null, total: { $sum: '$price' } } }
    ]);
    const averageBookingValue = totalRevenue.length > 0 ? Math.round(totalRevenue[0].total / completedBookings) : 0;
    
    // Get top routes
    const topRoutes = await Booking.aggregate([
      {
        $group: {
          _id: { routeFrom: '$routeFrom', routeTo: '$routeTo' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 5
      },
      {
        $project: {
          route: { $concat: ['$_id.routeFrom', ' → ', '$_id.routeTo'] },
          count: 1,
          _id: 0
        }
      }
    ]);
    
    // Get booking trend (last 7 days)
    const bookingTrend = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));
      
      const count = await Booking.countDocuments({
        createdAt: { $gte: startOfDay, $lte: endOfDay }
      });
      
      bookingTrend.push({
        date: startOfDay.toISOString().split('T')[0],
        count
      });
    }
    
    // Get booking status distribution
    const bookingStatusDistribution = [
      { status: 'Completed', count: completedBookings },
      { status: 'Cancelled', count: cancelledBookings },
      { status: 'Pending', count: pendingBookings }
    ];
    
    // Get peak hours (simplified - based on booking creation time)
    const peakHours = await Booking.aggregate([
      {
        $group: {
          _id: { $hour: '$createdAt' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 8
      },
      {
        $project: {
          hour: {
            $concat: [
              { $toString: '$_id' },
              ' ',
              { $cond: [{ $lt: ['$_id', 12] }, 'AM', 'PM'] }
            ]
          },
          count: 1,
          _id: 0
        }
      }
    ]);
    
    const analytics = {
      totalBookings,
      completedBookings,
      cancelledBookings,
      pendingBookings,
      averageBookingValue,
      bookingsThisWeek,
      bookingsThisMonth,
      topRoutes,
      bookingTrend,
      bookingStatusDistribution,
      peakHours
    };
    
    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Error fetching booking analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch booking analytics' },
      { status: 500 }
    );
  }
} 