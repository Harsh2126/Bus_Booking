"use client";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Analytics {
  totalBookings: number;
  totalUsers: number;
  totalAdmins: number;
  topCities: { city: string; count: number }[];
  bookingsPerDay: { _id: string; count: number }[];
}

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
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
          fetch('/api/admin/analytics')
            .then(res => res.json())
            .then(setAnalytics)
            .catch(() => setError('Failed to load analytics.'))
            .finally(() => setLoading(false));
        }
      });
  }, [router]);

  if (loading) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '40px',
        color: '#94a3b8',
        fontSize: '18px'
      }}>
        Loading analytics...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        color: '#ef4444', 
        textAlign: 'center', 
        padding: '40px',
        fontSize: '16px'
      }}>
        {error}
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div>
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginBottom: '32px' }}>
        <StatCard label="Total Bookings" value={analytics.totalBookings} />
        <StatCard label="Total Users" value={analytics.totalUsers} />
        <StatCard label="Total Admins" value={analytics.totalAdmins} />
        <StatCard label="Top Cities" value={analytics.topCities.map((c) => `${c.city} (${c.count})`).join(', ') || 'N/A'} />
      </div>

      <div style={{ 
        background: '#334155',
        borderRadius: '16px',
        border: '1px solid #475569',
        padding: '32px'
      }}>
        <h3 style={{ 
          fontSize: '18px', 
          fontWeight: '600', 
          marginBottom: '24px',
          color: 'white'
        }}>
          Bookings Per Day (Last 7 Days)
        </h3>
        <BookingsChart data={analytics.bookingsPerDay} />
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={{ 
      background: '#334155', 
      borderRadius: '12px', 
      padding: '24px', 
      minWidth: '200px', 
      textAlign: 'center',
      border: '1px solid #475569',
      flex: '1'
    }}>
      <div style={{ 
        fontWeight: '600', 
        fontSize: '14px', 
        marginBottom: '8px',
        color: '#94a3b8'
      }}>
        {label}
      </div>
      <div style={{ 
        fontSize: '24px', 
        fontWeight: '700',
        color: 'white'
      }}>
        {value}
      </div>
    </div>
  );
}

function BookingsChart({ data }: { data: { _id: string; count: number }[] }) {
  // Simple bar chart using divs (no external library)
  const max = Math.max(...data.map(d => d.count), 1);
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'flex-end', 
      gap: '12px', 
      height: '180px', 
      marginBottom: '32px' 
    }}>
      {data.map(d => (
        <div key={d._id} style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          width: '36px' 
        }}>
          <div style={{ 
            background: 'linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%)', 
            height: `${(d.count / max) * 140}px`, 
            width: '24px', 
            borderRadius: '8px', 
            marginBottom: '6px', 
            transition: 'height 0.3s' 
          }} />
          <div style={{ 
            fontSize: '13px', 
            color: 'white',
            fontWeight: '600'
          }}>
            {d.count}
          </div>
          <div style={{ 
            fontSize: '12px', 
            color: '#94a3b8', 
            marginTop: '2px' 
          }}>
            {d._id.slice(5)}
          </div>
        </div>
      ))}
    </div>
  );
} 