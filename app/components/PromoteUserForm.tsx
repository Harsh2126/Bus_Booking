import React, { useState } from 'react';

export default function PromoteUserForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/users/promote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(`User ${data.email} promoted to admin!`);
        setEmail('');
      } else {
        setError(data.error || 'Failed to promote user.');
      }
    } catch (err) {
      setError('Network error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '32px auto', background: '#f4f8ff', borderRadius: 12, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
      <h3 style={{ marginBottom: 18, color: '#003366' }}>Promote User to Admin</h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <input
          type="email"
          placeholder="User email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{ padding: 10, borderRadius: 6, border: '1px solid #bbb' }}
        />
        <button type="submit" disabled={loading} style={{ padding: '10px 0', borderRadius: 8, background: '#003366', color: '#fff', fontWeight: 600, border: 'none', cursor: loading ? 'not-allowed' : 'pointer' }}>
          {loading ? 'Promoting...' : 'Promote'}
        </button>
      </form>
      {message && <div style={{ color: 'green', marginTop: 12 }}>{message}</div>}
      {error && <div style={{ color: 'red', marginTop: 12 }}>{error}</div>}
    </div>
  );
} 