"use client";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// Add interfaces
interface User {
  email: string;
  name?: string;
  age?: number;
  course?: string;
  college?: string;
  role?: string;
  userId?: string;
}

interface Booking {
  _id?: string;
  bus: string;
  routeFrom: string;
  routeTo: string;
  date: string;
  seatNumbers: string[];
  price: number;
  status: 'pending' | 'confirmed' | 'rejected';
  exam?: string;
  type?: string;
  timing?: string;
  contactNumber?: string;
  userId?: string;
}

interface Bus {
  _id: string;
  name: string;
  number: string;
  // add other fields as needed
}

interface Recommendation {
  _id?: string;
  icon: string;
  route: string;
  desc: string;
}

interface Analytics {
  totalUsers: number;
  totalBookings: number;
  // add other fields as needed
}

interface Activity { icon: string; text: string; time?: string; }

const adminNavLinks = [
  { label: 'Dashboard', href: '/dashboard', icon: '🏠' },
  { label: 'Users', href: '#users', icon: '👤' },
  { label: 'Booking Management', href: '/admin/bookings', icon: '🚌' },
  { label: 'Bus Management', href: '/admin/buses', icon: '🚌' },
  { label: 'City Management', href: '/admin/cities', icon: '🌆' },
  { label: 'Add Recommendation', href: '/admin/recommendations/add', icon: '💡' },
  { label: 'Analytics', href: '/admin/analytics', icon: '📊' },
  { label: 'Recommendations', href: '#recommendations', icon: '⭐' },
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

export default function DashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    fetch('/api/auth/me')
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          if (data.user?.role === 'admin') {
            router.replace('/dashboard/admin-dashboard');
          } else {
            router.replace('/dashboard/user-dashboard');
          }
        } else {
          router.replace('/login');
        }
      });
  }, [router]);

  return <div style={{ marginTop: 64, textAlign: 'center' }}>Loading dashboard...</div>;
}

function UserStatCard({ label, value, icon, href, tooltip }: { label: string; value: any; icon: string; href?: string; tooltip?: string }) {
  const card = (
    <div
      style={{
        background: 'linear-gradient(135deg, #f4f8ff 0%, #e0e7ef 100%)',
        borderRadius: 18,
        padding: 28,
        minWidth: 200,
        textAlign: 'center',
        boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
        border: '2px solid #e0e7ef',
        transition: 'transform 0.15s, box-shadow 0.15s',
        cursor: href ? 'pointer' : 'default',
        margin: 8,
        position: 'relative',
      }}
      onMouseOver={e => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px) scale(1.03)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.13)';
      }}
      onMouseOut={e => {
        (e.currentTarget as HTMLDivElement).style.transform = '';
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.10)';
      }}
      onClick={() => href && (window.location.href = href)}
      title={tooltip || label}
    >
      <div style={{ fontSize: 32, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>{value}</div>
      <div style={{ color: '#64748b', fontSize: 14 }}>{label}</div>
    </div>
  );
  return card;
}

function UserQuickLink({ href, icon, label, desc }: { href: string; icon: string; label: string; desc: string }) {
  return (
    <a
      href={href}
      style={{
        background: 'white',
        borderRadius: 16,
        padding: '24px',
        textDecoration: 'none',
        color: 'inherit',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
        boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
        border: '2px solid #e0e7ef',
        transition: 'transform 0.15s, box-shadow 0.15s',
        cursor: 'pointer',
        minWidth: 160,
      }}
      onMouseOver={e => {
        (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-4px) scale(1.03)';
        (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.13)';
      }}
      onMouseOut={e => {
        (e.currentTarget as HTMLAnchorElement).style.transform = '';
        (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.10)';
      }}
    >
      <div style={{ fontSize: 32 }}>{icon}</div>
      <div style={{ fontWeight: 700, fontSize: 16, textAlign: 'center' }}>{label}</div>
      <div style={{ color: '#64748b', fontSize: 14, textAlign: 'center' }}>{desc}</div>
    </a>
  );
} 