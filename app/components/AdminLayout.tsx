"use client";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useContext } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { ThemeContext } from '../ThemeProvider';

const adminNavLinks = [
  { label: 'Dashboard', href: '/dashboard', icon: '🏠' },
  { label: 'Users', href: '/dashboard#users', icon: '👤' },
  { label: 'Booking Management', href: '/admin/bookings', icon: '🚌' },
  { label: 'Add Recommendation', href: '/admin/recommendations/add', icon: '💡' },
  { label: 'Analytics', href: '/admin/analytics', icon: '📊' },
  { label: 'Bus Management', href: '/admin/buses', icon: '🚌' },
  { label: 'City Management', href: '/admin/cities', icon: '🏙️' },
  { label: 'Recommendations', href: '/dashboard#recommendations', icon: '⭐' },
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
    <div style={{ minHeight: '100vh', background: theme === 'light' ? palette.bgLight : palette.bgDark, fontFamily: 'Inter, sans-serif', color: theme === 'light' ? palette.textLight : palette.textDark, display: 'flex' }}>
      {/* Sidebar */}
      <aside style={{ width: 240, background: theme === 'light' ? palette.card : palette.cardDark, boxShadow: '2px 0 12px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 0', position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 20, transition: 'background 0.2s', overflowY: 'auto', maxHeight: '100vh' }}>
        <div style={{ fontWeight: 900, fontSize: '1.7rem', marginBottom: 40, letterSpacing: '1px', color: theme === 'light' ? palette.primary : palette.textDark, transition: 'color 0.2s' }}>Smartify</div>
        <nav style={{ width: '100%' }}>
          {adminNavLinks.map(link => (
            <a key={link.label} href={link.href} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 36px', color: theme === 'light' ? palette.textLight : palette.textDark, textDecoration: 'none', fontWeight: 600, fontSize: 17, borderRadius: 10, marginBottom: 8, transition: 'background 0.2s, color 0.2s', background: pathname === link.href ? palette.accent + '22' : 'none', cursor: 'pointer' }}>
              <span style={{ fontSize: 22 }}>{link.icon}</span> {link.label}
            </a>
          ))}
        </nav>
        {/* Profile Button at Bottom */}
        <div style={{ flex: 1 }} />
        <Link href="/profile" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 36px', color: theme === 'light' ? palette.primary : palette.textDark, textDecoration: 'none', fontWeight: 700, fontSize: 18, borderRadius: 10, marginBottom: 12, marginTop: 24, background: pathname === '/profile' ? palette.accent + '22' : 'none', transition: 'background 0.2s, color 0.2s' }}>
          <FaUserCircle style={{ fontSize: 26 }} /> Profile
        </Link>
      </aside>
      {/* Main Content Area */}
      <div style={{ flex: 1, marginLeft: 240, minHeight: '100vh', display: 'flex', flexDirection: 'column', transition: 'margin 0.2s' }}>
        {/* Header Bar */}
        <header style={{ width: '100%', background: theme === 'light' ? palette.card : palette.cardDark, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', height: 72, position: 'sticky', top: 0, zIndex: 15 }}>
          <div style={{ fontWeight: 700, fontSize: 20, color: theme === 'light' ? palette.primary : palette.textDark, letterSpacing: '1px' }}>{pageTitle || 'Admin'}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <button onClick={toggleTheme} style={{ background: 'none', border: 'none', color: theme === 'light' ? palette.primary : palette.textDark, fontSize: 22, cursor: 'pointer', borderRadius: 8, padding: 6, transition: 'background 0.2s' }}>{theme === 'light' ? '🌙' : '☀️'}</button>
            <Link href="/profile" title="Profile" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <FaUserCircle style={{ fontSize: 32, color: theme === 'light' ? palette.primary : palette.textDark, marginLeft: 8 }} />
            </Link>
            <button onClick={handleLogout} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 700, fontSize: 15, cursor: 'pointer', marginLeft: 16 }}>Logout</button>
          </div>
        </header>
        {/* Main Content Scrollable */}
        <main style={{ flex: 1, padding: '40px 40px 32px 40px', maxWidth: 1200, margin: '0 auto', width: '100%', transition: 'padding 0.2s' }}>
          {children}
        </main>
        {/* Footer */}
        <footer style={{ background: theme === 'light' ? palette.bgLight : palette.bgDark, padding: '32px 0', textAlign: 'center', color: theme === 'light' ? palette.primary : palette.textDark, fontSize: '1rem', letterSpacing: '0.5px', marginTop: 48 }}>
          &copy; {new Date().getFullYear()} Smartify Admin Dashboard
        </footer>
      </div>
    </div>
  );
} 