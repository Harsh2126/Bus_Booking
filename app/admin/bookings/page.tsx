"use client";
import { useEffect, useState } from 'react';
import AdminBookingManager from '../../components/AdminBookingManager';

export default function AdminBookingsPage() {
  const [total, setTotal] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/bookings/all')
      .then(res => res.json())
      .then(data => setTotal(data.bookings?.length || 0));
  }, []);

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 28 }} role="img" aria-label="bus">🚌</span>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Booking Management</h1>
        </div>
        <div style={{ fontWeight: 700, fontSize: 16 }}>Total: {total !== null ? total : '...'}</div>
      </div>
      <section style={{ maxWidth: 1000, margin: '0 auto', background: 'inherit', borderRadius: 18, boxShadow: '0 2px 12px rgba(0,0,0,0.10)', padding: '0' }}>
        <AdminBookingManager />
      </section>
    </>
  );
}