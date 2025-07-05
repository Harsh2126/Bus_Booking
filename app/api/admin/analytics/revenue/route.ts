import { NextRequest, NextResponse } from 'next/server';
import Booking from '../../../models/Booking';
import dbConnect from '../../../models/db';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    // Get total revenue (from confirmed bookings)
    const totalRevenueResult = await Booking.aggregate([
      { $match: { status: 'confirmed' } },
      { $group: { _id: null, total: { $sum: '$price' } } }
    ]);
    const totalRevenue = totalRevenueResult.length > 0 ? totalRevenueResult[0].total : 0;
    
    // Get revenue this month
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const revenueThisMonthResult = await Booking.aggregate([
      { 
        $match: { 
          status: 'confirmed',
          createdAt: { $gte: oneMonthAgo }
        } 
      },
      { $group: { _id: null, total: { $sum: '$price' } } }
    ]);
    const revenueThisMonth = revenueThisMonthResult.length > 0 ? revenueThisMonthResult[0].total : 0;
    
    // Get revenue this week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const revenueThisWeekResult = await Booking.aggregate([
      { 
        $match: { 
          status: 'confirmed',
          createdAt: { $gte: oneWeekAgo }
        } 
      },
      { $group: { _id: null, total: { $sum: '$price' } } }
    ]);
    const revenueThisWeek = revenueThisWeekResult.length > 0 ? revenueThisWeekResult[0].total : 0;
    
    // Calculate average order value
    const avgOrderValueResult = await Booking.aggregate([
      { $match: { status: 'confirmed' } },
      { $group: { _id: null, avg: { $avg: '$price' } } }
    ]);
    const averageOrderValue = avgOrderValueResult.length > 0 ? Math.round(avgOrderValueResult[0].avg) : 0;
    
    // Get top revenue routes
    const topRevenueRoutes = await Booking.aggregate([
      { $match: { status: 'confirmed' } },
      {
        $group: {
          _id: { routeFrom: '$routeFrom', routeTo: '$routeTo' },
          revenue: { $sum: '$price' }
        }
      },
      {
        $sort: { revenue: -1 }
      },
      {
        $limit: 5
      },
      {
        $project: {
          route: { $concat: ['$_id.routeFrom', ' → ', '$_id.routeTo'] },
          revenue: 1,
          _id: 0
        }
      }
    ]);
    
    // Get revenue trend (last 7 days)
    const revenueTrend = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));
      
      const revenueResult = await Booking.aggregate([
        { 
          $match: { 
            status: 'confirmed',
            createdAt: { $gte: startOfDay, $lte: endOfDay }
          } 
        },
        { $group: { _id: null, total: { $sum: '$price' } } }
      ]);
      
      revenueTrend.push({
        date: startOfDay.toISOString().split('T')[0],
        revenue: revenueResult.length > 0 ? revenueResult[0].total : 0
      });
    }
    
    // Get revenue by status
    const revenueByStatus = await Booking.aggregate([
      {
        $group: {
          _id: '$status',
          revenue: { $sum: '$price' }
        }
      },
      {
        $project: {
          status: '$_id',
          revenue: 1,
          _id: 0
        }
      }
    ]);
    
    // Get monthly revenue (last 12 months)
    const monthlyRevenue = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
      
      const revenueResult = await Booking.aggregate([
        { 
          $match: { 
            status: 'confirmed',
            createdAt: { $gte: startOfMonth, $lte: endOfMonth }
          } 
        },
        { $group: { _id: null, total: { $sum: '$price' } } }
      ]);
      
      monthlyRevenue.push({
        month: startOfMonth.toLocaleString('default', { month: 'short' }),
        revenue: revenueResult.length > 0 ? revenueResult[0].total : 0
      });
    }
    
    // Calculate revenue growth rate
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
    const lastMonthRevenueResult = await Booking.aggregate([
      { 
        $match: { 
          status: 'confirmed',
          createdAt: { $gte: twoMonthsAgo, $lt: oneMonthAgo }
        } 
      },
      { $group: { _id: null, total: { $sum: '$price' } } }
    ]);
    const lastMonthRevenue = lastMonthRevenueResult.length > 0 ? lastMonthRevenueResult[0].total : 0;
    
    const revenueGrowth = lastMonthRevenue > 0 
      ? ((revenueThisMonth - lastMonthRevenue) / lastMonthRevenue) * 100 
      : 0;
    
    const analytics = {
      totalRevenue,
      revenueThisMonth,
      revenueThisWeek,
      averageOrderValue,
      revenueGrowth: Math.round(revenueGrowth * 10) / 10,
      topRevenueRoutes,
      revenueTrend,
      revenueByStatus,
      monthlyRevenue
    };
    
    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Error fetching revenue analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch revenue analytics' },
      { status: 500 }
    );
  }
} 