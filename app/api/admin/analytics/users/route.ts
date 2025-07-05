import { NextRequest, NextResponse } from 'next/server';
import Booking from '../../../models/Booking';
import dbConnect from '../../../models/db';
import User from '../../../models/User';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    // Get total users count
    const totalUsers = await User.countDocuments();
    
    // Get users created this week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const newUsersThisWeek = await User.countDocuments({
      createdAt: { $gte: oneWeekAgo }
    });
    
    // Get users created this month
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo }
    });
    
    // Get active users (users with bookings in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const activeUsers = await User.countDocuments({
      _id: {
        $in: await Booking.distinct('userId', {
          createdAt: { $gte: thirtyDaysAgo }
        })
      }
    });
    
    // Get user types distribution
    const userTypes = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Get user registration trend (last 7 days)
    const registrationTrend = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));
      
      const count = await User.countDocuments({
        createdAt: { $gte: startOfDay, $lte: endOfDay }
      });
      
      registrationTrend.push({
        date: startOfDay.toISOString().split('T')[0],
        count
      });
    }
    
    // Get top user cities (based on bookings)
    const topUserCities = await Booking.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $group: {
          _id: '$routeFrom',
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
          city: '$_id',
          count: 1,
          _id: 0
        }
      }
    ]);
    
    // Calculate user growth rate (comparing this month to last month)
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: twoMonthsAgo, $lt: oneMonthAgo }
    });
    
    const userGrowthRate = lastMonthUsers > 0 
      ? ((newUsersThisMonth - lastMonthUsers) / lastMonthUsers) * 100 
      : 0;
    
    const analytics = {
      totalUsers,
      activeUsers,
      newUsersThisWeek,
      newUsersThisMonth,
      userGrowthRate: Math.round(userGrowthRate * 10) / 10,
      topUserCities,
      userRegistrationTrend: registrationTrend,
      userTypes: userTypes.map((type: { _id: string; count: number }) => ({
        type: type._id === 'admin' ? 'Admins' : type._id === 'user' ? 'Regular Users' : 'Premium Users',
        count: type.count
      }))
    };
    
    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Error fetching user analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user analytics' },
      { status: 500 }
    );
  }
} 