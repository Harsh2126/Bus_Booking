"use client";
import jsPDF from 'jspdf';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { ThemeContext } from '../ThemeProvider';
import AdminUserManager from '../components/AdminUserManager';
import Spinner from '../components/Spinner';

const adminNavLinks = [
  { label: 'Dashboard', href: '/dashboard', icon: '🏠' },
  { label: 'Users', href: '#users', icon: '👤' },
  { label: 'Booking Management', href: '/admin/bookings', icon: '🚌' },
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

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const router = useRouter();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [showNotifications, setShowNotifications] = useState(false);
  const notifications = [
    { icon: '🚌', text: 'Your bus to Jaipur departs in 2 hours.' },
    { icon: '✅', text: 'Payment for Mumbai → Pune booking confirmed.' },
    { icon: '🎁', text: 'Special offer: 10% off on your next trip!' },
  ];
  const bellRef = useRef(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const palette = theme === 'light' ? palettes.classicCorporate : palettes.blueSlate;
  const [bookings, setBookings] = useState<any[]>([]);
  const [profileComplete, setProfileComplete] = useState(false);
  const [buses, setBuses] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          // Fetch bookings for user
          fetch(`/api/bookings?userId=${data.user.userId || data.user.email}`)
            .then(async res => {
              if (!res.ok) return [];
              try { return await res.json(); } catch { return []; }
            })
            .then(bks => setBookings(Array.isArray(bks) ? bks : []));
          // Profile completeness
          setProfileComplete(
            !!(data.user.name && data.user.age && data.user.course && data.user.college)
          );
          // Fetch admin data if admin
          if (data.user?.role === 'admin') {
            fetch('/api/admin/analytics')
              .then(async res => {
                if (!res.ok) return null;
                try { return await res.json(); } catch { return null; }
              })
              .then(setAnalytics);
            fetch('/api/activity')
              .then(async res => {
                if (!res.ok) return { activities: [] };
                try { return await res.json(); } catch { return { activities: [] }; }
              })
              .then(data => setActivities(data.activities || []));
            fetch('/api/recommendations')
              .then(async res => {
                if (!res.ok) return { recommendations: [] };
                try { return await res.json(); } catch { return { recommendations: [] }; }
              })
              .then(data => setRecommendations(data.recommendations || []));
          } else {
            // Fetch recommendations and buses for user
            fetch('/api/recommendations')
              .then(async res => {
                if (!res.ok) return { recommendations: [] };
                try { return await res.json(); } catch { return { recommendations: [] }; }
              })
              .then(data => setRecommendations(data.recommendations || []));
            fetch('/api/buses')
              .then(async res => {
                if (!res.ok) return { buses: [] };
                try { return await res.json(); } catch { return { buses: [] }; }
              })
              .then(data => setBuses(data.buses || []));
          }
        } else {
          router.replace('/login');
        }
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleCancelBooking = async () => {
    setError(null);
    setActionLoading(true);
    try {
      // Simulate cancel by emitting notification
      const s = io();
      s.emit('notify', { userId: user?.email, message: 'Your booking has been cancelled.' });
      s.disconnect();
      setToast('Booking cancelled! You will receive a notification.');
      setTimeout(() => setToast(null), 2500);
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDownloadTicket = (booking: any) => {
    if (!booking) return;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Bus Booking Ticket', 10, 20);
    doc.setFontSize(12);
    doc.text(`Exam: ${booking.exam || ''}`, 10, 40);
    doc.text(`Route: ${(booking.routeFrom || booking.city || '') + (booking.routeTo ? ' → ' + booking.routeTo : '')}`, 10, 50);
    doc.text(`Type: ${booking.type || ''}`, 10, 60);
    doc.text(`Date: ${booking.date || ''}`, 10, 70);
    doc.text(`Bus: ${booking.bus || ''}`, 10, 80);
    doc.text(`Seats: ${Array.isArray(booking.seatNumbers) ? booking.seatNumbers.join(', ') : ''}`, 10, 90);
    doc.text(`Time: ${booking.timing || ''}`, 10, 100);
    doc.text(`Bus Contact: ${booking.contactNumber || ''}`, 10, 110);
    doc.text('Thank you for booking!', 10, 120);
    doc.save('ticket.pdf');
  };

  if (loading) return <div style={{ marginTop: 64, textAlign: 'center' }}><Spinner size={36} label="Loading dashboard..." /></div>;
  if (!user) return null;

  // Only show admin sections if user?.role === 'admin'
  const isAdmin = (user as { email: string; role?: string })?.role === 'admin';

  return (
    <div style={{ minHeight: '100vh', background: theme === 'light' ? palette.bgLight : palette.bgDark, fontFamily: 'Inter, sans-serif', color: theme === 'light' ? palette.textLight : palette.textDark, display: 'flex' }}>
      {/* Sidebar */}
      {isAdmin && (
        <aside style={{ width: 240, background: theme === 'light' ? palette.card : palette.cardDark, boxShadow: '2px 0 12px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 0', position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 20, transition: 'background 0.2s' }}>
          <div style={{ fontWeight: 900, fontSize: '1.7rem', marginBottom: 40, letterSpacing: '1px', color: theme === 'light' ? palette.primary : palette.textDark, transition: 'color 0.2s' }}>Smartify</div>
          <nav style={{ width: '100%' }}>
            {adminNavLinks.map(link => (
              <a key={link.label} href={link.href} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 36px', color: theme === 'light' ? palette.textLight : palette.textDark, textDecoration: 'none', fontWeight: 600, fontSize: 17, borderRadius: 10, marginBottom: 8, transition: 'background 0.2s, color 0.2s', background: location.hash === link.href ? palette.accent + '22' : 'none', cursor: 'pointer' }}>
                <span style={{ fontSize: 22 }}>{link.icon}</span> {link.label}
              </a>
            ))}
          </nav>
        </aside>
      )}
      {/* Main Content Area */}
      <div style={{ flex: 1, marginLeft: isAdmin ? 240 : 0, minHeight: '100vh', display: 'flex', flexDirection: 'column', transition: 'margin 0.2s' }}>
        {/* Header Bar */}
        <header style={{ width: '100%', background: theme === 'light' ? palette.card : palette.cardDark, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', height: 72, position: 'sticky', top: 0, zIndex: 15 }}>
          <div style={{ fontWeight: 700, fontSize: 20, color: theme === 'light' ? palette.primary : palette.textDark, letterSpacing: '1px' }}>{isAdmin ? 'Admin Dashboard' : 'Smartify'}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <button onClick={toggleTheme} style={{ background: 'none', border: 'none', color: theme === 'light' ? palette.primary : palette.textDark, fontSize: 22, cursor: 'pointer', borderRadius: 8, padding: 6, transition: 'background 0.2s' }}>{theme === 'light' ? '🌙' : '☀️'}</button>
            <div style={{ fontSize: 22, cursor: 'pointer', color: theme === 'light' ? palette.primary : palette.textDark }}>🔔</div>
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: theme === 'light' ? palette.bgLight : palette.bgDark, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 18, color: theme === 'light' ? palette.primary : palette.textDark, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>{user.email[0].toUpperCase()}</div>
          </div>
        </header>
        {/* Main Content Scrollable */}
        <main style={{ flex: 1, padding: '40px 40px 32px 40px', maxWidth: 1200, margin: '0 auto', width: '100%', transition: 'padding 0.2s' }}>
          {/* App Name Branding */}
          {!isAdmin && (
            <div style={{ fontWeight: 900, fontSize: '2.1rem', marginBottom: 32, letterSpacing: '1px', color: palette.primary, textAlign: 'center' }}>
              User Dashboard
            </div>
          )}
          {/* Recommendations for User */}
          {!isAdmin && recommendations.length > 0 && (
            <section style={{ margin: '0 auto 40px auto', maxWidth: 800, background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', padding: 32 }}>
              <h3 style={{ fontSize: 24, fontWeight: 800, color: palette.primary, marginBottom: 18, textAlign: 'center' }}>Recommended Buses</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {recommendations.map((rec: any, idx: number) => {
                  const bus = buses.find(b => b._id === rec.route);
                  return (
                    <li key={rec._id || idx} style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 18, background: '#f4f5f7', borderRadius: 10, padding: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                      <span style={{ fontSize: 28 }}>{rec.icon}</span>
                      <span style={{ fontWeight: 700, color: palette.primary, fontSize: 18 }}>{bus ? `${bus.name} (${bus.number})` : rec.route}</span>
                      <span style={{ color: '#222', flex: 1, fontSize: 16 }}>{rec.desc}</span>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}
          {/* Stats Cards for Admin */}
          {isAdmin && (
            <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 32, marginBottom: 48 }}>
              <div style={{ background: 'linear-gradient(90deg, ' + palette.primary + ' 0%, ' + palette.accent + ' 100%)', color: '#fff', borderRadius: 18, padding: '32px 36px', boxShadow: '0 2px 12px rgba(0,0,0,0.10)', fontWeight: 700, fontSize: 18, display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'box-shadow 0.2s' }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>👤</div>
                <div>Total Users</div>
                <div style={{ fontSize: 22, fontWeight: 800, marginTop: 6 }}>{analytics ? analytics.totalUsers : '...'}</div>
      </div>
              <div style={{ background: 'linear-gradient(90deg, ' + palette.secondary + ' 0%, ' + palette.primary + ' 100%)', color: '#fff', borderRadius: 18, padding: '32px 36px', boxShadow: '0 2px 12px rgba(0,0,0,0.10)', fontWeight: 700, fontSize: 18, display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'box-shadow 0.2s' }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>🚌</div>
                <div>Total Bookings</div>
                <div style={{ fontSize: 22, fontWeight: 800, marginTop: 6 }}>{analytics ? analytics.totalBookings : '...'}</div>
        </div>
              <div style={{ background: 'linear-gradient(90deg, ' + palette.primary + ' 0%, ' + palette.accent + ' 100%)', color: '#fff', borderRadius: 18, padding: '32px 36px', boxShadow: '0 2px 12px rgba(0,0,0,0.10)', fontWeight: 700, fontSize: 18, display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'box-shadow 0.2s' }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>📊</div>
                <div>Analytics</div>
                <a href="/admin/analytics" style={{ color: '#fff', fontWeight: 700, textDecoration: 'underline', marginTop: 8 }}>View</a>
        </div>
            </section>
          )}
          {/* Stats Cards for User */}
          {!isAdmin && (
            <section style={{ display: 'flex', gap: 32, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 36 }}>
              <UserStatCard label="My Bookings" value={bookings.length} icon="🚌" href="/bookings" tooltip="Total bookings you have made." />
              <UserStatCard label="Upcoming Trips" value={bookings.filter(b => new Date(b.date) > new Date()).length} icon="🗓️" href="/bookings" tooltip="Trips with a future date." />
              <UserStatCard label="Profile Complete" value={profileComplete ? 'Yes' : 'No'} icon="✅" href="/profile" tooltip="Profile is complete if all fields are filled." />
            </section>
          )}
          {/* Quick Links for User */}
          {!isAdmin && (
            <section style={{ display: 'flex', gap: 28, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 40 }}>
              <UserQuickLink href="/bookings" icon="🚌" label="My Bookings" desc="View your bookings" />
              <UserQuickLink href="/book-exam" icon="📝" label="Book a Bus" desc="Book a new trip" />
              <UserQuickLink href="/profile" icon="👤" label="Edit Profile" desc="Update your details" />
              <UserQuickLink href="/support" icon="💬" label="Support" desc="Get help" />
            </section>
          )}
          {/* Welcome Section */}
          <section style={{ display: 'flex', flexDirection: 'column', alignItems: isAdmin ? 'flex-start' : 'center', justifyContent: 'center', padding: '0 0 24px 0', gap: 16 }}>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: 8, color: theme === 'light' ? palette.primary : palette.textDark, letterSpacing: '1px', textShadow: theme === 'light' ? 'none' : '0 2px 8px rgba(0,0,0,0.10)' }}>
          Welcome, {user.email.split('@')[0]}!
        </h1>
            <p style={{ fontSize: 20, color: theme === 'light' ? palette.secondary : palette.textDark, marginBottom: 0, marginTop: 0 }}>
              {isAdmin ? "Here's your dashboard. Manage your bookings, users, and more." : "Here's your dashboard. Manage your bookings and profile."}
        </p>
      </section>
          {/* Admin Sections */}
          {isAdmin && (
            <section style={{ background: theme === 'light' ? palette.card : palette.cardDark, borderRadius: 18, boxShadow: '0 2px 12px rgba(0,0,0,0.10)', padding: '32px 32px 24px 32px', marginBottom: 40, marginTop: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <span style={{ fontSize: 28, color: palette.primary }}>👤</span>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: palette.primary, margin: 0 }}>User Management</h2>
        </div>
              <AdminUserManager />
            </section>
          )}
          {/* Recommendations Section (admin only) */}
          {isAdmin && (
            <section id="recommendations" style={{ background: theme === 'light' ? palette.card : palette.cardDark, borderRadius: 18, boxShadow: '0 2px 12px rgba(0,0,0,0.10)', padding: '32px 32px 24px 32px', marginBottom: 40 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <span style={{ fontSize: 28, color: palette.primary }}>⭐</span>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: palette.primary, margin: 0 }}>Recommendations</h2>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center' }}>
                {recommendations.length === 0 ? (
                  <div style={{ color: theme === 'light' ? palette.secondary : palette.textDark }}>No recommendations.</div>
                ) : (
                  recommendations.map((rec, idx) => (
                    <div key={idx} style={{ background: theme === 'light' ? palette.bgLight : palette.bgDark, borderRadius: 16, padding: '20px 24px', minWidth: 180, textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                      <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>{rec.icon}</div>
                      <div style={{ fontWeight: 600, marginBottom: 4 }}>{rec.route}</div>
                      <div style={{ color: theme === 'light' ? palette.secondary : palette.textDark, fontSize: '0.98rem', marginBottom: 8 }}>{rec.desc}</div>
                      <button style={{ padding: '8px 20px', borderRadius: '18px', background: 'linear-gradient(90deg, ' + palette.primary + ' 0%, ' + palette.accent + ' 100%)', color: '#fff', fontWeight: 600, border: 'none', cursor: 'pointer' }}>Book Now</button>
          </div>
                  ))
                )}
        </div>
      </section>
          )}
          {/* Profile Summary Card for User */}
          {!isAdmin && (
            <section style={{ maxWidth: 800, margin: '0 auto 32px auto', display: 'flex', gap: 32, alignItems: 'center', background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', padding: 28 }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: palette.bgLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 36, color: palette.primary, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>{user.email[0].toUpperCase()}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: 22, color: palette.primary }}>{user.name || user.email.split('@')[0]}</div>
                <div style={{ color: palette.secondary, fontSize: 16 }}>{user.email}</div>
                <div style={{ marginTop: 8, fontWeight: 600, color: profileComplete ? '#36b37e' : '#fbbf24' }}>
                  Profile: {profileComplete ? 'Complete' : 'Incomplete'}
                </div>
              </div>
              <a href="/profile" style={{ padding: '10px 24px', borderRadius: 10, background: `linear-gradient(90deg, ${palette.accent} 0%, ${palette.primary} 100%)`, color: '#fff', fontWeight: 700, textDecoration: 'none', fontSize: 16 }}>Edit Profile</a>
            </section>
          )}
          {/* Notification/Alert Area for User */}
          {!isAdmin && (!profileComplete || bookings.some(b => b.status === 'pending')) && (
            <section style={{ maxWidth: 800, margin: '0 auto 24px auto', background: '#fffbe6', borderRadius: 12, padding: 18, color: '#b26a00', fontWeight: 600, fontSize: 16, boxShadow: '0 2px 8px rgba(251,191,36,0.08)' }}>
              {!profileComplete && <div style={{ marginBottom: 4 }}>⚠️ Please complete your profile for a better experience.</div>}
              {bookings.some(b => b.status === 'pending') && <div>⏳ You have pending bookings awaiting admin approval.</div>}
            </section>
          )}
          {/* Modern Bookings Table for User */}
          {!isAdmin && bookings.length > 0 && (
            <section style={{ maxWidth: 1000, margin: '0 auto 40px auto', background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', padding: 32 }}>
              <h3 style={{ fontSize: 24, fontWeight: 800, color: palette.primary, marginBottom: 18, textAlign: 'center' }}>My Bookings</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 16 }}>
                  <thead>
                    <tr style={{ background: palette.bgLight }}>
                      <th style={{ padding: '10px 8px', fontWeight: 700, color: palette.primary }}>Status</th>
                      <th style={{ padding: '10px 8px', fontWeight: 700 }}>Bus</th>
                      <th style={{ padding: '10px 8px', fontWeight: 700 }}>Route</th>
                      <th style={{ padding: '10px 8px', fontWeight: 700 }}>Date</th>
                      <th style={{ padding: '10px 8px', fontWeight: 700 }}>Seats</th>
                      <th style={{ padding: '10px 8px', fontWeight: 700 }}>Price</th>
                      <th style={{ padding: '10px 8px', fontWeight: 700 }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b, idx) => (
                      <tr key={b._id || idx} style={{ background: idx % 2 === 0 ? '#f8fafc' : '#fff' }}>
                        <td style={{ padding: '8px', fontWeight: 700, color: b.status === 'pending' ? '#fbbf24' : b.status === 'rejected' ? '#ef4444' : '#36b37e' }}>
                          {b.status === 'pending' ? 'Pending' : b.status === 'rejected' ? 'Rejected' : 'Confirmed'}
                        </td>
                        <td style={{ padding: '8px' }}>{b.bus}</td>
                        <td style={{ padding: '8px' }}>{b.routeFrom} → {b.routeTo}</td>
                        <td style={{ padding: '8px' }}>{b.date}</td>
                        <td style={{ padding: '8px' }}>{Array.isArray(b.seatNumbers) ? b.seatNumbers.join(', ') : ''}</td>
                        <td style={{ padding: '8px' }}>₹{b.price ? b.price * (Array.isArray(b.seatNumbers) ? b.seatNumbers.length : 1) : 0}</td>
                        <td style={{ padding: '8px', display: 'flex', gap: 8 }}>
                          <button onClick={() => handleDownloadTicket(b)} style={{ padding: '6px 16px', borderRadius: 8, background: palette.primary, color: '#fff', fontWeight: 600, border: 'none', cursor: 'pointer' }}>Download</button>
                          {b.status === 'pending' && <span style={{ padding: '6px 16px', borderRadius: 8, background: '#fbbf24', color: '#222', fontWeight: 600 }}>Awaiting Approval</span>}
                          {b.status === 'rejected' && <span style={{ padding: '6px 16px', borderRadius: 8, background: '#ef4444', color: '#fff', fontWeight: 600 }}>Rejected</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </main>
      {/* Footer */}
        <footer style={{ background: theme === 'light' ? palette.bgLight : palette.bgDark, padding: '32px 0', textAlign: 'center', color: theme === 'light' ? palette.primary : palette.textDark, fontSize: '1rem', letterSpacing: '0.5px', marginTop: 48 }}>
          &copy; {new Date().getFullYear()} Smartify Admin Dashboard
      </footer>
      </div>
    </div>
  );
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
      <div style={{ fontSize: 40, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontWeight: 800, fontSize: '1.2rem', marginBottom: 6, color: '#003366' }}>{label}</div>
      <div style={{ fontSize: '2rem', fontWeight: 900, color: '#2563eb' }}>{value}</div>
      {/* Custom tooltip (optional, fallback to title) */}
      {/* <Tooltip text={tooltip} /> */}
    </div>
  );
  return card;
}

function UserQuickLink({ href, icon, label, desc }: { href: string; icon: string; label: string; desc: string }) {
  return (
    <a href={href} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#f4f8ff', borderRadius: 14, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', padding: '28px 36px', minWidth: 180, textDecoration: 'none', color: '#003366', fontWeight: 600, fontSize: 18, transition: 'box-shadow 0.2s, background 0.2s', border: '2px solid #e0e7ef' }}>
      <span style={{ fontSize: 36, marginBottom: 10 }}>{icon}</span>
      {label}
      <span style={{ fontSize: 14, color: '#64748b', fontWeight: 400, marginTop: 6 }}>{desc}</span>
    </a>
  );
} 