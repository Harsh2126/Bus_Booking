"use client";
import {
    AlertCircle,
    ArrowRight,
    BarChart3,
    Bus,
    CheckCircle,
    Clock,
    DollarSign,
    FileText,
    MapPin,
    Settings,
    Shield,
    Star,
    Ticket,
    TrendingUp,
    UserPlus,
    Users,
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
  role: string;
  createdAt: string;
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
  userId: string;
  createdAt: string;
}

interface Analytics {
  totalUsers: number;
  totalBookings: number;
  totalRevenue: number;
  pendingBookings: number;
}

interface Recommendation {
  _id: string;
  icon: string;
  route: string;
  desc: string;
}

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');
  const router = useRouter();

  useEffect(() => {
    fetch('/api/auth/me')
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          if (data.user?.role !== 'admin') {
            router.replace('/dashboard/user-dashboard');
            return;
          }
          setUser(data.user);
          
          Promise.all([
            fetch('/api/admin/analytics').then(res => res.json()),
            fetch('/api/users').then(res => res.json()),
            fetch('/api/bookings/all').then(res => res.json()),
            fetch('/api/recommendations').then(res => res.json())
          ]).then(([analyticsData, usersData, bookingsData, recommendationsData]) => {
            setAnalytics(analyticsData);
            setRecentUsers(usersData.users?.slice(0, 5) || []);
            setRecentBookings(bookingsData.bookings?.slice(0, 5) || []);
            setRecommendations(recommendationsData.recommendations || []);
            setLoading(false);
          }).catch(err => {
            console.error('Error fetching dashboard data:', err);
            setLoading(false);
          });
        } else {
          router.replace('/login');
        }
      });
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Loading admin dashboard...</h2>
          <p className="text-gray-400">Please wait while we fetch your data</p>
        </div>
      </div>
    );
  }

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'bookings', label: 'Booking Management', icon: Ticket },
    { id: 'buses', label: 'Bus Management', icon: Bus },
    { id: 'cities', label: 'City Management', icon: MapPin },
    { id: 'recommendations', label: 'Recommendations', icon: Star },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
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
      {/* Header */}
      <Card className="bg-gradient-to-r from-slate-800 to-slate-700 text-white border-0">
        <CardContent className="p-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute right-8 top-8 w-16 h-16 bg-white/10 rounded-full"></div>
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2 flex items-center space-x-3">
              <Shield className="h-8 w-8" />
              <span>Admin Dashboard</span>
            </h1>
            <p className="text-slate-300 text-lg">
              Welcome back, {user?.name || user?.email}! Manage your bus booking system.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white border-0 hover:shadow-lg transition-shadow">
            <CardContent className="p-6 relative">
              <div className="absolute right-4 top-4 w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6" />
              </div>
              <div className="mb-4">
                <p className="text-blue-100 text-sm font-medium">TOTAL USERS</p>
                <p className="text-3xl font-bold">{analytics.totalUsers}</p>
                <p className="text-blue-200 text-xs">Registered users</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-600 to-green-700 text-white border-0 hover:shadow-lg transition-shadow">
            <CardContent className="p-6 relative">
              <div className="absolute right-4 top-4 w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Ticket className="h-6 w-6" />
              </div>
              <div className="mb-4">
                <p className="text-green-100 text-sm font-medium">TOTAL BOOKINGS</p>
                <p className="text-3xl font-bold">{analytics.totalBookings}</p>
                <p className="text-green-200 text-xs">All time bookings</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-amber-600 to-amber-700 text-white border-0 hover:shadow-lg transition-shadow">
            <CardContent className="p-6 relative">
              <div className="absolute right-4 top-4 w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6" />
              </div>
              <div className="mb-4">
                <p className="text-amber-100 text-sm font-medium">TOTAL REVENUE</p>
                <p className="text-3xl font-bold">₹{analytics.totalRevenue?.toLocaleString() || 0}</p>
                <p className="text-amber-200 text-xs">Total earnings</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-600 to-red-700 text-white border-0 hover:shadow-lg transition-shadow">
            <CardContent className="p-6 relative">
              <div className="absolute right-4 top-4 w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6" />
              </div>
              <div className="mb-4">
                <p className="text-red-100 text-sm font-medium">PENDING</p>
                <p className="text-3xl font-bold">{analytics.pendingBookings}</p>
                <p className="text-red-200 text-xs">Awaiting approval</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Users */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <UserPlus className="h-5 w-5" />
              <span>Recent Users</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentUsers.length > 0 ? (
              <div className="space-y-4">
                {recentUsers.map((user) => (
                  <div key={user._id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {user.name ? user.name[0].toUpperCase() : user.email[0].toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {user.name || 'No Name'}
                      </p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No recent users</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Bookings */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Recent Bookings</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentBookings.length > 0 ? (
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div key={booking._id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {booking.routeFrom} → {booking.routeTo}
                        </h4>
                        <p className="text-sm text-gray-600">
                          ₹{booking.price} • {new Date(booking.date).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                        {getStatusIcon(booking.status)}
                        <span className="ml-1 capitalize">{booking.status}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Ticket className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No recent bookings</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Quick Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button 
              onClick={() => router.push('/admin/users')}
              className="h-16 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
            >
              <div className="flex flex-col items-center space-y-1">
                <Users className="h-5 w-5" />
                <span className="text-sm">Manage Users</span>
              </div>
            </Button>

            <Button 
              onClick={() => router.push('/admin/bookings')}
              className="h-16 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
            >
              <div className="flex flex-col items-center space-y-1">
                <Ticket className="h-5 w-5" />
                <span className="text-sm">Manage Bookings</span>
              </div>
            </Button>

            <Button 
              onClick={() => router.push('/admin/buses')}
              className="h-16 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
            >
              <div className="flex flex-col items-center space-y-1">
                <Bus className="h-5 w-5" />
                <span className="text-sm">Manage Buses</span>
              </div>
            </Button>

            <Button 
              onClick={() => router.push('/admin/analytics')}
              className="h-16 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white"
            >
              <div className="flex flex-col items-center space-y-1">
                <BarChart3 className="h-5 w-5" />
                <span className="text-sm">View Analytics</span>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>User Management</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-6">
            Manage user accounts, view user details, and control user permissions.
          </p>
          <Button 
            onClick={() => router.push('/admin/users')}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
          >
            View All Users
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderBookings = () => (
    <div className="space-y-6">
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Ticket className="h-5 w-5" />
            <span>Booking Management</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-6">
            View and manage all bookings, approve pending requests, and track booking status.
          </p>
          <Button 
            onClick={() => router.push('/admin/bookings')}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
          >
            Manage All Bookings
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Admin Panel</h1>
              <p className="text-sm text-slate-400">Bus Booking System</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'users') router.push('/admin/users');
                    else if (item.id === 'bookings') router.push('/admin/bookings');
                    else if (item.id === 'buses') router.push('/admin/buses');
                    else if (item.id === 'cities') router.push('/admin/cities');
                    else if (item.id === 'recommendations') router.push('/admin/recommendations');
                    else setActiveSection(item.id);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeSection === item.id
                      ? 'bg-slate-700 text-white border border-slate-600'
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <IconComponent className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        <div className="p-4 border-t border-slate-700">
          <button
            onClick={() => router.push('/profile')}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          >
            <Settings className="h-5 w-5" />
            <span className="font-medium">Settings</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {activeSection === 'overview' && renderOverview()}
          {activeSection === 'users' && renderUsers()}
          {activeSection === 'bookings' && renderBookings()}
          {activeSection === 'buses' && (
            <div className="text-center py-12">
              <Bus className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Bus Management</h3>
              <p className="text-gray-600 mb-6">Navigate to the bus management page to manage buses</p>
              <Button onClick={() => router.push('/admin/buses')}>
                Go to Bus Management
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
          {activeSection === 'cities' && (
            <div className="text-center py-12">
              <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">City Management</h3>
              <p className="text-gray-600 mb-6">Navigate to the city management page to manage cities</p>
              <Button onClick={() => router.push('/admin/cities')}>
                Go to City Management
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
          {activeSection === 'recommendations' && (
            <div className="text-center py-12">
              <Star className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Recommendations</h3>
              <p className="text-gray-600 mb-6">Navigate to the recommendations page to manage popular routes</p>
              <Button onClick={() => router.push('/admin/recommendations')}>
                Go to Recommendations
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 