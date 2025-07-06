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
    <div className="space-y-8">
      <h2 className="mb-6 font-extrabold text-2xl text-gray-900 tracking-tight">City Management</h2>
      <form onSubmit={handleAddCity} className="mb-8 flex gap-4 items-end bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
        <div className="flex flex-col min-w-[200px]">
          <label className="mb-2 font-semibold text-gray-900">New city name</label>
          <input
            type="text"
            value={newCityName}
            onChange={e => setNewCityName(e.target.value)}
            placeholder="Enter city name"
            disabled={actionLoading}
            className="p-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          disabled={actionLoading || !newCityName.trim()}
          className="px-4 py-2 bg-blue-500 text-white rounded-md font-semibold text-sm mt-6"
        >
          Add City
        </button>
      </form>
      {loading ? (
        <p className="text-gray-400">Loading cities...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <table className="w-full border-collapse bg-white rounded-2xl shadow-lg border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-200 px-4 py-3 font-semibold text-sm text-gray-900">ID</th>
              <th className="border border-gray-200 px-4 py-3 font-semibold text-sm text-gray-900">Name</th>
              <th className="border border-gray-200 px-4 py-3 font-semibold text-sm text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-gray-50">
            {cities.map((city, idx) => (
              <tr key={city.id ?? city.name ?? idx} className="border-b border-gray-200 transition duration-200">
                <td className="px-4 py-4 text-sm text-gray-900">{city.id}</td>
                <td className="px-4 py-4 text-sm text-gray-900">{editingCityId === city.id ? (
                  <form onSubmit={handleEditCity} className="flex gap-2">
                    <input
                      type="text"
                      value={editingCityName}
                      onChange={e => setEditingCityName(e.target.value)}
                      disabled={actionLoading}
                      className="p-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[120px]"
                    />
                    <button type="submit" disabled={actionLoading || !editingCityName.trim()} className="px-4 py-2 bg-blue-500 text-white rounded-md font-semibold text-sm">Save</button>
                    <button type="button" onClick={() => setEditingCityId(null)} disabled={actionLoading} className="px-4 py-2 bg-yellow-400 text-gray-900 rounded-md font-semibold text-sm">Cancel</button>
                  </form>
                ) : (
                  city.name
                )}</td>
                <td className="px-4 py-4 text-sm text-gray-900">
                  {editingCityId === city.id ? null : (
                    <>
                      <button onClick={() => startEdit(city)} disabled={actionLoading} className="mr-2 px-4 py-2 bg-yellow-400 text-gray-900 rounded-md font-semibold text-sm">Edit</button>
                      <button onClick={() => handleDeleteCity(city.id)} disabled={actionLoading} className="px-4 py-2 bg-red-500 text-white rounded-md font-semibold text-sm">Delete</button>
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