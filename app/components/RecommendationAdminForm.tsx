"use client";
import { useContext, useEffect, useState } from 'react';
import { ThemeContext } from '../ThemeProvider';

interface Recommendation {
  _id?: string;
  icon: string;
  route: string;
  desc: string;
  date?: string;
}

interface BusOption {
  _id: string;
  name: string;
  number: string;
  type: string;
  capacity: number;
  status: string;
  exams?: any[];
  routeFrom?: string;
  routeTo?: string;
  date?: string;
  contactNumber?: string;
  timing?: string;
}

export default function RecommendationAdminForm() {
  const { theme } = useContext(ThemeContext);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [form, setForm] = useState<Recommendation>({ icon: '💡', route: '', desc: '', date: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [buses, setBuses] = useState<BusOption[]>([]);

  // Fetch recommendations
  useEffect(() => {
    fetch('/api/recommendations')
      .then(res => res.json())
      .then(data => setRecommendations(data.recommendations || []));
    fetch('/api/buses')
      .then(res => res.json())
      .then(data => setBuses(data.buses || []));
  }, []);

  // Handle form input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add or update recommendation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      let res: Response;
      let data: { recommendation: Recommendation };
      if (editingId) {
        res = await fetch(`/api/recommendations/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        data = await res.json();
        setRecommendations(recommendations.map(r => r._id === editingId ? data.recommendation : r));
        setEditingId(null);
      } else {
        res = await fetch('/api/recommendations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        data = await res.json();
        setRecommendations([data.recommendation, ...recommendations]);
      }
      setForm({ icon: '💡', route: '', desc: '', date: '' });
    } catch (err) {
      setError('Failed to save recommendation.');
    } finally {
      setLoading(false);
    }
  };

  // Edit recommendation
  const handleEdit = (rec: Recommendation) => {
    setForm({ icon: rec.icon, route: rec.route, desc: rec.desc, date: rec.date });
    setEditingId(rec._id!);
  };

  // Delete recommendation
  const handleDelete = async (id: string) => {
    setLoading(true);
    setError('');
    try {
      await fetch(`/api/recommendations/${id}`, { method: 'DELETE' });
      setRecommendations(recommendations.filter(r => r._id !== id));
    } catch (err) {
      setError('Failed to delete recommendation.');
    } finally {
      setLoading(false);
    }
  };

  // Add a function to refresh buses
  const refreshBuses = () => {
    setLoading(true);
    fetch('/api/buses')
      .then(res => res.json())
      .then(data => setBuses(data.buses || []))
      .finally(() => setLoading(false));
  };

  // Use a default emoji if icon is empty or invalid
  const getIcon = (icon: string) => (icon && icon.length <= 2 ? icon : '💡');

  return (
    <div style={{ background: '#fff', borderRadius: 18, padding: 32, boxShadow: '0 2px 12px rgba(0,0,0,0.10)', marginBottom: 32, maxWidth: 700, margin: '0 auto' }}>
      {/* Removed lower Add Recommendation header for cleaner UI */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center', marginBottom: 24, background: '#f8fafc', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 80 }}>
          <label style={{ fontWeight: 600, marginBottom: 4 }}>Icon</label>
          <input name="icon" value={form.icon} onChange={handleChange} placeholder="💡" style={{ width: 60, fontSize: 28, borderRadius: 8, border: '1px solid #ccc', padding: 8, textAlign: 'center', background: theme === 'light' ? '#fff' : '#23232b' }} maxLength={2} />
        </div>
        <div style={{ flex: 2, display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontWeight: 600, marginBottom: 4 }}>Bus</label>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <select name="route" value={form.route} onChange={handleChange} required style={{ flex: 1, borderRadius: 8, border: '1px solid #ccc', padding: 8, fontSize: 16, background: theme === 'light' ? '#fff' : '#23232b' }}>
              <option value="">Select Bus</option>
              {buses.map(bus => (
                <option key={bus._id} value={bus._id}>
                  {bus.name} ({bus.number}) | {bus.type} | {bus.routeFrom} → {bus.routeTo} | {bus.date}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={refreshBuses}
              style={{ marginLeft: 8, padding: '8px 16px', borderRadius: 8, background: '#2563eb', color: '#fff', fontWeight: 600, border: 'none', cursor: 'pointer', fontSize: 16 }}
              title="Refresh Buses"
            >
              Refresh
            </button>
          </div>
        </div>
        <div style={{ flex: 3, display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontWeight: 600, marginBottom: 4 }}>Description</label>
          <input name="desc" value={form.desc} onChange={handleChange} placeholder="Description" required style={{ borderRadius: 8, border: '1px solid #ccc', padding: 8, fontSize: 16, background: theme === 'light' ? '#fff' : '#23232b' }} />
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontWeight: 600, marginBottom: 4 }}>Date</label>
          <input
            type="date"
            placeholder="Date"
            value={form.date || ''}
            onChange={e => setForm({ ...form, date: e.target.value })}
            required
            style={{ borderRadius: 8, border: '1px solid #ccc', padding: 8, fontSize: 16, background: theme === 'light' ? '#fff' : '#23232b' }}
          />
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 18 }}>
          <button type="submit" disabled={loading} style={{ padding: '10px 28px', borderRadius: 10, background: '#36b37e', color: '#fff', fontWeight: 700, fontSize: 16, border: 'none', boxShadow: '0 2px 8px rgba(54,179,126,0.10)', cursor: loading ? 'not-allowed' : 'pointer' }}>{editingId ? 'Update' : 'Add'}</button>
          {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ icon: '💡', route: '', desc: '', date: '' }); }} style={{ padding: '10px 18px', borderRadius: 10, background: '#aaa', color: '#fff', fontWeight: 700, fontSize: 16, border: 'none' }}>Cancel</button>}
        </div>
      </form>
      {error && <div style={{ color: '#ff5e62', marginBottom: 8 }}>{error}</div>}
      <div style={{ marginTop: 24 }}>
        <h4 style={{ fontWeight: 800, fontSize: 20, color: '#2563eb', marginBottom: 18 }}>Current Recommendations</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {recommendations.length === 0 && <div style={{ color: '#64748b', fontSize: 16 }}>No recommendations yet.</div>}
          {recommendations.map(rec => {
            const bus = buses.find(b => b._id === rec.route);
            return (
              <div key={rec._id} style={{ display: 'flex', alignItems: 'center', gap: 18, background: '#f8fafc', borderRadius: 14, padding: 18, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <span style={{ fontSize: 32 }}>{getIcon(rec.icon)}</span>
                <div style={{ flex: 2 }}>
                  <div style={{ fontWeight: 700, color: '#2563eb', fontSize: 18 }}>{bus ? `${bus.name} (${bus.number})` : rec.route}</div>
                  <div style={{ color: '#64748b', fontSize: 15, margin: '2px 0 6px 0' }}>{bus ? `${bus.type} | ${bus.routeFrom} → ${bus.routeTo} | ${bus.date}` : ''}</div>
                  <div style={{ color: '#222', fontSize: 15 }}>{rec.desc}</div>
                  {rec.date && <span style={{ display: 'inline-block', marginTop: 6, background: '#e0e7ef', color: '#2563eb', borderRadius: 8, padding: '2px 10px', fontWeight: 600, fontSize: 14 }}>📅 {rec.date}</span>}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <button onClick={() => handleEdit(rec)} style={{ background: '#fbbf24', color: '#222', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 700, fontSize: 15, cursor: 'pointer', marginBottom: 4 }}>Edit</button>
                  <button onClick={() => handleDelete(rec._id!)} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>Delete</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 