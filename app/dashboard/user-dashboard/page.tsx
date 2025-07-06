"use client";
import {
    AlertCircle,
    ArrowRight,
    Bus,
    Calendar,
    CheckCircle,
    Clock,
    FileText,
    Home,
    MapPin,
    Settings,
    Star,
    Ticket,
    TrendingUp,
    User,
    XCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';

interface User {
  _id: string;
  email: string;
  name?: string;
  age?: number;
  course?: string;
  college?: string;
  role: string;
}

interface Booking {
  _id: string;
  bus: string;
  routeFrom: string;
  routeTo: string;
  date: string;
  seatNumbers: string[];
  price: number;
  status: 'pending' | 'confirmed' | 'rejected';
  exam?: string;
  type?: string;
  timing?: string;
  contactNumber?: string;
  userId: string;
}

interface Recommendation {
  _id: string;
  icon: string;
  route: string;
  desc: string;
}

// Helper functions for date-only comparison
function isSameOrAfterToday(dateStr: string) {
  const today = new Date();
  const bookingDate = new Date(dateStr);
  today.setHours(0,0,0,0);
  bookingDate.setHours(0,0,0,0);
  return bookingDate >= today;
}

function isBeforeToday(dateStr: string) {
  const today = new Date();
  const bookingDate = new Date(dateStr);
  today.setHours(0,0,0,0);
  bookingDate.setHours(0,0,0,0);
  return bookingDate < today;
}

export default function UserDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const router = useRouter();

  useEffect(() => {
    fetch('/api/auth/me')
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          if (data.user?.role === 'admin') {
            router.replace('/dashboard/admin-dashboard');
            return;
          }
          setUser(data.user);
          // Always fetch bookings for the current user only
          Promise.all([
            fetch(`/api/bookings?userId=${data.user._id || data.user.email}`).then(res => res.json()),
            fetch('/api/recommendations').then(res => res.json())
          ]).then(([bookingsData, recommendationsData]) => {
            setBookings(bookingsData.bookings || []);
            setRecommendations(recommendationsData.recommendations || []);
            setLoading(false);
          }).catch(err => {
            console.error('Error fetching user data:', err);
            setLoading(false);
          });
        } else {
          router.replace('/login');
        }
      });
  }, [router]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (user) {
      interval = setInterval(() => {
        fetch(`/api/bookings?userId=${user._id || user.email}`)
          .then(res => res.json())
          .then(bookingsData => {
            setBookings(bookingsData.bookings || []);
          });
      }, 5000); // Refresh every 5 seconds
    }
    return () => clearInterval(interval);
  }, [user]);

  const upcomingBookings = bookings.filter(booking => 
    isSameOrAfterToday(booking.date)
  );

  const pendingBookings = bookings.filter(booking => 
    booking.status === 'pending'
  );

  const completedBookings = bookings.filter(booking => 
    isBeforeToday(booking.date) && booking.status === 'confirmed'
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Bus className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Loading your dashboard...</h2>
          <p className="text-gray-500">Please wait while we fetch your data</p>
        </div>
      </div>
    );
  }

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'bookings', label: 'My Bookings', icon: Ticket },
    { id: 'exam', label: 'Book Exam', icon: FileText },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
        <CardContent className="p-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute right-8 top-8 w-16 h-16 bg-white/10 rounded-full"></div>
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.name || user?.email?.split('@')[0]}! 👋
            </h1>
            <p className="text-blue-100 text-lg">
              Ready for your next journey? Let&apos;s get you on the road.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Ticket className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Upcoming</p>
                <p className="text-2xl font-bold text-gray-900">{upcomingBookings.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{pendingBookings.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{completedBookings.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Quick Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              onClick={() => router.push('/book-exam')}
              className="h-20 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white"
            >
              <div className="flex flex-col items-center space-y-2">
                <FileText className="h-6 w-6" />
                <span>Book Exam</span>
              </div>
            </Button>

            <Button 
              onClick={() => router.push('/profile')}
              className="h-20 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
            >
              <div className="flex flex-col items-center space-y-2">
                <User className="h-6 w-6" />
                <span>My Profile</span>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity & Popular Routes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Popular Routes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="h-5 w-5" />
              <span>Popular Routes</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recommendations.slice(0, 3).length > 0 ? (
              <div className="space-y-4">
                {recommendations.slice(0, 3).map((rec) => (
                  <div 
                    key={rec._id} 
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => router.push('/bookings')}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-2xl">{rec.icon}</span>
                      <h4 className="font-semibold text-gray-900">{rec.route}</h4>
                    </div>
                    <p className="text-sm text-gray-600">{rec.desc}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No recommendations available</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Ticket className="h-5 w-5" />
              <span>Recent Bookings</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {bookings.slice(0, 3).length > 0 ? (
              <div className="space-y-4">
                {bookings.slice(0, 3).map((booking) => (
                  <div key={booking._id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {booking.routeFrom} → {booking.routeTo}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {new Date(booking.date).toLocaleDateString()} • Seats: {booking.seatNumbers.join(', ')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">₹{booking.price}</p>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                          {getStatusIcon(booking.status)}
                          <span className="ml-1">{booking.status}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Bus className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No recent bookings</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderBookings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Ticket className="h-5 w-5" />
            <span>My Bookings</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {bookings.length > 0 ? (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div key={booking._id} className="p-6 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <MapPin className="h-5 w-5 text-gray-500" />
                        <h3 className="text-lg font-semibold text-gray-900">
                          {booking.routeFrom} → {booking.routeTo}
                        </h3>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(booking.date).toLocaleDateString()}</span>
                        </span>
                        <span>Seats: {booking.seatNumbers.join(', ')}</span>
                        {booking.timing && (
                          <span className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{booking.timing}</span>
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600 mb-2">₹{booking.price}</p>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(booking.status)}`}>
                        {getStatusIcon(booking.status)}
                        <span className="ml-1 capitalize">{booking.status}</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Bus className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings yet</h3>
              <p className="text-gray-600 mb-6">Start your journey by booking your first bus trip</p>
              <Button 
                onClick={() => router.push('/bookings')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Book Your First Trip
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Bus className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Smartify</h1>
              <p className="text-sm text-gray-500">Dashboard</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {sidebarItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'book') router.push('/bookings?tab=book');
                    else if (item.id === 'exam') router.push('/book-exam');
                    else if (item.id === 'profile') router.push('/profile');
                    else if (item.id === 'bookings') router.push('/bookings');
                    else setActiveTab(item.id);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === item.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <IconComponent className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => router.push('/profile')}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <Settings className="h-5 w-5" />
            <span className="font-medium">Settings</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'bookings' && renderBookings()}
          {activeTab === 'exam' && (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Book Exam</h3>
              <p className="text-gray-600 mb-6">Navigate to the exam booking page to schedule your exam</p>
              <Button onClick={() => router.push('/book-exam')}>
                Go to Exam Booking
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
          {activeTab === 'profile' && (
            <div className="text-center py-12">
              <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Profile</h3>
              <p className="text-gray-600 mb-6">Manage your profile and account settings</p>
              <Button onClick={() => router.push('/profile')}>
                Go to Profile
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 