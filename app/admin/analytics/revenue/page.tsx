"use client";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface RevenueAnalytics {
  totalRevenue: number;
  revenueThisMonth: number;
  revenueThisWeek: number;
  averageOrderValue: number;
  revenueGrowth: number;
  topRevenueRoutes: { route: string; revenue: number }[];
  revenueTrend: { date: string; revenue: number }[];
  revenueByStatus: { status: string; revenue: number }[];
  monthlyRevenue: { month: string; revenue: number }[];
}

export default function RevenueAnalyticsPage() {
  const [analytics, setAnalytics] = useState<RevenueAnalytics | null>(null);
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
          fetch('/api/admin/analytics/revenue')
            .then(res => res.json())
            .then(setAnalytics)
            .catch(() => setError('Failed to load revenue analytics.'))
            .finally(() => setLoading(false));
        }
      });
  }, [router]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>Loading revenue analytics...</div>
      ) : error ? (
        <div style={{ color: '#ff5e62', textAlign: 'center', padding: '40px' }}>{error}</div>
      ) : !analytics ? null : (
        <>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 32 }}>Revenue Analytics</h1>
          
          {/* Key Metrics */}
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 40 }}>
            <StatCard label="Total Revenue" value={formatCurrency(analytics.totalRevenue)} trend="+23.5%" />
            <StatCard label="This Month" value={formatCurrency(analytics.revenueThisMonth)} trend="+18.2%" />
            <StatCard label="This Week" value={formatCurrency(analytics.revenueThisWeek)} trend="+15.7%" />
            <StatCard label="Avg. Order Value" value={formatCurrency(analytics.averageOrderValue)} trend="+8.9%" />
          </div>

          {/* Charts Section */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 40 }}>
            {/* Revenue Trend */}
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 24 }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 20 }}>Daily Revenue Trend</h3>
              <RevenueTrendChart data={analytics.revenueTrend} />
            </div>

            {/* Revenue by Status */}
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 24 }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 20 }}>Revenue by Status</h3>
              <RevenueStatusChart data={analytics.revenueByStatus} />
            </div>
          </div>

          {/* Monthly Revenue and Top Routes */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 40 }}>
            {/* Monthly Revenue */}
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 24 }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 20 }}>Monthly Revenue (2024)</h3>
              <MonthlyRevenueChart data={analytics.monthlyRevenue} />
            </div>

            {/* Top Revenue Routes */}
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 24 }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 20 }}>Top Revenue Routes</h3>
              <TopRevenueRoutesList routes={analytics.topRevenueRoutes} />
            </div>
          </div>
        </>
      )}
    </>
  );
}

function StatCard({ label, value, trend }: { label: string; value: string; trend?: string }) {
  const isPositive = trend?.startsWith('+');
  const isNegative = trend?.startsWith('-');
  
  return (
    <div style={{ background: 'rgba(255,255,255,0.10)', borderRadius: 16, padding: 24, minWidth: 220, textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
      <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 4, color: '#10b981' }}>{value}</div>
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

function RevenueTrendChart({ data }: { data: { date: string; revenue: number }[] }) {
  const max = Math.max(...data.map(d => d.revenue), 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 120 }}>
      {data.map((d, index) => (
        <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
          <div style={{ 
            background: 'linear-gradient(180deg, #10b981 0%, #059669 100%)', 
            height: `${(d.revenue / max) * 80}px`, 
            width: '100%', 
            borderRadius: 4, 
            marginBottom: 6, 
            transition: 'height 0.3s' 
          }} />
          <div style={{ fontSize: 10, color: '#94a3b8' }}>₹{(d.revenue / 1000).toFixed(0)}k</div>
          <div style={{ fontSize: 9, color: '#64748b', marginTop: 2 }}>{d.date.slice(5)}</div>
        </div>
      ))}
    </div>
  );
}

function RevenueStatusChart({ data }: { data: { status: string; revenue: number }[] }) {
  const total = data.reduce((sum, item) => sum + item.revenue, 0);
  const colors = ['#10b981', '#f59e0b', '#ef4444'];
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {data.map((item, index) => {
        const percentage = ((item.revenue / total) * 100).toFixed(1);
        return (
          <div key={item.status} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ 
              width: 12, 
              height: 12, 
              borderRadius: '50%', 
              background: colors[index % colors.length] 
            }} />
            <div style={{ flex: 1, fontSize: '0.9rem' }}>{item.status}</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#10b981' }}>
              ₹{(item.revenue / 100000).toFixed(1)}L
            </div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', minWidth: 40 }}>{percentage}%</div>
          </div>
        );
      })}
    </div>
  );
}

function MonthlyRevenueChart({ data }: { data: { month: string; revenue: number }[] }) {
  const max = Math.max(...data.map(d => d.revenue), 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 120 }}>
      {data.map((d, index) => (
        <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
          <div style={{ 
            background: 'linear-gradient(180deg, #3b82f6 0%, #1d4ed8 100%)', 
            height: `${(d.revenue / max) * 80}px`, 
            width: '100%', 
            borderRadius: 4, 
            marginBottom: 6, 
            transition: 'height 0.3s' 
          }} />
          <div style={{ fontSize: 9, color: '#94a3b8' }}>₹{(d.revenue / 1000).toFixed(0)}k</div>
          <div style={{ fontSize: 8, color: '#64748b', marginTop: 2 }}>{d.month}</div>
        </div>
      ))}
    </div>
  );
}

function TopRevenueRoutesList({ routes }: { routes: { route: string; revenue: number }[] }) {
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
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#10b981' }}>
            ₹{(route.revenue / 100000).toFixed(1)}L
          </div>
        </div>
      ))}
    </div>
  );
} 