"use client";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

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
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: '#0f172a'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🛡️</div>
          <div style={{ fontSize: '18px', color: '#94a3b8' }}>Loading admin dashboard...</div>
        </div>
      </div>
    );
  }

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'users', label: 'User Management', icon: '👥' },
    { id: 'bookings', label: 'Booking Management', icon: '📋' },
    { id: 'buses', label: 'Bus Management', icon: '🚌' },
    { id: 'cities', label: 'City Management', icon: '🌆' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'recommendations', label: 'Recommendations', icon: '⭐' },
  ];

  const renderOverview = () => (
    <div>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
        borderRadius: '20px',
        padding: '32px',
        color: 'white',
        marginBottom: '32px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', right: '-20px', top: '-20px', fontSize: '120px', opacity: '0.1' }}>🛡️</div>
        <h1 style={{ margin: '0 0 8px 0', fontSize: '32px', fontWeight: '700' }}>
          Admin Dashboard
        </h1>
        <p style={{ margin: 0, fontSize: '16px', opacity: '0.9' }}>
          Welcome back, {user?.name || user?.email}! Manage your bus booking system.
        </p>
      </div>

      {/* Analytics Cards */}
      {analytics && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          marginBottom: '32px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            borderRadius: '16px',
            padding: '24px',
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', right: '-10px', top: '-10px', fontSize: '60px', opacity: '0.2' }}>👥</div>
            <div style={{ fontSize: '14px', opacity: '0.9', marginBottom: '8px' }}>TOTAL USERS</div>
            <div style={{ fontSize: '36px', fontWeight: '700', marginBottom: '4px' }}>
              {analytics.totalUsers}
            </div>
            <div style={{ fontSize: '12px', opacity: '0.8' }}>Registered users</div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            borderRadius: '16px',
            padding: '24px',
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', right: '-10px', top: '-10px', fontSize: '60px', opacity: '0.2' }}>🚌</div>
            <div style={{ fontSize: '14px', opacity: '0.9', marginBottom: '8px' }}>TOTAL BOOKINGS</div>
            <div style={{ fontSize: '36px', fontWeight: '700', marginBottom: '4px' }}>
              {analytics.totalBookings}
            </div>
            <div style={{ fontSize: '12px', opacity: '0.8' }}>All time bookings</div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            borderRadius: '16px',
            padding: '24px',
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', right: '-10px', top: '-10px', fontSize: '60px', opacity: '0.2' }}>💰</div>
            <div style={{ fontSize: '14px', opacity: '0.9', marginBottom: '8px' }}>TOTAL REVENUE</div>
            <div style={{ fontSize: '36px', fontWeight: '700', marginBottom: '4px' }}>
              ₹{analytics.totalRevenue?.toLocaleString() || 0}
            </div>
            <div style={{ fontSize: '12px', opacity: '0.8' }}>Total earnings</div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            borderRadius: '16px',
            padding: '24px',
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', right: '-10px', top: '-10px', fontSize: '60px', opacity: '0.2' }}>⏳</div>
            <div style={{ fontSize: '14px', opacity: '0.9', marginBottom: '8px' }}>PENDING</div>
            <div style={{ fontSize: '36px', fontWeight: '700', marginBottom: '4px' }}>
              {analytics.pendingBookings}
            </div>
            <div style={{ fontSize: '12px', opacity: '0.8' }}>Awaiting approval</div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div style={{
        background: '#1e293b',
        borderRadius: '20px',
        padding: '32px',
        marginBottom: '32px',
        border: '1px solid #334155'
      }}>
        <h2 style={{ margin: '0 0 24px 0', fontSize: '24px', fontWeight: '600', color: 'white' }}>
          Quick Actions
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px'
        }}>
          <button 
            onClick={() => router.push('/admin/bookings')}
            style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '20px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ fontSize: '32px' }}>📋</div>
            <div>Manage Bookings</div>
          </button>

          <button 
            onClick={() => router.push('/admin/buses')}
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '20px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ fontSize: '32px' }}>🚌</div>
            <div>Manage Buses</div>
          </button>

          <button 
            onClick={() => router.push('/admin/cities')}
            style={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '20px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ fontSize: '32px' }}>🌆</div>
            <div>Manage Cities</div>
          </button>

          <button 
            onClick={() => router.push('/admin/analytics')}
            style={{
              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '20px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ fontSize: '32px' }}>📈</div>
            <div>View Analytics</div>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '32px'
      }}>
        {/* Recent Users */}
        <div style={{
          background: '#1e293b',
          borderRadius: '20px',
          padding: '32px',
          border: '1px solid #334155'
        }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '20px', fontWeight: '600', color: 'white' }}>
            Recent Users
          </h3>
          {recentUsers.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {recentUsers.map((user) => (
                <div key={user._id} style={{
                  padding: '16px',
                  background: '#334155',
                  borderRadius: '12px',
                  border: '1px solid #475569'
                }}>
                  <div style={{ fontWeight: '600', color: 'white', marginBottom: '4px' }}>
                    {user.name || user.email}
                  </div>
                  <div style={{ fontSize: '14px', color: '#94a3b8' }}>
                    {user.email} • {user.role}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px', opacity: '0.5' }}>👥</div>
              <p style={{ color: '#94a3b8', margin: 0 }}>No recent users</p>
            </div>
          )}
        </div>

        {/* Recent Bookings */}
        <div style={{
          background: '#1e293b',
          borderRadius: '20px',
          padding: '32px',
          border: '1px solid #334155'
        }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '20px', fontWeight: '600', color: 'white' }}>
            Recent Bookings
          </h3>
          {recentBookings.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {recentBookings.map((booking) => (
                <div key={booking._id} style={{
                  padding: '16px',
                  background: '#334155',
                  borderRadius: '12px',
                  border: '1px solid #475569'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '8px'
                  }}>
                    <div style={{ fontWeight: '600', color: 'white' }}>
                      {booking.routeFrom} → {booking.routeTo}
                    </div>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '500',
                      background: booking.status === 'confirmed' ? '#059669' : 
                                booking.status === 'pending' ? '#d97706' : '#dc2626',
                      color: 'white'
                    }}>
                      {booking.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '14px', color: '#94a3b8' }}>
                    ₹{booking.price} • {new Date(booking.date).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px', opacity: '0.5' }}>📋</div>
              <p style={{ color: '#94a3b8', margin: 0 }}>No recent bookings</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div>
      <div style={{
        background: '#1e293b',
        borderRadius: '20px',
        padding: '32px',
        border: '1px solid #334155'
      }}>
        <h2 style={{ margin: '0 0 24px 0', fontSize: '24px', fontWeight: '600', color: 'white' }}>
          User Management
        </h2>
        <button 
          onClick={() => router.push('/admin/users')}
          style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            padding: '16px 32px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          View All Users
        </button>
      </div>
    </div>
  );

  const renderBookings = () => (
    <div>
      <div style={{
        background: '#1e293b',
        borderRadius: '20px',
        padding: '32px',
        border: '1px solid #334155'
      }}>
        <h2 style={{ margin: '0 0 24px 0', fontSize: '24px', fontWeight: '600', color: 'white' }}>
          Booking Management
        </h2>
        <button 
          onClick={() => router.push('/admin/bookings')}
          style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            padding: '16px 32px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Manage All Bookings
        </button>
      </div>
    </div>
  );

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: '#0f172a'
    }}>
      {/* Sidebar */}
      <div style={{
        width: '280px',
        background: '#1e293b',
        borderRight: '1px solid #334155',
        padding: '32px 0',
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflowY: 'auto'
      }}>
        <div style={{ padding: '0 24px', marginBottom: '32px' }}>
          <div style={{ 
            fontSize: '24px', 
            fontWeight: '700', 
            color: 'white',
            marginBottom: '8px'
          }}>
            Admin Panel
          </div>
          <div style={{ fontSize: '14px', color: '#94a3b8' }}>
            Bus Booking System
          </div>
        </div>

        <nav>
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'users') router.push('/admin/users');
                else if (item.id === 'bookings') router.push('/admin/bookings');
                else if (item.id === 'buses') router.push('/admin/buses');
                else if (item.id === 'cities') router.push('/admin/cities');
                else if (item.id === 'analytics') router.push('/admin/analytics');
                else if (item.id === 'recommendations') router.push('/admin/recommendations');
                else setActiveSection(item.id);
              }}
              style={{
                width: '100%',
                padding: '16px 24px',
                background: activeSection === item.id ? '#334155' : 'transparent',
                border: 'none',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '16px',
                color: activeSection === item.id ? 'white' : '#94a3b8',
                fontWeight: activeSection === item.id ? '600' : '500',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                if (activeSection !== item.id) {
                  e.currentTarget.style.background = '#334155';
                  e.currentTarget.style.color = 'white';
                }
              }}
              onMouseOut={(e) => {
                if (activeSection !== item.id) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#94a3b8';
                }
              }}
            >
              <div style={{ fontSize: '20px' }}>{item.icon}</div>
              <div>{item.label}</div>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        padding: '32px',
        overflowY: 'auto'
      }}>
        {activeSection === 'overview' && renderOverview()}
        {activeSection === 'users' && renderUsers()}
        {activeSection === 'bookings' && renderBookings()}
      </div>
    </div>
  );
} 