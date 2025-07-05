"use client";

import React, { useEffect, useState } from 'react';

interface City {
  id: string;
  name: string;
  state?: string;
  country?: string;
}

const CityAdminManager = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newCityName, setNewCityName] = useState('');
  const [editingCityId, setEditingCityId] = useState<string | null>(null);
  const [editingCityName, setEditingCityName] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchCities = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/cities');
      if (!res.ok) throw new Error('Failed to fetch cities');
      const data = await res.json();
      console.log('Cities API response:', data);
      setCities(Array.isArray(data.cities) ? data.cities : []);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError('Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  // Create
  const handleAddCity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCityName.trim()) return;
    setActionLoading(true);
    try {
      const res = await fetch('/api/cities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCityName }),
      });
      if (!res.ok) throw new Error('Failed to add city');
      setNewCityName('');
      await fetchCities();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setActionLoading(false);
    }
  };

  // Edit
  const startEdit = (city: City) => {
    setEditingCityId(city.id);
    setEditingCityName(city.name);
  };

  const handleEditCity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCityId === null || !editingCityName.trim()) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/cities/${editingCityId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editingCityName }),
      });
      if (!res.ok) throw new Error('Failed to update city');
      setEditingCityId(null);
      setEditingCityName('');
      await fetchCities();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setActionLoading(false);
    }
  };

  // Delete
  const handleDeleteCity = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this city?')) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/cities/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete city');
      await fetchCities();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div style={{ margin: '32px 0', color: '#fff' }}>
      <h2 style={{ marginBottom: 24, color: '#fff', fontWeight: 900, fontSize: 28, letterSpacing: 0.5 }}>City Management</h2>
      <form onSubmit={handleAddCity} style={{ marginBottom: 32, display: 'flex', gap: 16, alignItems: 'flex-end', background: '#334155', padding: 24, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #475569' }}>
        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 200 }}>
          <label style={{ marginBottom: 4, fontWeight: 600, color: '#94a3b8' }}>New city name</label>
          <input
            type="text"
            value={newCityName}
            onChange={e => setNewCityName(e.target.value)}
            placeholder="Enter city name"
            disabled={actionLoading}
            style={{ padding: 10, borderRadius: 8, border: '1.5px solid #475569', background: '#1e293b', color: '#fff' }}
          />
        </div>
        <button
          type="submit"
          disabled={actionLoading || !newCityName.trim()}
          style={{ padding: '10px 24px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 16, marginTop: 24, cursor: 'pointer', minWidth: 120, transition: 'background 0.2s' }}
        >
          Add City
        </button>
      </form>
      {loading ? (
        <p style={{ color: '#94a3b8' }}>Loading cities...</p>
      ) : error ? (
        <p style={{ color: '#ef4444' }}>{error}</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#334155', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #475569', color: '#fff' }}>
          <thead style={{ background: '#475569' }}>
            <tr>
              <th style={{ border: '1px solid #475569', padding: '10px 8px', fontWeight: 700, color: '#fff' }}>ID</th>
              <th style={{ border: '1px solid #475569', padding: '10px 8px', fontWeight: 700, color: '#fff' }}>Name</th>
              <th style={{ border: '1px solid #475569', padding: '10px 8px', fontWeight: 700, color: '#fff' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cities.map((city, idx) => (
              <tr key={city.id ?? city.name ?? idx} style={{ background: idx % 2 === 0 ? '#1e293b' : '#334155', transition: 'background 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#475569'; }}
                onMouseLeave={e => { e.currentTarget.style.background = idx % 2 === 0 ? '#1e293b' : '#334155'; }}
              >
                <td style={{ border: '1px solid #475569', padding: '8px', color: '#fff' }}>{city.id}</td>
                <td style={{ border: '1px solid #475569', padding: '8px', color: '#fff' }}>{editingCityId === city.id ? (
                  <form onSubmit={handleEditCity} style={{ display: 'flex', gap: 8 }}>
                    <input
                      type="text"
                      value={editingCityName}
                      onChange={e => setEditingCityName(e.target.value)}
                      disabled={actionLoading}
                      style={{ padding: 8, borderRadius: 6, border: '1.5px solid #475569', minWidth: 120, background: '#1e293b', color: '#fff' }}
                    />
                    <button type="submit" disabled={actionLoading || !editingCityName.trim()} style={{ padding: '6px 14px', borderRadius: 8, border: 'none', background: '#2563eb', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 15, transition: 'background 0.2s' }}>Save</button>
                    <button type="button" onClick={() => setEditingCityId(null)} disabled={actionLoading} style={{ padding: '6px 14px', borderRadius: 8, border: 'none', background: '#fbbf24', color: '#222', fontWeight: 700, cursor: 'pointer', fontSize: 15, transition: 'background 0.2s' }}>Cancel</button>
                  </form>
                ) : (
                  city.name
                )}</td>
                <td style={{ border: '1px solid #475569', padding: '8px' }}>
                  {editingCityId === city.id ? null : (
                    <>
                      <button onClick={() => startEdit(city)} disabled={actionLoading} style={{ marginRight: 8, padding: '6px 14px', borderRadius: 8, border: 'none', background: '#fbbf24', color: '#222', fontWeight: 700, cursor: 'pointer', fontSize: 15, transition: 'background 0.2s' }}>Edit</button>
                      <button onClick={() => handleDeleteCity(city.id)} disabled={actionLoading} style={{ padding: '6px 14px', borderRadius: 8, border: 'none', background: '#ef4444', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 15, transition: 'background 0.2s' }}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CityAdminManager; 