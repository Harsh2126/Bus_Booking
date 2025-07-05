'use client';
import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface TrendMonth {
  month: string;
  count?: number;
  revenue?: number;
}
interface TopItem {
  city?: string;
  route?: string;
  count: number;
}

export default function TrendsAnalyticsPage() {
  const [data, setData] = useState<{
    bookingsPerMonth: TrendMonth[];
    revenuePerMonth: TrendMonth[];
    registrationsPerMonth: TrendMonth[];
    topCities: TopItem[];
    topRoutes: TopItem[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/admin/analytics/trends')
      .then(res => res.json())
      .then(setData)
      .catch(() => setError('Failed to load trends analytics.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 32 }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 24 }}>Trends Analytics</h1>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div style={{ color: '#ef4444' }}>{error}</div>
      ) : !data ? null : (
        <>
          {/* Bookings per month */}
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '32px 0 12px' }}>Bookings Per Month</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.bookingsPerMonth} margin={{ top: 16, right: 32, left: 0, bottom: 0 }}>
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>

          {/* Revenue per month */}
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '32px 0 12px' }}>Revenue Per Month</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.revenuePerMonth} margin={{ top: 16, right: 32, left: 0, bottom: 0 }}>
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip formatter={v => `₹${v}`} />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>

          {/* Registrations per month */}
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '32px 0 12px' }}>User Registrations Per Month</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.registrationsPerMonth} margin={{ top: 16, right: 32, left: 0, bottom: 0 }}>
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#fbbf24" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>

          {/* Top cities by bookings */}
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '32px 0 12px' }}>Top 5 Cities by Bookings</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.topCities} margin={{ top: 16, right: 32, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="city" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>

          {/* Top routes by bookings */}
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '32px 0 12px' }}>Top 5 Routes by Bookings</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.topRoutes} margin={{ top: 16, right: 32, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="route" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
} 