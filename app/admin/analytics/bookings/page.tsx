"use client";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface BookingAnalytics {
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  pendingBookings: number;
  averageBookingValue: number;
  bookingsThisWeek: number;
  bookingsThisMonth: number;
  topRoutes: { route: string; count: number }[];
  bookingTrend: { date: string; count: number }[];
  bookingStatusDistribution: { status: string; count: number }[];
  peakHours: { hour: string; count: number }[];
}

export default function BookingAnalyticsPage() {
  const [analytics, setAnalytics] = useState<BookingAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Check admin role
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (!data.user || data.user.role !== 'admin') {
          router.replace('/dashboard');
        } else {
          // Fetch real analytics data
          fetch('/api/admin/analytics/bookings')
            .then(res => res.json())
            .then(setAnalytics)
            .catch(() => setError('Failed to load booking analytics.'))
            .finally(() => setLoading(false));
        }
      });
  }, [router]);

  return (
    <>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>Loading booking analytics...</div>
      ) : error ? (
        <div style={{ color: '#ff5e62', textAlign: 'center', padding: '40px' }}>{error}</div>
      ) : !analytics ? null : (
        <>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 32 }}>Booking Analytics</h1>
          
          {/* Key Metrics */}
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 40 }}>
            <StatCard label="Total Bookings" value={analytics.totalBookings} trend="+18.5%" />
            <StatCard label="Completed" value={analytics.completedBookings} trend="+15.2%" />
            <StatCard label="Cancelled" value={analytics.cancelledBookings} trend="-5.3%" />
            <StatCard label="Pending" value={analytics.pendingBookings} trend="+2.1%" />
            <StatCard label="Avg. Value" value={`₹${analytics.averageBookingValue}`} trend="+8.7%" />
            <StatCard label="This Week" value={analytics.bookingsThisWeek} trend="+12.4%" />
          </div>

          {/* Charts Section */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 40 }}>
            {/* Booking Trend */}
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 24 }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 20 }}>Booking Trend (Last 7 Days)</h3>
              <BookingTrendChart data={analytics.bookingTrend} />
            </div>

            {/* Booking Status Distribution */}
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 24 }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 20 }}>Booking Status Distribution</h3>
              <BookingStatusChart data={analytics.bookingStatusDistribution} />
            </div>
          </div>

          {/* Top Routes and Peak Hours */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 40 }}>
            {/* Top Routes */}
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 24 }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 20 }}>Top Routes</h3>
              <TopRoutesList routes={analytics.topRoutes} />
            </div>

            {/* Peak Hours */}
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 24 }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 20 }}>Peak Booking Hours</h3>
              <PeakHoursChart data={analytics.peakHours} />
            </div>
          </div>
        </>
      )}
    </>
  );
}

function StatCard({ label, value, trend }: { label: string; value: string | number; trend?: string }) {
  const isPositive = trend?.startsWith('+');
  const isNegative = trend?.startsWith('-');
  
  return (
    <div style={{ background: 'rgba(255,255,255,0.10)', borderRadius: 16, padding: 24, minWidth: 180, textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
      <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 4 }}>{value}</div>
      {trend && (
        <div style={{ 
          fontSize: '0.9rem', 
          color: isPositive ? '#10b981' : isNegative ? '#ef4444' : '#6b7280', 
          fontWeight: 600 
        }}>
          {trend}
        </div>
      )}
    </div>
  );
}

function BookingTrendChart({ data }: { data: { date: string; count: number }[] }) {
  const max = Math.max(...data.map(d => d.count), 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 120 }}>
      {data.map((d, index) => (
        <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
          <div style={{ 
            background: 'linear-gradient(180deg, #10b981 0%, #059669 100%)', 
            height: `${(d.count / max) * 80}px`, 
            width: '100%', 
            borderRadius: 4, 
            marginBottom: 6, 
            transition: 'height 0.3s' 
          }} />
          <div style={{ fontSize: 12, color: '#94a3b8' }}>{d.count}</div>
          <div style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>{d.date.slice(5)}</div>
        </div>
      ))}
    </div>
  );
}

function BookingStatusChart({ data }: { data: { status: string; count: number }[] }) {
  const total = data.reduce((sum, item) => sum + item.count, 0);
  const colors = ['#10b981', '#ef4444', '#f59e0b'];
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {data.map((item, index) => {
        const percentage = ((item.count / total) * 100).toFixed(1);
        return (
          <div key={item.status} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ 
              width: 12, 
              height: 12, 
              borderRadius: '50%', 
              background: colors[index % colors.length] 
            }} />
            <div style={{ flex: 1, fontSize: '0.9rem' }}>{item.status}</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{item.count}</div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', minWidth: 40 }}>{percentage}%</div>
          </div>
        );
      })}
    </div>
  );
}

function TopRoutesList({ routes }: { routes: { route: string; count: number }[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {routes.map((route, index) => (
        <div key={route.route} style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 16, 
          padding: '12px 16px', 
          background: 'rgba(255,255,255,0.03)', 
          borderRadius: 8 
        }}>
          <div style={{ 
            width: 24, 
            height: 24, 
            borderRadius: '50%', 
            background: index === 0 ? '#fbbf24' : index === 1 ? '#94a3b8' : index === 2 ? '#f59e0b' : '#64748b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.8rem',
            fontWeight: 700,
            color: '#fff'
          }}>
            {index + 1}
          </div>
          <div style={{ flex: 1, fontSize: '0.9rem', fontWeight: 600 }}>{route.route}</div>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#10b981' }}>{route.count}</div>
        </div>
      ))}
    </div>
  );
}

function PeakHoursChart({ data }: { data: { hour: string; count: number }[] }) {
  const max = Math.max(...data.map(d => d.count), 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 120 }}>
      {data.map((d, index) => (
        <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
          <div style={{ 
            background: 'linear-gradient(180deg, #f59e0b 0%, #d97706 100%)', 
            height: `${(d.count / max) * 80}px`, 
            width: '100%', 
            borderRadius: 4, 
            marginBottom: 6, 
            transition: 'height 0.3s' 
          }} />
          <div style={{ fontSize: 10, color: '#94a3b8' }}>{d.count}</div>
          <div style={{ fontSize: 9, color: '#64748b', marginTop: 2 }}>{d.hour}</div>
        </div>
      ))}
    </div>
  );
} 