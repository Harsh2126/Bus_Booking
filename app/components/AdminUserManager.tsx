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
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
      <h3 className="text-gray-900 mb-6 font-extrabold text-2xl tracking-tight">User Management</h3>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3 font-semibold text-sm text-gray-900">Email</th>
            <th className="px-4 py-3 font-semibold text-sm text-gray-900">Role</th>
            <th className="px-4 py-3 font-semibold text-sm text-gray-900">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-gray-50">
          {users.map((user, idx) => (
            <tr key={user._id} className="border-b border-gray-200 transition duration-200">
              <td className="px-4 py-4 text-sm text-gray-900">{user.email}</td>
              <td className="px-4 py-4 text-sm text-gray-900">{user.role}</td>
              <td className="px-4 py-4 flex gap-2">
                {user.role !== 'admin' ? (
                  <button onClick={() => handlePromote(user._id)} className="px-4 py-2 bg-blue-500 text-white rounded-md font-semibold text-sm">Promote to Admin</button>
                ) : (
                  <button onClick={() => handleDemote(user._id)} className="px-4 py-2 bg-gray-400 text-white rounded-md font-semibold text-sm">Demote to User</button>
                )}
                <button onClick={() => handleDelete(user._id)} className="px-4 py-2 bg-red-500 text-white rounded-md font-semibold text-sm">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {loading && <div className="text-gray-400 mt-3">Loading...</div>}
    </div>
  );
} 