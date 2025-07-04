"use client";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<any>(null);
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

  return (
    <AdminLayout pageTitle="Analytics">
      {loading ? (
        <div style={{ marginTop: 64, textAlign: 'center' }}>Loading analytics...</div>
      ) : error ? (
        <div style={{ color: '#ff5e62', marginTop: 64, textAlign: 'center' }}>{error}</div>
      ) : !analytics ? null : (
        <>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 32 }}>Admin Analytics</h1>
          <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', marginBottom: 32 }}>
            <StatCard label="Total Bookings" value={analytics.totalBookings} />
            <StatCard label="Total Users" value={analytics.totalUsers} />
            <StatCard label="Total Admins" value={analytics.totalAdmins} />
            <StatCard label="Top Cities" value={analytics.topCities.map((c: any) => `${c.city} (${c.count})`).join(', ') || 'N/A'} />
          </div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 18 }}>Bookings Per Day (Last 7 Days)</h2>
          <BookingsChart data={analytics.bookingsPerDay} />
        </>
      )}
    </AdminLayout>
  );
}

function StatCard({ label, value }: { label: string; value: any }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.10)', borderRadius: 16, padding: 24, minWidth: 180, textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
      <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{value}</div>
    </div>
  );
}

function BookingsChart({ data }: { data: { _id: string; count: number }[] }) {
  // Simple bar chart using divs (no external library)
  const max = Math.max(...data.map(d => d.count), 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 180, marginBottom: 32 }}>
      {data.map(d => (
        <div key={d._id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 36 }}>
          <div style={{ background: 'linear-gradient(90deg, #ffb347 0%, #ff5e62 100%)', height: `${(d.count / max) * 140}px`, width: 24, borderRadius: 8, marginBottom: 6, transition: 'height 0.3s' }} />
          <div style={{ fontSize: 13, color: '#ffeaea' }}>{d.count}</div>
          <div style={{ fontSize: 12, color: '#aaa', marginTop: 2 }}>{d._id.slice(5)}</div>
        </div>
      ))}
    </div>
  );
} 