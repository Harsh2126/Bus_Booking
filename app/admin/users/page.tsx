"use client";
import { useEffect, useState } from 'react';
import AdminUserManager from '../../components/AdminUserManager';

export default function AdminUsersPage() {
  const [total, setTotal] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => setTotal(data.users?.length || 0));
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-6">
        <div className="flex items-center gap-4">
          <span className="text-3xl">👥</span>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        </div>
        <div className="font-semibold text-lg text-gray-500">
          Total Users: {total !== null ? total : '...'}
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-0 overflow-x-auto">
        <AdminUserManager />
      </div>
    </div>
  );
} 