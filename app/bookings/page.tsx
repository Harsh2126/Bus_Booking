'use client';
import jsPDF from 'jspdf';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import Spinner from '../components/Spinner';
import { ThemeContext } from '../ThemeProvider';

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

// Add Booking interface
interface Booking {
  _id?: string;
  exam?: string;
  city?: string;
  date?: string;
  bus?: string;
  busNumber?: string;
  routeFrom?: string;
  routeTo?: string;
  timing?: string;
  contactNumber?: string;
  seatNumbers: string[];
  price?: number;
  status?: 'pending' | 'confirmed' | 'rejected';
  userId?: string;
}

interface Bus {
  _id: string;
  name: string;
  number: string;
  routeFrom: string;
  routeTo: string;
  date: string;
  timing: string;
  price: number;
  availableSeats: number;
  totalSeats: number;
  exam?: string;
}

interface City {
  _id: string;
  name: string;
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [user, setUser] = useState<{ email: string; userId?: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [contactNumber, setContactNumber] = useState('');
  const router = useRouter();
  const { theme } = useContext(ThemeContext);
  const palette = theme === 'light' ? palettes.classicCorporate : palettes.blueSlate;

  // Fetch user and data from API on mount
  useEffect(() => {
    fetch('/api/auth/me')
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          
          // Fetch bookings
          fetch(`/api/bookings?userId=${data.user.userId || data.user.email}`)
            .then(res => res.json())
            .then(data => {
              if (Array.isArray(data)) setBookings(data);
            });
            
          // Fetch buses
          fetch('/api/buses')
            .then(res => res.json())
            .then(data => {
              if (data.buses) setBuses(data.buses);
            });
            
          // Fetch cities
          fetch('/api/cities')
            .then(res => res.json())
            .then(data => {
              if (data.cities) setCities(data.cities);
            });
        } else {
          router.replace('/login');
        }
      });
  }, [router]);

  // Refresh bookings periodically
  useEffect(() => {
    if (!user) return;
    
    const interval = setInterval(() => {
      fetch(`/api/bookings?userId=${user.userId || user.email}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setBookings(data);
        });
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, [user]);

  const handleCancel = async (id: string) => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/bookings?id=${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Cancellation failed.');
        setLoading(false);
        return;
      }
      setBookings(prev => prev.filter((b) => b._id !== id));
      setToast('Booking cancelled successfully!');
      setTimeout(() => setToast(null), 2500);
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (booking: Booking) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Bus Booking Ticket', 10, 20);
    doc.setFontSize(12);
    doc.text(`Exam: ${booking.exam || ''}`, 10, 40);
    doc.text(`City: ${booking.city || ''}`, 10, 50);
    doc.text(`Date: ${booking.date || ''}`, 10, 60);
    doc.text(`Bus: ${booking.bus || ''} ${booking.busNumber ? `(${booking.busNumber})` : ''}`, 10, 70);
    doc.text(`Route: ${booking.routeFrom || ''} → ${booking.routeTo || ''}`, 10, 80);
    doc.text(`Timing: ${booking.timing || '-'}`, 10, 90);
    doc.text(`Contact: ${booking.contactNumber || '-'}`, 10, 100);
    doc.text(`Seats: ${Array.isArray(booking.seatNumbers) ? booking.seatNumbers.join(', ') : ''}`, 10, 110);
    doc.text('Thank you for booking!', 10, 120);
    doc.save('ticket.pdf');
    setToast('Ticket downloaded!');
    setTimeout(() => setToast(null), 2000);
  };

  const handleBookBus = async () => {
    if (!selectedBus || selectedSeats.length === 0 || !contactNumber) {
      setError('Please fill in all required fields.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const bookingData = {
        busId: selectedBus._id,
        routeFrom: selectedBus.routeFrom,
        routeTo: selectedBus.routeTo,
        date: selectedBus.date,
        timing: selectedBus.timing,
        seatNumbers: selectedSeats,
        price: selectedBus.price,
        contactNumber: contactNumber,
        exam: selectedBus.exam || '',
        userId: user?.userId || user?.email
      };

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Booking failed.');
        setLoading(false);
        return;
      }

      // Re-fetch all bookings after booking
      fetch(`/api/bookings?userId=${user?.userId || user?.email}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setBookings(data);
        });
      setToast('Booking successful!');
      setTimeout(() => setToast(null), 2500);
      
      // Reset form
      setSelectedBus(null);
      setSelectedSeats([]);
      setContactNumber('');
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleSeat = (seatNumber: string) => {
    setSelectedSeats(prev => 
      prev.includes(seatNumber) 
        ? prev.filter(seat => seat !== seatNumber)
        : [...prev, seatNumber]
    );
  };

  const renderBookingsTab = () => (
    <div>
      <h2 style={{ fontWeight: 800, fontSize: '2rem', marginBottom: 24, textAlign: 'center', color: palette.primary }}>Your Bookings</h2>
      {error && <div style={{ color: '#ff5e62', marginBottom: 16, textAlign: 'center' }}>{error}</div>}
      {loading && <div style={{ marginBottom: 16, textAlign: 'center' }}><Spinner size={28} label="Loading..." /></div>}
      {bookings.length === 0 ? (
        <div style={{ color: theme === 'light' ? '#b23b3b' : '#ffeaea', textAlign: 'center', marginTop: 32 }}>
          No bookings yet. 
        </div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {bookings.map((b, i) => (
            <li key={b._id || i} style={{ background: theme === 'light' ? palette.bgLight : 'rgba(255,255,255,0.10)', borderRadius: 14, padding: 18, marginBottom: 16, color: theme === 'light' ? palette.textLight : palette.textDark }}>
              <div><b>Exam:</b> {b.exam}</div>
              <div><b>City:</b> {b.city}</div>
              <div><b>Date:</b> {b.date}</div>
              <div><b>Bus:</b> {b.bus} {b.busNumber ? `(${b.busNumber})` : ''}</div>
              <div><b>Route:</b> {b.routeFrom} → {b.routeTo}</div>
              <div><b>Timing:</b> {b.timing || '-'}</div>
              <div><b>Contact:</b> {b.contactNumber || '-'}</div>
              <div><b>Seats:</b> {Array.isArray(b.seatNumbers) ? b.seatNumbers.join(', ') : ''}</div>
              <div><b>Price per Seat:</b> ₹{b.price || 0}</div>
              <div><b>Total Price:</b> ₹{(b.price || 0) * (Array.isArray(b.seatNumbers) ? b.seatNumbers.length : 1)}</div>
              <div style={{ marginTop: 12, display: 'flex', gap: 12 }}>
                <button
                  onClick={() => handleDownload(b)}
                  disabled={b.status !== 'confirmed'}
                  style={{
                    background: b.status === 'confirmed' ? `linear-gradient(90deg, ${palette.accent} 0%, ${palette.primary} 100%)` : '#ccc',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    padding: '6px 16px',
                    fontWeight: 600,
                    cursor: b.status === 'confirmed' ? 'pointer' : 'not-allowed',
                    opacity: b.status === 'confirmed' ? 1 : 0.6,
                  }}
                >
                  Download
                </button>
                {b.status === 'pending' && <span style={{ padding: '6px 16px', borderRadius: 8, background: '#fbbf24', color: '#222', fontWeight: 600 }}>Awaiting Approval</span>}
                {b.status === 'rejected' && <span style={{ padding: '6px 16px', borderRadius: 8, background: '#ef4444', color: '#fff', fontWeight: 600 }}>Rejected</span>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  if (!user) return null;

  return (
    <div style={{ minHeight: '100vh', background: theme === 'light' ? palette.bgLight : palette.bgDark, color: theme === 'light' ? palette.textLight : palette.textDark, fontFamily: 'Inter, sans-serif', padding: '48px 0', position: 'relative' }}>
      {toast && <div style={{ position: 'fixed', top: 32, right: 32, background: palette.accent, color: '#222', padding: '12px 28px', borderRadius: 12, fontWeight: 700, zIndex: 1000 }}>{toast}</div>}
      
      <div style={{ maxWidth: 800, margin: '0 auto', background: theme === 'light' ? palette.card : palette.cardDark, borderRadius: 18, padding: '36px 32px', boxShadow: '0 2px 12px rgba(0,0,0,0.10)' }}>
        {renderBookingsTab()}
      </div>
    </div>
  );
} 