"use client";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useContext, useState } from 'react';
import { FaBus, FaCalendarAlt, FaChartBar, FaChartLine, FaDollarSign, FaUserCircle, FaUsers } from 'react-icons/fa';
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
    <div style={{ minHeight: '100vh', background: theme === 'light' ? palette.bgLight : palette.bgDark, fontFamily: 'Inter, sans-serif', color: theme === 'light' ? palette.textLight : palette.textDark, display: 'flex' }}>
      {/* Analytics Sidebar */}
      <aside style={{ width: 280, background: theme === 'light' ? palette.card : palette.cardDark, boxShadow: '2px 0 12px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 0', position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 20, transition: 'background 0.2s', overflowY: 'auto', maxHeight: '100vh' }}>
        <div style={{ fontWeight: 900, fontSize: '1.7rem', marginBottom: 8, letterSpacing: '1px', color: theme === 'light' ? palette.primary : palette.textDark, transition: 'color 0.2s' }}>Smartify</div>
        <div style={{ fontSize: '0.9rem', color: theme === 'light' ? palette.secondary : '#94a3b8', marginBottom: 32, fontWeight: 500 }}>Analytics Dashboard</div>
        
        {/* Back to Admin Button */}
        <button 
          onClick={handleBackToAdmin}
          style={{ 
            background: 'none', 
            border: `2px solid ${palette.primary}`, 
            color: palette.primary, 
            borderRadius: 8, 
            padding: '8px 16px', 
            fontWeight: 600, 
            fontSize: 14, 
            cursor: 'pointer', 
            marginBottom: 32,
            transition: 'all 0.2s',
            width: '80%'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = palette.primary;
            e.currentTarget.style.color = '#fff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'none';
            e.currentTarget.style.color = palette.primary;
          }}
        >
          ← Back to Admin
        </button>

        {/* Date Range Selector */}
        <div style={{ width: '100%', padding: '0 24px', marginBottom: 24 }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 8, color: theme === 'light' ? palette.textLight : palette.textDark }}>Date Range</div>
          <select 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '8px 12px', 
              borderRadius: 6, 
              border: `1px solid ${theme === 'light' ? '#e2e8f0' : '#475569'}`, 
              background: theme === 'light' ? '#fff' : palette.cardDark,
              color: theme === 'light' ? palette.textLight : palette.textDark,
              fontSize: '0.9rem'
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
        <nav style={{ width: '100%' }}>
          {analyticsNavLinks.map(link => {
            const IconComponent = link.icon;
            const isActive = pathname === link.href;
            return (
              <a 
                key={link.label} 
                href={link.href} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 14, 
                  padding: '14px 24px', 
                  color: isActive ? palette.primary : (theme === 'light' ? palette.textLight : palette.textDark), 
                  textDecoration: 'none', 
                  fontWeight: isActive ? 700 : 600, 
                  fontSize: 15, 
                  borderRadius: 10, 
                  marginBottom: 4, 
                  transition: 'all 0.2s', 
                  background: isActive ? `${palette.primary}15` : 'none', 
                  cursor: 'pointer',
                  borderLeft: isActive ? `3px solid ${palette.primary}` : '3px solid transparent'
                }}
              >
                <IconComponent style={{ fontSize: 18, color: isActive ? palette.primary : (theme === 'light' ? palette.secondary : '#94a3b8') }} /> 
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Profile Button at Bottom */}
        <div style={{ flex: 1 }} />
        <Link 
          href="/profile" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 12, 
            padding: '14px 24px', 
            color: theme === 'light' ? palette.primary : palette.textDark, 
            textDecoration: 'none', 
            fontWeight: 700, 
            fontSize: 16, 
            borderRadius: 10, 
            marginBottom: 12, 
            marginTop: 24, 
            background: pathname === '/profile' ? palette.accent + '22' : 'none', 
            transition: 'background 0.2s, color 0.2s',
            width: '100%'
          }}
        >
          <FaUserCircle style={{ fontSize: 24 }} /> Profile
        </Link>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, marginLeft: 280, minHeight: '100vh', display: 'flex', flexDirection: 'column', transition: 'margin 0.2s' }}>
        {/* Main Content Scrollable */}
        <main style={{ flex: 1, padding: '40px 40px 32px 40px', maxWidth: 1400, margin: '0 auto', width: '100%', transition: 'padding 0.2s' }}>
          {children}
        </main>
      </div>
    </div>
  );
} 