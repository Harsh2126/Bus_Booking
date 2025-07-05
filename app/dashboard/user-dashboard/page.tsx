"use client";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

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
          
          Promise.all([
            fetch('/api/bookings').then(res => res.json()),
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
    new Date(booking.date) > new Date()
  );

  const pendingBookings = bookings.filter(booking => 
    booking.status === 'pending'
  );

  const completedBookings = bookings.filter(booking => 
    new Date(booking.date) <= new Date() && booking.status === 'confirmed'
  );

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: '#f8fafc'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚌</div>
          <div style={{ fontSize: '18px', color: '#64748b' }}>Loading your dashboard...</div>
        </div>
      </div>
    );
  }

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: '🏠' },
    { id: 'bookings', label: 'My Bookings', icon: '📋' },
    { id: 'exam', label: 'Book Exam', icon: '📝' },
    { id: 'profile', label: 'Profile', icon: '👤' },
  ];

  const renderOverview = () => (
    <div>
      {/* Welcome Section */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '20px',
        padding: '32px',
        color: 'white',
        marginBottom: '32px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', right: '-20px', top: '-20px', fontSize: '120px', opacity: '0.1' }}>🚌</div>
        <h1 style={{ margin: '0 0 8px 0', fontSize: '32px', fontWeight: '700' }}>
          Welcome back, {user?.name || user?.email?.split('@')[0]}!
        </h1>
        <p style={{ margin: 0, fontSize: '16px', opacity: '0.9' }}>
          Ready for your next journey? Let's get you on the road.
        </p>
      </div>

      {/* Booking Count Card */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
        border: '1px solid #e2e8f0',
        marginBottom: '32px',
        maxWidth: 320,
        marginLeft: 'auto',
        marginRight: 'auto',
        textAlign: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
          <div style={{ fontSize: '24px', marginRight: '12px' }}>🎫</div>
          <div style={{ fontSize: '14px', color: '#64748b', fontWeight: '500' }}>TOTAL BOOKINGS</div>
        </div>
        <div style={{ fontSize: '32px', fontWeight: '700', color: '#1e293b' }}>
          {bookings.length}
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '32px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
        border: '1px solid #e2e8f0',
        marginBottom: '32px'
      }}>
        <h2 style={{ margin: '0 0 24px 0', fontSize: '24px', fontWeight: '600', color: '#1e293b' }}>
          Quick Actions
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px'
        }}>
          <button 
            onClick={() => router.push('/book-exam')}
            style={{
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
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
            <div style={{ fontSize: '32px' }}>📝</div>
            <div>Book Exam</div>
          </button>

          <button 
            onClick={() => router.push('/profile')}
            style={{
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
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
            <div style={{ fontSize: '32px' }}>👤</div>
            <div>My Profile</div>
          </button>
        </div>
      </div>

      {/* Recent Activity & Popular Routes */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '32px'
      }}>
        {/* Popular Routes */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '32px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '20px', fontWeight: '600', color: '#1e293b' }}>
            Popular Routes
          </h3>
          {recommendations.slice(0, 3).length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {recommendations.slice(0, 3).map((rec) => (
                <div key={rec._id} style={{
                  padding: '16px',
                  background: '#f8fafc',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  cursor: 'pointer',
                  transition: 'transform 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                onClick={() => router.push('/bookings')}
                >
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px',
                    marginBottom: '8px'
                  }}>
                    <div style={{ fontSize: '24px' }}>{rec.icon}</div>
                    <div style={{ fontWeight: '600', color: '#1e293b' }}>
                      {rec.route}
                    </div>
                  </div>
                  <div style={{ fontSize: '14px', color: '#64748b' }}>
                    {rec.desc}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px', opacity: '0.5' }}>⭐</div>
              <p style={{ color: '#64748b', margin: 0 }}>No recommendations available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderBookings = () => (
    <div>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '32px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
        border: '1px solid #e2e8f0'
      }}>
        <h2 style={{ margin: '0 0 24px 0', fontSize: '24px', fontWeight: '600', color: '#1e293b' }}>
          My Bookings
        </h2>
        {bookings.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {bookings.map((booking) => (
              <div key={booking._id} style={{
                padding: '24px',
                background: '#f8fafc',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                position: 'relative'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  marginBottom: '12px'
                }}>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '18px', color: '#1e293b', marginBottom: '4px' }}>
                      {booking.routeFrom} → {booking.routeTo}
                    </div>
                    <div style={{ fontSize: '14px', color: '#64748b' }}>
                      {new Date(booking.date).toLocaleDateString()} • Seats: {booking.seatNumbers.join(', ')}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ 
                      fontSize: '20px', 
                      fontWeight: '700', 
                      color: '#059669',
                      marginBottom: '8px'
                    }}>
                      ₹{booking.price}
                    </div>
                    <span style={{
                      padding: '6px 16px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      background: booking.status === 'confirmed' ? '#dcfce7' : 
                                booking.status === 'pending' ? '#fef3c7' : '#fecaca',
                      color: booking.status === 'confirmed' ? '#15803d' : 
                             booking.status === 'pending' ? '#d97706' : '#dc2626'
                    }}>
                      {booking.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '64px', marginBottom: '24px', opacity: '0.5' }}>🚌</div>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '20px', fontWeight: '600', color: '#1e293b' }}>
              No bookings yet
            </h3>
            <p style={{ color: '#64748b', margin: '0 0 24px 0' }}>
              Start your journey by booking your first bus trip
            </p>
            <button 
              onClick={() => router.push('/bookings')}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '16px 32px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Book Your First Trip
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: '#f8fafc'
    }}>
      {/* Sidebar */}
      <div style={{
        width: '280px',
        background: 'white',
        borderRight: '1px solid #e2e8f0',
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
            color: '#1e293b',
            marginBottom: '8px'
          }}>
            BusBooking
          </div>
          <div style={{ fontSize: '14px', color: '#64748b' }}>
            Dashboard
          </div>
        </div>

        <nav>
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'book') router.push('/bookings?tab=book');
                else if (item.id === 'exam') router.push('/book-exam');
                else if (item.id === 'profile') router.push('/profile');
                else if (item.id === 'bookings') router.push('/bookings');
                else setActiveTab(item.id);
              }}
              style={{
                width: '100%',
                padding: '16px 24px',
                background: activeTab === item.id ? '#f1f5f9' : 'transparent',
                border: 'none',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '16px',
                color: activeTab === item.id ? '#1e293b' : '#64748b',
                fontWeight: activeTab === item.id ? '600' : '500',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                if (activeTab !== item.id) {
                  e.currentTarget.style.background = '#f8fafc';
                }
              }}
              onMouseOut={(e) => {
                if (activeTab !== item.id) {
                  e.currentTarget.style.background = 'transparent';
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
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'bookings' && renderBookings()}
      </div>
    </div>
  );
} 