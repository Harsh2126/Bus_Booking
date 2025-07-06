"use client";
import Image from 'next/image';
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
    <div style={{ background: '#334155', borderRadius: 18, padding: 32, marginBottom: 32, boxShadow: '0 2px 12px rgba(0,0,0,0.10)', maxWidth: 1300, margin: '0 auto', fontFamily: 'Inter, sans-serif', color: '#fff', border: '1px solid #475569' }}>
      <h3 style={{ color: '#fff', marginBottom: 24, fontWeight: 800, fontSize: 28, letterSpacing: 0.5, display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 32 }}>🚌</span> Booking Management
      </h3>
      {error && <div style={{ color: '#ef4444', marginBottom: 8 }}>{error}</div>}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
        <input placeholder="Search by user email" value={search} onChange={e => setSearch(e.target.value)} style={{ padding: '10px 16px', borderRadius: 8, border: '1.5px solid #475569', fontSize: 16, minWidth: 180, background: '#1e293b', color: '#fff', transition: 'border 0.2s' }} />
        <select value={city} onChange={e => setCity(e.target.value)} style={{ padding: '10px 16px', borderRadius: 8, border: '1.5px solid #475569', fontSize: 16, background: '#1e293b', color: '#fff', minWidth: 140, transition: 'border 0.2s' }}>
          <option value="">All Cities</option>
          {cities.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={status} onChange={e => setStatus(e.target.value)} style={{ padding: '10px 16px', borderRadius: 8, border: '1.5px solid #475569', fontSize: 16, background: '#1e293b', color: '#fff', minWidth: 140, transition: 'border 0.2s' }}>
          <option value="">All Statuses</option>
          {statuses.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ padding: '10px 16px', borderRadius: 8, border: '1.5px solid #475569', fontSize: 16, background: '#1e293b', color: '#fff', minWidth: 160, transition: 'border 0.2s' }} />
        <button onClick={() => { setSearch(''); setCity(''); setStatus(''); setDate(''); }} style={{ padding: '10px 18px', borderRadius: 8, background: '#475569', color: '#fff', border: 'none', fontWeight: 700, fontSize: 16, transition: 'background 0.2s', cursor: 'pointer' }}>Clear</button>
      </div>
      {loading ? <div style={{ color: '#94a3b8', fontSize: 18, fontWeight: 600 }}>Loading...</div> : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', color: '#fff', borderCollapse: 'collapse', fontSize: 15, minWidth: 900 }}>
            <thead style={{ position: 'sticky', top: 0, zIndex: 2 }}>
              <tr style={{ background: '#475569' }}>
                <th style={{ padding: 10, color: '#fff', fontWeight: 700 }}>User</th>
                <th style={{ padding: 10, color: '#fff', fontWeight: 700 }}>Exam</th>
                <th style={{ padding: 10, color: '#fff', fontWeight: 700 }}>City</th>
                <th style={{ padding: 10, color: '#fff', fontWeight: 700 }}>Date</th>
                <th style={{ padding: 10, color: '#fff', fontWeight: 700 }}>Bus</th>
                <th style={{ padding: 10, color: '#fff', fontWeight: 700 }}>Seats</th>
                <th style={{ padding: 10, color: '#fff', fontWeight: 700 }}>Price per Seat</th>
                <th style={{ padding: 10, color: '#fff', fontWeight: 700 }}>Total Price</th>
                <th style={{ padding: 10, color: '#fff', fontWeight: 700 }}>Payment Screenshot</th>
                <th style={{ padding: 10, color: '#fff', fontWeight: 700 }}>UPI Txn ID</th>
                <th style={{ padding: 10, color: '#fff', fontWeight: 700 }}>Status</th>
                <th style={{ padding: 10, color: '#fff', fontWeight: 700 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={12} style={{ color: '#ef4444', textAlign: 'center', padding: 32, fontSize: 18, fontWeight: 600, background: '#1e293b' }}>
                    <span style={{ fontSize: 28, marginRight: 8 }}>🛑</span> No bookings found.
                  </td>
                </tr>
              ) : filtered.map((b, idx) => (
                <tr key={b._id} style={{ borderBottom: '1.5px solid #334155', background: idx % 2 === 0 ? '#1e293b' : '#334155', transition: 'background 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#475569'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = idx % 2 === 0 ? '#1e293b' : '#334155'; }}
                >
                  <td style={{ padding: 10 }}>{b.userId}</td>
                  <td style={{ padding: 10 }}>{b.exam}</td>
                  <td style={{ padding: 10 }}>{b.city}</td>
                  <td style={{ padding: 10 }}>{b.date}</td>
                  <td style={{ padding: 10 }}>{b.bus}</td>
                  <td style={{ padding: 10 }}>{Array.isArray(b.seatNumbers) ? b.seatNumbers.join(', ') : b.seatNumbers || '-'}</td>
                  <td style={{ padding: 10 }}>{b.price || 0}</td>
                  <td style={{ padding: 10 }}>{(b.price || 0) * (Array.isArray(b.seatNumbers) ? b.seatNumbers.length : 1)}</td>
                  <td style={{ padding: 10 }}>
                    {b.upiScreenshot && b.upiScreenshot.startsWith('/uploads/') ? (
                      <Image src={b.upiScreenshot} alt="Payment Screenshot" width={48} height={48} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6, border: '1px solid #475569', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }} />
                    ) : b.upiScreenshot ? b.upiScreenshot : b.upiTxnId ? b.upiTxnId : '-'}
                  </td>
                  <td style={{ padding: 10 }}>{b.upiTxnId || '-'}</td>
                  <td style={{ padding: 10 }}>
                    <select value={b.status} onChange={e => handleStatus(b._id, e.target.value)} style={{ padding: 6, borderRadius: 6, border: '1.5px solid #475569', background: '#1e293b', color: '#fff', fontWeight: 600, fontSize: 15, transition: 'border 0.2s' }}>
                      <option value="pending">pending</option>
                      <option value="confirmed">confirmed</option>
                      <option value="rejected">rejected</option>
                    </select>
                  </td>
                  <td style={{ padding: 10, display: 'flex', gap: 8 }}>
                    <button onClick={() => handleDelete(b._id)} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontWeight: 700, fontSize: 15, cursor: 'pointer', boxShadow: '0 1px 4px rgba(239,68,68,0.10)', transition: 'background 0.2s, box-shadow 0.2s' }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 