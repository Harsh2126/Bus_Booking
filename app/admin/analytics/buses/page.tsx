'use client';
import { useEffect, useState } from 'react';
import { Bar, BarChart, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface BusPerformance {
  name: string;
  number: string;
  capacity: number;
  status: string;
  totalBookings: number;
  avgOccupancy: number;
}

export default function BusPerformancePage() {
  const [data, setData] = useState<{ buses: BusPerformance[]; topBuses: BusPerformance[]; statusCounts: Record<string, number> } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/admin/analytics/buses')
      .then(res => res.json())
      .then(setData)
      .catch(() => setError('Failed to load bus performance analytics.'))
      .finally(() => setLoading(false));
  }, []);

  const COLORS = ['#2563eb', '#10b981', '#fbbf24', '#ef4444', '#6366f1'];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 32 }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 24 }}>Bus Performance Analytics</h1>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div style={{ color: '#ef4444' }}>{error}</div>
      ) : !data ? null : (
        <>
          {/* Table of all buses */}
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '32px 0 12px' }}>All Buses</h2>
          <div style={{ overflowX: 'auto', marginBottom: 32 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: 'rgba(255,255,255,0.10)' }}>
              <thead>
                <tr style={{ background: '#f3f4f6' }}>
                  <th style={{ padding: 10, textAlign: 'left' }}>Name</th>
                  <th style={{ padding: 10, textAlign: 'left' }}>Number</th>
                  <th style={{ padding: 10, textAlign: 'left' }}>Capacity</th>
                  <th style={{ padding: 10, textAlign: 'left' }}>Status</th>
                  <th style={{ padding: 10, textAlign: 'left' }}>Total Bookings</th>
                  <th style={{ padding: 10, textAlign: 'left' }}>Avg. Occupancy (%)</th>
                </tr>
              </thead>
              <tbody>
                {data.buses.map((bus, idx) => (
                  <tr key={bus.number || idx} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: 8 }}>{bus.name}</td>
                    <td style={{ padding: 8 }}>{bus.number}</td>
                    <td style={{ padding: 8 }}>{bus.capacity}</td>
                    <td style={{ padding: 8 }}>{bus.status}</td>
                    <td style={{ padding: 8 }}>{bus.totalBookings}</td>
                    <td style={{ padding: 8 }}>{bus.avgOccupancy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bar chart: Top 5 buses by bookings */}
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '32px 0 12px' }}>Top 5 Buses by Bookings</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.topBuses} margin={{ top: 16, right: 32, left: 0, bottom: 0 }}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="totalBookings" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>

          {/* Pie chart: Bus status distribution */}
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '32px 0 12px' }}>Bus Status Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={Object.entries(data.statusCounts).map(([status, count]) => ({ name: status, value: count }))}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {Object.entries(data.statusCounts).map((entry, idx) => (
                  <Cell key={entry[0]} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
} 