"use client";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface UserAnalytics {
  totalUsers: number;
  activeUsers: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
  userGrowthRate: number;
  topUserCities: { city: string; count: number }[];
  userRegistrationTrend: { date: string; count: number }[];
  userTypes: { type: string; count: number }[];
}

export default function UserAnalyticsPage() {
  const [analytics, setAnalytics] = useState<UserAnalytics | null>(null);
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
          fetch('/api/admin/analytics/users')
            .then(res => res.json())
            .then(setAnalytics)
            .catch(() => setError('Failed to load user analytics.'))
            .finally(() => setLoading(false));
        }
      });
  }, [router]);

  return (
    <>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>Loading user analytics...</div>
      ) : error ? (
        <div style={{ color: '#ff5e62', textAlign: 'center', padding: '40px' }}>{error}</div>
      ) : !analytics ? null : (
        <>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 32 }}>User Analytics</h1>
          
          {/* Key Metrics */}
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 40 }}>
            <StatCard label="Total Users" value={analytics.totalUsers} trend="+12.5%" />
            <StatCard label="Active Users" value={analytics.activeUsers} trend="+8.2%" />
            <StatCard label="New Users (Week)" value={analytics.newUsersThisWeek} trend="+15.3%" />
            <StatCard label="New Users (Month)" value={analytics.newUsersThisMonth} trend="+22.1%" />
          </div>

          {/* Charts Section */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 40 }}>
            {/* User Registration Trend */}
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 24 }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 20 }}>User Registration Trend</h3>
              <UserRegistrationChart data={analytics.userRegistrationTrend} />
            </div>

            {/* User Types Distribution */}
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 24 }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 20 }}>User Types Distribution</h3>
              <UserTypesChart data={analytics.userTypes} />
            </div>
          </div>

          {/* Top Cities */}
          <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 24 }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 20 }}>Top User Cities</h3>
            <TopCitiesList cities={analytics.topUserCities} />
          </div>
        </>
      )}
    </>
  );
}

function StatCard({ label, value, trend }: { label: string; value: number; trend?: string }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.10)', borderRadius: 16, padding: 24, minWidth: 200, textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
      <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 4 }}>{value.toLocaleString()}</div>
      {trend && (
        <div style={{ fontSize: '0.9rem', color: '#10b981', fontWeight: 600 }}>{trend}</div>
      )}
    </div>
  );
}

function UserRegistrationChart({ data }: { data: { date: string; count: number }[] }) {
  const max = Math.max(...data.map(d => d.count), 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 120 }}>
      {data.map((d, index) => (
        <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
          <div style={{ 
            background: 'linear-gradient(180deg, #3b82f6 0%, #1d4ed8 100%)', 
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

function UserTypesChart({ data }: { data: { type: string; count: number }[] }) {
  const total = data.reduce((sum, item) => sum + item.count, 0);
  const colors = ['#3b82f6', '#10b981', '#f59e0b'];
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {data.map((item, index) => {
        const percentage = ((item.count / total) * 100).toFixed(1);
        return (
          <div key={item.type} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ 
              width: 12, 
              height: 12, 
              borderRadius: '50%', 
              background: colors[index % colors.length] 
            }} />
            <div style={{ flex: 1, fontSize: '0.9rem' }}>{item.type}</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{item.count}</div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', minWidth: 40 }}>{percentage}%</div>
          </div>
        );
      })}
    </div>
  );
}

function TopCitiesList({ cities }: { cities: { city: string; count: number }[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {cities.map((city, index) => (
        <div key={city.city} style={{ 
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
          <div style={{ flex: 1, fontSize: '1rem', fontWeight: 600 }}>{city.city}</div>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: '#3b82f6' }}>{city.count}</div>
        </div>
      ))}
    </div>
  );
} 