"use client";
import { usePathname, useRouter } from 'next/navigation';
import { useContext, useState } from 'react';
import { FaBus, FaCalendarAlt, FaChartBar, FaChartLine, FaDollarSign, FaUsers } from 'react-icons/fa';
import { ThemeContext } from '../../ThemeProvider';

const analyticsNavLinks = [
  { label: 'Overview', href: '/admin/analytics', icon: FaChartBar },
  { label: 'User Analytics', href: '/admin/analytics/users', icon: FaUsers },
  { label: 'Booking Analytics', href: '/admin/analytics/bookings', icon: FaCalendarAlt },
  { label: 'Revenue Analytics', href: '/admin/analytics/revenue', icon: FaDollarSign },
  { label: 'Bus Performance', href: '/admin/analytics/buses', icon: FaBus },
  { label: 'Trends', href: '/admin/analytics/trends', icon: FaChartLine },
];

const palettes = {
  blueSlate: {
    name: 'Blue & Slate',
    primary: '#2563eb',
    secondary: '#64748b',
    accent: '#fbbf24',
    bgLight: '#f8fafc',
    bgDark: '#0f172a',
    textLight: '#1e293b',
    textDark: '#f1f5f9',
    card: '#fff',
    cardDark: '#1e293b',
  },
  indigoEmerald: {
    name: 'Indigo & Emerald',
    primary: '#6366f1',
    secondary: '#10b981',
    accent: '#f59e42',
    bgLight: '#f3f4f6',
    bgDark: '#1e293b',
    textLight: '#111827',
    textDark: '#f3f4f6',
    card: '#fff',
    cardDark: '#334155',
  },
  classicCorporate: {
    name: 'Classic Corporate',
    primary: '#0052cc',
    secondary: '#172b4d',
    accent: '#36b37e',
    bgLight: '#f4f5f7',
    bgDark: '#222b45',
    textLight: '#172b4d',
    textDark: '#f4f5f7',
    card: '#fff',
    cardDark: '#222b45',
  },
};

export default function AnalyticsLayout({ children }: { children: React.ReactNode }) {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const palette = theme === 'light' ? palettes.classicCorporate : palettes.blueSlate;
  const pathname = usePathname();
  const router = useRouter();
  const [dateRange, setDateRange] = useState('7d');

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  const handleBackToAdmin = () => {
    router.push('/dashboard');
  };

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      background: '#0f172a',
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* Analytics Sidebar */}
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
            Analytics
          </div>
          <div style={{ fontSize: '14px', color: '#94a3b8' }}>
            Data Insights Dashboard
          </div>
        </div>
        
        {/* Back to Admin Button */}
        <div style={{ padding: '0 24px', marginBottom: '24px' }}>
          <button 
            onClick={handleBackToAdmin}
            style={{ 
              width: '100%',
              padding: '12px 16px', 
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              color: 'white', 
              border: 'none', 
              borderRadius: '8px', 
              fontWeight: '600', 
              fontSize: '14px', 
              cursor: 'pointer', 
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            ← Back to Admin
          </button>
        </div>

        {/* Date Range Selector */}
        <div style={{ padding: '0 24px', marginBottom: '24px' }}>
          <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#94a3b8' }}>Date Range</div>
          <select 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '12px', 
              borderRadius: '8px', 
              border: '1px solid #475569', 
              background: '#334155',
              color: 'white',
              fontSize: '14px'
            }}
          >
            <option value="1d">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option>
          </select>
        </div>

        {/* Analytics Navigation */}
        <nav>
          {analyticsNavLinks.map(link => {
            const IconComponent = link.icon;
            const isActive = pathname === link.href;
            return (
              <button
                key={link.label}
                onClick={() => router.push(link.href)}
                style={{
                  width: '100%',
                  padding: '16px 24px',
                  background: isActive ? '#334155' : 'transparent',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '16px',
                  color: isActive ? 'white' : '#94a3b8',
                  fontWeight: isActive ? '600' : '500',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = '#334155';
                    e.currentTarget.style.color = 'white';
                  }
                }}
                onMouseOut={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#94a3b8';
                  }
                }}
              >
                <IconComponent style={{ fontSize: '18px' }} /> 
                {link.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content Area */}
      <div style={{
        flex: 1,
        padding: '32px',
        overflowY: 'auto'
      }}>
        {/* Page Header */}
        <div style={{
          background: '#1e293b',
          borderRadius: '20px',
          padding: '32px',
          marginBottom: '32px',
          border: '1px solid #334155'
        }}>
          <h1 style={{ 
            margin: 0, 
            fontSize: '32px', 
            fontWeight: '700',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            Analytics Dashboard
          </h1>
          <p style={{ 
            margin: '8px 0 0 0', 
            color: '#94a3b8',
            fontSize: '16px'
          }}>
            Comprehensive insights into your bus booking system
          </p>
        </div>

        {/* Page Content */}
        <div style={{
          background: '#1e293b',
          borderRadius: '20px',
          padding: '32px',
          border: '1px solid #334155',
          minHeight: 'calc(100vh - 200px)'
        }}>
          {children}
        </div>
      </div>
    </div>
  );
} 