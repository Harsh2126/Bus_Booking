"use client";
import { useContext, useEffect, useState } from 'react';
import { ThemeContext } from '../ThemeProvider';

interface Booking {
  _id: string;
  userId: string;
  city: string;
  date: string;
  bus: string;
  seatNumbers: string[];
  status: string;
  exam: string;
  upiScreenshot?: string;
  upiTxnId?: string;
  price?: number;
}

export default function AdminBookingManager() {
  const { theme } = useContext(ThemeContext);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filtered, setFiltered] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const [status, setStatus] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    let data = bookings;
    if (search) data = data.filter(b => b.userId.toLowerCase().includes(search.toLowerCase()));
    if (city) data = data.filter(b => b.city === city);
    if (status) data = data.filter(b => b.status === status);
    if (date) data = data.filter(b => b.date === date);
    setFiltered(data);
  }, [search, city, status, date, bookings]);

  const fetchBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/bookings/all');
      const data = await res.json();
      setBookings(data.bookings || []);
    } catch (err) {
      setError('Failed to fetch bookings.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this booking?')) return;
    setLoading(true);
    setError('');
    try {
      await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
      setBookings(prev => prev.filter(b => b._id !== id));
    } catch (err) {
      setError('Failed to delete booking.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatus = async (id: string, newStatus: string) => {
    setLoading(true);
    setError('');
    try {
      await fetch(`/api/bookings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      setBookings(prev => prev.map(b => b._id === id ? { ...b, status: newStatus } : b));
    } catch (err) {
      setError('Failed to update status.');
    } finally {
      setLoading(false);
    }
  };

  // Unique cities and statuses for filters
  const cities = Array.from(new Set(bookings.map(b => b.city)));
  const statuses = Array.from(new Set(bookings.map(b => b.status)));

  return (
    <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 16, padding: 24, marginBottom: 32 }}>
      <h3 style={{ color: theme === 'light' ? '#172b4d' : '#fff', marginBottom: 16 }}>Booking Management</h3>
      {error && <div style={{ color: '#ff5e62', marginBottom: 8 }}>{error}</div>}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <input placeholder="Search by user email" value={search} onChange={e => setSearch(e.target.value)} style={{ padding: 6, borderRadius: 6, border: '1px solid #ccc' }} />
        <select value={city} onChange={e => setCity(e.target.value)} style={{ padding: 6, borderRadius: 6 }}>
          <option value="">All Cities</option>
          {cities.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={status} onChange={e => setStatus(e.target.value)} style={{ padding: 6, borderRadius: 6 }}>
          <option value="">All Statuses</option>
          {statuses.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ padding: 6, borderRadius: 6 }} />
        <button onClick={() => { setSearch(''); setCity(''); setStatus(''); setDate(''); }} style={{ padding: 6, borderRadius: 6, background: '#aaa', color: '#fff', border: 'none' }}>Clear</button>
      </div>
      {loading ? <div style={{ color: theme === 'light' ? '#003366' : '#ffeaea' }}>Loading...</div> : (
        <table style={{ width: '100%', color: theme === 'light' ? '#172b4d' : '#fff', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: theme === 'light' ? '#e0e7ef' : 'rgba(0,0,0,0.10)' }}>
              <th style={{ padding: 8, color: theme === 'light' ? '#172b4d' : '#fff' }}>User</th>
              <th style={{ padding: 8, color: theme === 'light' ? '#172b4d' : '#fff' }}>Exam</th>
              <th style={{ padding: 8, color: theme === 'light' ? '#172b4d' : '#fff' }}>City</th>
              <th style={{ padding: 8, color: theme === 'light' ? '#172b4d' : '#fff' }}>Date</th>
              <th style={{ padding: 8, color: theme === 'light' ? '#172b4d' : '#fff' }}>Bus</th>
              <th style={{ padding: 8, color: theme === 'light' ? '#172b4d' : '#fff' }}>Seats</th>
              <th style={{ padding: 8, color: theme === 'light' ? '#172b4d' : '#fff' }}>Price per Seat</th>
              <th style={{ padding: 8, color: theme === 'light' ? '#172b4d' : '#fff' }}>Total Price</th>
              <th style={{ padding: 8, color: theme === 'light' ? '#172b4d' : '#fff' }}>Payment Screenshot</th>
              <th style={{ padding: 8, color: theme === 'light' ? '#172b4d' : '#fff' }}>UPI Txn ID</th>
              <th style={{ padding: 8, color: theme === 'light' ? '#172b4d' : '#fff' }}>Status</th>
              <th style={{ padding: 8, color: theme === 'light' ? '#172b4d' : '#fff' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={8} style={{ color: theme === 'light' ? '#b23b3b' : '#ffeaea', textAlign: 'center', padding: 16 }}>No bookings found.</td></tr>
            ) : filtered.map(b => (
              <tr key={b._id} style={{ borderBottom: '1px solid #333' }}>
                <td style={{ padding: 8 }}>{b.userId}</td>
                <td style={{ padding: 8 }}>{b.exam}</td>
                <td style={{ padding: 8 }}>{b.city}</td>
                <td style={{ padding: 8 }}>{b.date}</td>
                <td style={{ padding: 8 }}>{b.bus}</td>
                <td style={{ padding: 8 }}>{Array.isArray(b.seatNumbers) ? b.seatNumbers.join(', ') : b.seatNumbers || '-'}</td>
                <td style={{ padding: 8 }}>{b.price || 0}</td>
                <td style={{ padding: 8 }}>{(b.price || 0) * (Array.isArray(b.seatNumbers) ? b.seatNumbers.length : 1)}</td>
                <td style={{ padding: 8 }}>
                  {b.upiScreenshot && b.upiScreenshot.startsWith('/uploads/') ? (
                    <a href={b.upiScreenshot} target="_blank" rel="noopener noreferrer">
                      <img src={b.upiScreenshot} alt="Payment Screenshot" style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6, border: '1px solid #ccc' }} />
                    </a>
                  ) : b.upiScreenshot ? b.upiScreenshot : b.upiTxnId ? b.upiTxnId : '-'}
                </td>
                <td style={{ padding: 8 }}>{b.upiTxnId || '-'}</td>
                <td style={{ padding: 8 }}>
                  <select value={b.status} onChange={e => handleStatus(b._id, e.target.value)} style={{ padding: 4, borderRadius: 4 }}>
                    <option value="pending">pending</option>
                    <option value="confirmed">confirmed</option>
                    <option value="rejected">rejected</option>
                  </select>
                </td>
                <td style={{ padding: 8, display: 'flex', gap: 8 }}>
                  <button onClick={() => handleDelete(b._id)} style={{ background: '#ff5e62', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 10px', fontWeight: 600, cursor: 'pointer' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
} 