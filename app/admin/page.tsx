"use client";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the admin dashboard
    router.replace('/dashboard/admin-dashboard');
  }, [router]);

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '50vh',
      color: '#94a3b8',
      fontSize: '18px'
    }}>
      Redirecting to admin dashboard...
    </div>
  );
} 