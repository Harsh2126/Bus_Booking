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
    <div className="space-y-8">
      <div className="flex items-center gap-4 mb-6 p-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl shadow-lg">
        <span className="text-3xl">📋</span>
        <h1 className="text-2xl font-bold">Booking Management</h1>
        <div className="ml-auto font-semibold text-lg text-blue-100">
          Total: {total !== null ? total : '...'}
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
        <AdminBookingManager />
      </div>
    </div>
  );
}