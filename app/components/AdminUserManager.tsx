import { useContext, useEffect, useState } from 'react';
import { ThemeContext } from '../ThemeProvider';

interface User {
  _id: string;
  email: string;
  role: string;
}

export default function AdminUserManager() {
  const { theme } = useContext(ThemeContext);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      setError('Failed to fetch users.');
    } finally {
      setLoading(false);
    }
  };

  const handlePromote = async (id: string) => {
    setLoading(true);
    setError('');
    try {
      await fetch(`/api/users/${id}/promote`, { method: 'POST' });
      fetchUsers();
    } catch (err) {
      setError('Failed to promote user.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemote = async (id: string) => {
    setLoading(true);
    setError('');
    try {
      await fetch(`/api/users/${id}/demote`, { method: 'POST' });
      fetchUsers();
    } catch (err) {
      setError('Failed to demote user.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    setError('');
    try {
      await fetch(`/api/users/${id}`, { method: 'DELETE' });
      setUsers(users.filter(u => u._id !== id));
    } catch (err) {
      setError('Failed to delete user.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#334155', borderRadius: 18, padding: 32, marginBottom: 32, boxShadow: '0 2px 12px rgba(0,0,0,0.10)', border: '1px solid #475569', color: '#fff' }}>
      <h3 style={{ color: '#fff', marginBottom: 24, fontWeight: 800, fontSize: 24, letterSpacing: 0.5 }}>User Management</h3>
      {error && <div style={{ color: '#ef4444', marginBottom: 8 }}>{error}</div>}
      <table style={{ width: '100%', color: '#fff', borderCollapse: 'collapse', fontSize: 16 }}>
        <thead>
          <tr style={{ background: '#475569' }}>
            <th style={{ padding: 12, textAlign: 'left', color: '#fff', fontWeight: 700 }}>Email</th>
            <th style={{ padding: 12, textAlign: 'left', color: '#fff', fontWeight: 700 }}>Role</th>
            <th style={{ padding: 12, color: '#fff', fontWeight: 700 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, idx) => (
            <tr key={user._id} style={{ borderBottom: '1.5px solid #334155', background: idx % 2 === 0 ? '#1e293b' : '#334155', transition: 'background 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#475569'; }}
              onMouseLeave={e => { e.currentTarget.style.background = idx % 2 === 0 ? '#1e293b' : '#334155'; }}
            >
              <td style={{ padding: 12 }}>{user.email}</td>
              <td style={{ padding: 12 }}>{user.role}</td>
              <td style={{ padding: 12, display: 'flex', gap: 10 }}>
                {user.role !== 'admin' ? (
                  <button onClick={() => handlePromote(user._id)} style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 14px', fontWeight: 700, cursor: 'pointer', fontSize: 15, transition: 'background 0.2s' }}>Promote to Admin</button>
                ) : (
                  <button onClick={() => handleDemote(user._id)} style={{ background: '#64748b', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 14px', fontWeight: 700, cursor: 'pointer', fontSize: 15, transition: 'background 0.2s' }}>Demote to User</button>
                )}
                <button onClick={() => handleDelete(user._id)} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 14px', fontWeight: 700, cursor: 'pointer', fontSize: 15, transition: 'background 0.2s' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {loading && <div style={{ color: '#94a3b8', marginTop: 12 }}>Loading...</div>}
    </div>
  );
} 