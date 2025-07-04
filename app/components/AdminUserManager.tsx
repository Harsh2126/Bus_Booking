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
    <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 16, padding: 24, marginBottom: 32 }}>
      <h3 style={{ color: theme === 'light' ? '#172b4d' : '#fff', marginBottom: 16 }}>User Management</h3>
      {error && <div style={{ color: '#ff5e62', marginBottom: 8 }}>{error}</div>}
      <table style={{ width: '100%', color: theme === 'light' ? '#172b4d' : '#fff', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: theme === 'light' ? '#e0e7ef' : 'rgba(0,0,0,0.10)' }}>
            <th style={{ padding: 8, textAlign: 'left', color: theme === 'light' ? '#172b4d' : '#fff' }}>Email</th>
            <th style={{ padding: 8, textAlign: 'left', color: theme === 'light' ? '#172b4d' : '#fff' }}>Role</th>
            <th style={{ padding: 8, color: theme === 'light' ? '#172b4d' : '#fff' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id} style={{ borderBottom: '1px solid #333' }}>
              <td style={{ padding: 8 }}>{user.email}</td>
              <td style={{ padding: 8 }}>{user.role}</td>
              <td style={{ padding: 8, display: 'flex', gap: 8 }}>
                {user.role !== 'admin' ? (
                  <button onClick={() => handlePromote(user._id)} style={{ background: '#4f8cff', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 10px', fontWeight: 600, cursor: 'pointer' }}>Promote to Admin</button>
                ) : (
                  <button onClick={() => handleDemote(user._id)} style={{ background: '#aaa', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 10px', fontWeight: 600, cursor: 'pointer' }}>Demote to User</button>
                )}
                <button onClick={() => handleDelete(user._id)} style={{ background: '#ff5e62', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 10px', fontWeight: 600, cursor: 'pointer' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {loading && <div style={{ color: theme === 'light' ? '#003366' : '#ffeaea', marginTop: 8 }}>Loading...</div>}
    </div>
  );
} 