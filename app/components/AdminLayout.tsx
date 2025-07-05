"use client";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useContext } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { ThemeContext } from '../ThemeProvider';

const adminNavLinks = [
  { label: 'Dashboard', href: '/dashboard/admin-dashboard', icon: '📊' },
  { label: 'User Management', href: '/admin/users', icon: '👥' },
  { label: 'Booking Management', href: '/admin/bookings', icon: '📋' },
  { label: 'Bus Management', href: '/admin/buses', icon: '🚌' },
  { label: 'City Management', href: '/admin/cities', icon: '🌆' },
  { label: 'Analytics', href: '/admin/analytics', icon: '📈' },
  { label: 'Recommendations', href: '/admin/recommendations', icon: '⭐' },
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

export default function AdminLayout({ children, pageTitle }: { children: React.ReactNode; pageTitle?: string }) {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const palette = theme === 'light' ? palettes.classicCorporate : palettes.blueSlate;
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      background: '#0f172a',
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* Sidebar */}
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
            Admin Panel
          </div>
          <div style={{ fontSize: '14px', color: '#94a3b8' }}>
            Bus Booking System
          </div>
        </div>

        <nav>
          {adminNavLinks.map((item) => (
            <button
              key={item.label}
              onClick={() => router.push(item.href)}
              style={{
                width: '100%',
                padding: '16px 24px',
                background: pathname === item.href ? '#334155' : 'transparent',
                border: 'none',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '16px',
                color: pathname === item.href ? 'white' : '#94a3b8',
                fontWeight: pathname === item.href ? '600' : '500',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                if (pathname !== item.href) {
                  e.currentTarget.style.background = '#334155';
                  e.currentTarget.style.color = 'white';
                }
              }}
              onMouseOut={(e) => {
                if (pathname !== item.href) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#94a3b8';
                }
              }}
            >
              <div style={{ fontSize: '20px' }}>{item.icon}</div>
              <div>{item.label}</div>
            </button>
          ))}
        </nav>

        {/* Profile and Logout at bottom */}
        <div style={{ flex: 1 }} />
        <div style={{ padding: '0 24px', marginTop: '32px' }}>
          <Link href="/profile" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px 24px',
            color: '#94a3b8',
            textDecoration: 'none',
            fontWeight: '500',
            fontSize: '16px',
            borderRadius: '8px',
            transition: 'all 0.2s',
            marginBottom: '12px'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = '#334155';
            e.currentTarget.style.color = 'white';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#94a3b8';
          }}
          >
            <FaUserCircle style={{ fontSize: '20px' }} />
            <div>Profile</div>
        </Link>
          
          <button 
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '16px 24px',
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
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
            {pageTitle || 'Admin Panel'}
          </h1>
          <p style={{ 
            margin: '8px 0 0 0', 
            color: '#94a3b8',
            fontSize: '16px'
          }}>
            Manage your bus booking system
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