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
    <div>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        marginBottom: '24px',
        padding: '20px',
        background: '#334155',
        borderRadius: '12px',
        border: '1px solid #475569'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '24px' }}>👥</span>
          <h2 style={{ fontSize: '20px', fontWeight: '600', margin: 0, color: 'white' }}>
            User Management
          </h2>
        </div>
        <div style={{ 
          fontWeight: '600', 
          fontSize: '16px',
          color: '#94a3b8'
        }}>
          Total: {total !== null ? total : '...'}
        </div>
      </div>
      
      <div style={{ 
        background: '#334155',
        borderRadius: '16px',
        border: '1px solid #475569',
        overflow: 'hidden'
      }}>
        <AdminUserManager />
      </div>
    </div>
  );
} 