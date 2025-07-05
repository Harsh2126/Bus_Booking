"use client";

import React, { useEffect, useRef, useState } from 'react';

interface Exam {
  _id: string;
  name: string;
}

interface Bus {
  _id: string;
  name: string;
  number: string;
  type: string;
  capacity: number;
  city: string;
  status: string;
  exams?: Exam[] | string[];
  routeFrom?: string;
  routeTo?: string;
  date?: string;
  contactNumber: string;
  timing: string;
  price: number;
}

interface CityOption {
  id?: number;
  _id?: string;
  name: string;
}

const BUS_TYPES = ["AC", "Non-AC", "Sleeper", "Seater"];
const BUS_STATUSES = ["active", "inactive"];

const BusAdminManager = () => {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newBus, setNewBus] = useState({
    name: '',
    number: '',
    type: BUS_TYPES[0],
    capacity: 40,
    status: BUS_STATUSES[0],
    exams: [] as string[],
    routeFrom: '',
    routeTo: '',
    date: '',
    contactNumber: '',
    timing: '',
    price: 0,
  });
  const [editingBusId, setEditingBusId] = useState<string | null>(null);
  const [editingBus, setEditingBus] = useState<typeof newBus>(newBus);
  const [actionLoading, setActionLoading] = useState(false);
  const [newExamName, setNewExamName] = useState('');
  const [cities, setCities] = useState<CityOption[]>([]);
  const [showExamDropdown, setShowExamDropdown] = useState(false);
  const examDropdownRef = useRef<HTMLDivElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);
  const [formWarning, setFormWarning] = useState<string | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (examDropdownRef.current && !examDropdownRef.current.contains(event.target as Node)) {
        setShowExamDropdown(false);
      }
    }
    if (showExamDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showExamDropdown]);

  // Fetch all exams for the multi-select
  const fetchExams = async () => {
    try {
      const res = await fetch('/api/exams');
      if (!res.ok) throw new Error('Failed to fetch exams');
      const data = await res.json();
      setExams(Array.isArray(data) ? data : data.exams || []);
    } catch (err) {
      // Optionally handle error
    }
  };

  const fetchBuses = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/buses');
      if (!res.ok) throw new Error('Failed to fetch buses');
      const data = await res.json();
      console.log('Buses API response:', data);
      setBuses(Array.isArray(data) ? data : data.buses || []);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError('Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all cities for the route selects
  const fetchCities = async () => {
    try {
      const res = await fetch('/api/cities');
      if (!res.ok) throw new Error('Failed to fetch cities');
      const data = await res.json();
      setCities(Array.isArray(data) ? data : data.cities || []);
    } catch (err) {
      // Optionally handle error
    }
  };

  useEffect(() => {
    fetchExams();
    fetchBuses();
    fetchCities();
  }, []);

  // Create
  const handleAddBus = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormWarning(null);
    if (!newBus.name.trim() || !newBus.number.trim() || !newBus.type.trim() || !newBus.routeFrom || !newBus.routeTo || !newBus.date) {
      setFormWarning('Please fill in all required fields, including Route From, Route To, and Date.');
      return;
    }
    setActionLoading(true);
    try {
      const res = await fetch('/api/buses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newBus, exams: newBus.exams, price: newBus.price }),
      });
      if (!res.ok) throw new Error('Failed to add bus');

      // Automatically add to recommendations
      await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          icon: '🚌',
          route: `${newBus.routeFrom} → ${newBus.routeTo}`,
          desc: `Recommended bus: ${newBus.name} (${newBus.type}, ${newBus.date})`,
        }),
      });

      setNewBus({ name: '', number: '', type: BUS_TYPES[0], capacity: 40, status: BUS_STATUSES[0], exams: [], routeFrom: '', routeTo: '', date: '', contactNumber: '', timing: '', price: 0 });
      await fetchBuses();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setActionLoading(false);
    }
  };

  // Edit
  const startEdit = (bus: Bus) => {
    setEditingBusId(bus._id);
    setEditingBus({
      name: bus.name,
      number: bus.number,
      type: bus.type,
      capacity: bus.capacity,
      status: bus.status,
      exams: Array.isArray(bus.exams)
        ? bus.exams.map(e =>
            typeof e === 'string'
              ? exams.find(exam => exam.name === e)?._id || e
              : e._id
          )
        : [],
      routeFrom: bus.routeFrom || '',
      routeTo: bus.routeTo || '',
      date: bus.date || '',
      contactNumber: bus.contactNumber || '',
      timing: bus.timing || '',
      price: bus.price || 0,
    });
  };

  const handleEditBus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBusId) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/buses/${editingBusId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...editingBus, price: editingBus.price }),
      });
      if (!res.ok) throw new Error('Failed to update bus');
      setEditingBusId(null);
      setEditingBus({ name: '', number: '', type: BUS_TYPES[0], capacity: 40, status: BUS_STATUSES[0], exams: [], routeFrom: '', routeTo: '', date: '', contactNumber: '', timing: '', price: 0 });
      await fetchBuses();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setActionLoading(false);
    }
  };

  // Delete
  const handleDeleteBus = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this bus?')) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/buses/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete bus');
      await fetchBuses();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExamName.trim()) return;
    try {
      const res = await fetch('/api/exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newExamName, cities: [] }),
      });
      if (!res.ok) throw new Error('Failed to add exam');
      setNewExamName('');
      await fetchExams();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  // Update input/select styles for accessibility
  const inputStyle = {
    padding: 12,
    borderRadius: 8,
    border: '1.5px solid #475569',
    background: '#1e293b',
    color: '#fff',
    fontSize: 16,
    outline: 'none',
    transition: 'border 0.2s',
  };
  const selectStyle = {
    ...inputStyle,
    minHeight: 56,
  };

  return (
    <div style={{ margin: '32px 0', fontFamily: 'Inter, Segoe UI, Arial, sans-serif' }}>
      <h2 style={{ marginBottom: 32, fontWeight: 900, fontSize: 36, color: '#fff', letterSpacing: '-1px' }}>Bus Management</h2>
      <div style={{ background: '#334155', borderRadius: 18, boxShadow: '0 6px 32px rgba(0,0,0,0.10)', padding: 36, marginBottom: 36, maxWidth: 1200, marginLeft: 'auto', marginRight: 'auto', border: '1px solid #475569', color: '#fff' }}>
        {editingBusId ? (
          <form onSubmit={handleEditBus} style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 24, rowGap: 18, alignItems: 'end' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ marginBottom: 6, fontWeight: 700, color: '#94a3b8', fontSize: 15 }}>Bus name</label>
              <input
                type="text"
                value={editingBus.name}
                onChange={e => setEditingBus({ ...editingBus, name: e.target.value })}
                placeholder="Bus name"
                disabled={actionLoading}
                style={inputStyle}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ marginBottom: 6, fontWeight: 700, color: '#94a3b8', fontSize: 15 }}>Bus number</label>
              <input
                type="text"
                value={editingBus.number}
                onChange={e => setEditingBus({ ...editingBus, number: e.target.value })}
                placeholder="Bus number"
                disabled={actionLoading}
                style={inputStyle}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ marginBottom: 6, fontWeight: 700, color: '#94a3b8', fontSize: 15 }}>Type</label>
              <select
                value={editingBus.type}
                onChange={e => setEditingBus({ ...editingBus, type: e.target.value })}
                disabled={actionLoading}
                style={selectStyle}
              >
                {BUS_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ marginBottom: 6, fontWeight: 700, color: '#94a3b8', fontSize: 15 }}>Capacity</label>
              <input
                type="number"
                value={editingBus.capacity}
                onChange={e => setEditingBus({ ...editingBus, capacity: Number(e.target.value) })}
                placeholder="Capacity"
                min={1}
                disabled={actionLoading}
                style={inputStyle}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ marginBottom: 6, fontWeight: 700, color: '#94a3b8', fontSize: 15 }}>Status</label>
              <select
                value={editingBus.status}
                onChange={e => setEditingBus({ ...editingBus, status: e.target.value })}
                disabled={actionLoading}
                style={selectStyle}
              >
                {BUS_STATUSES.map(status => <option key={status} value={status}>{status}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
              <label style={{ marginBottom: 6, fontWeight: 700, color: '#94a3b8', fontSize: 15 }}>Date</label>
              <input
                type="date"
                value={editingBus.date || ''}
                onChange={e => setEditingBus({ ...editingBus, date: e.target.value })}
                required
                style={{ ...inputStyle, paddingRight: 36 }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gridColumn: 'span 2', position: 'relative' }}>
              <label style={{ marginBottom: 6, fontWeight: 700, color: '#94a3b8', fontSize: 15 }}>Exams</label>
              <div
                style={{
                  background: '#1e293b',
                  border: '1.5px solid #475569',
                  borderRadius: 8,
                  minHeight: 44,
                  padding: '10px 12px',
                  fontSize: 16,
                  color: '#fff',
                  cursor: 'pointer',
                  userSelect: 'none',
                  position: 'relative',
                }}
                onClick={() => setShowExamDropdown(v => !v)}
                tabIndex={0}
              >
                {editingBus.exams.length === 0
                  ? <span style={{ color: '#94a3b8' }}>Select exams</span>
                  : exams.filter(exam => editingBus.exams.includes(exam._id)).map(exam => exam.name).join(', ')
                }
                <span style={{ float: 'right', color: '#94a3b8', fontSize: 18, marginLeft: 8 }}>&#9662;</span>
                {showExamDropdown && (
                  <div ref={examDropdownRef} style={{ position: 'absolute', top: 44, left: 0, zIndex: 10, background: '#1e293b', border: '1.5px solid #475569', borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.10)', width: '100%', maxHeight: 220, overflowY: 'auto', padding: 8 }}>
                    {exams.map(exam => (
                      <label key={exam._id} style={{ display: 'flex', alignItems: 'center', padding: '6px 8px', cursor: 'pointer', borderRadius: 6, transition: 'background 0.2s', fontSize: 15 }}>
                        <input
                          type="checkbox"
                          checked={editingBus.exams.includes(exam._id)}
                          onChange={e => {
                            if (e.target.checked) {
                              setEditingBus({ ...editingBus, exams: [...editingBus.exams, exam._id] });
                            } else {
                              setEditingBus({ ...editingBus, exams: editingBus.exams.filter(id => id !== exam._id) });
                            }
                          }}
                          style={{ marginRight: 8 }}
                        />
                        {exam.name}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ marginBottom: 6, fontWeight: 700, color: '#94a3b8', fontSize: 15 }}>Route From</label>
              <select
                value={editingBus.routeFrom || ''}
                onChange={e => setEditingBus({ ...editingBus, routeFrom: e.target.value })}
                disabled={actionLoading}
                required
                style={inputStyle}
              >
                <option value="" style={{ color: '#94a3b8', background: '#1e293b' }}>Select city</option>
                {cities.map(city => (
                  <option key={city.id || city._id || city.name} value={city.name} style={{ color: '#fff', background: '#1e293b' }}>{city.name}</option>
                ))}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ marginBottom: 6, fontWeight: 700, color: '#94a3b8', fontSize: 15 }}>Route To</label>
              <select
                value={editingBus.routeTo || ''}
                onChange={e => setEditingBus({ ...editingBus, routeTo: e.target.value })}
                disabled={actionLoading}
                required
                style={inputStyle}
              >
                <option value="" style={{ color: '#94a3b8', background: '#1e293b' }}>Select city</option>
                {cities.map(city => (
                  <option key={city.id || city._id || city.name} value={city.name} style={{ color: '#fff', background: '#1e293b' }}>{city.name}</option>
                ))}
              </select>
            </div>
            <div style={{ display: 'flex', gap: 24, marginBottom: 18 }}>
              <div style={{ flex: 1, marginRight: 12 }}>
                <label style={{ fontWeight: 600 }}>Bus Contact Number</label>
                <input
                  type="text"
                  placeholder="Contact number"
                  value={editingBus.contactNumber}
                  onChange={e => setEditingBus({ ...editingBus, contactNumber: e.target.value })}
                  style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #475569', marginTop: 4, background: '#1e293b', color: '#fff' }}
                />
              </div>
              <div style={{ flex: 1, marginLeft: 12 }}>
                <label style={{ fontWeight: 600 }}>Timing</label>
                <input
                  type="time"
                  placeholder="Timing"
                  value={editingBus.timing}
                  onChange={e => setEditingBus({ ...editingBus, timing: e.target.value })}
                  style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #475569', marginTop: 4, background: '#1e293b', color: '#fff' }}
                />
              </div>
            </div>
            <div>
              <label style={{ fontWeight: 600 }}>Price per Seat</label>
              <input
                type="text"
                value={editingBus.price === 0 ? '' : editingBus.price}
                onChange={e => setEditingBus({ ...editingBus, price: Number(e.target.value.replace(/[^0-9.]/g, '')) })}
                required
                placeholder="Enter price"
                style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #2563eb', marginBottom: 12, fontSize: 16, color: '#fff', background: '#1e293b' }}
                inputMode="decimal"
                pattern="[0-9]*"
                autoComplete="off"
              />
            </div>
            {formWarning && (
              <div style={{ color: '#ef4444', fontWeight: 700, marginBottom: 12, gridColumn: 'span 5' }}>{formWarning}</div>
            )}
            <button
              type="submit"
              disabled={actionLoading || !editingBus.name.trim() || !editingBus.number.trim() || !editingBus.type.trim() || !editingBus.routeFrom || !editingBus.routeTo}
              style={{ padding: '10px 28px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 16, marginTop: 8, cursor: 'pointer', minWidth: 0, gridColumn: 'span 5', boxShadow: '0 2px 8px rgba(37,99,235,0.08)', transition: 'background 0.2s' }}
              onMouseOver={e => (e.currentTarget.style.background = '#1741b6')}
              onMouseOut={e => (e.currentTarget.style.background = '#2563eb')}
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => { setEditingBusId(null); setEditingBus(newBus); }}
              style={{ padding: '10px 28px', background: '#aaa', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 16, marginTop: 8, cursor: 'pointer', minWidth: 0, gridColumn: 'span 5', boxShadow: '0 2px 8px rgba(37,99,235,0.08)', transition: 'background 0.2s' }}
            >
              Cancel
            </button>
          </form>
        ) : (
          <form onSubmit={handleAddBus} style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 24, rowGap: 18, alignItems: 'end' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ marginBottom: 6, fontWeight: 700, color: '#94a3b8', fontSize: 15 }}>Bus name</label>
              <input
                type="text"
                value={newBus.name}
                onChange={e => setNewBus({ ...newBus, name: e.target.value })}
                placeholder="Bus name"
                disabled={actionLoading}
                style={inputStyle}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ marginBottom: 6, fontWeight: 700, color: '#94a3b8', fontSize: 15 }}>Bus number</label>
              <input
                type="text"
                value={newBus.number}
                onChange={e => setNewBus({ ...newBus, number: e.target.value })}
                placeholder="Bus number"
                disabled={actionLoading}
                style={inputStyle}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ marginBottom: 6, fontWeight: 700, color: '#94a3b8', fontSize: 15 }}>Type</label>
              <select
                value={newBus.type}
                onChange={e => setNewBus({ ...newBus, type: e.target.value })}
                disabled={actionLoading}
                style={selectStyle}
              >
                {BUS_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ marginBottom: 6, fontWeight: 700, color: '#94a3b8', fontSize: 15 }}>Capacity</label>
              <input
                type="number"
                value={newBus.capacity}
                onChange={e => setNewBus({ ...newBus, capacity: Number(e.target.value) })}
                placeholder="Capacity"
                min={1}
                disabled={actionLoading}
                style={inputStyle}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ marginBottom: 6, fontWeight: 700, color: '#94a3b8', fontSize: 15 }}>Status</label>
              <select
                value={newBus.status}
                onChange={e => setNewBus({ ...newBus, status: e.target.value })}
                disabled={actionLoading}
                style={selectStyle}
              >
                {BUS_STATUSES.map(status => <option key={status} value={status}>{status}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
              <label style={{ marginBottom: 6, fontWeight: 700, color: '#94a3b8', fontSize: 15 }}>Date</label>
              <input
                type="date"
                value={newBus.date || ''}
                onChange={e => setNewBus({ ...newBus, date: e.target.value })}
                required
                style={{ ...inputStyle, paddingRight: 36 }}
                ref={dateInputRef}
              />
              <span
                onClick={() => {
                  if (dateInputRef.current) {
                    if (dateInputRef.current.showPicker) dateInputRef.current.showPicker();
                    else dateInputRef.current.focus();
                  }
                }}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: 38,
                  cursor: 'pointer',
                  fontSize: 22,
                  color: '#2563eb',
                  zIndex: 2
                }}
                title="Open calendar"
                role="button"
                tabIndex={0}
              >📅</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gridColumn: 'span 2', position: 'relative' }}>
              <label style={{ marginBottom: 6, fontWeight: 700, color: '#94a3b8', fontSize: 15 }}>Exams</label>
              <div
                style={{
                  background: '#1e293b',
                  border: '1.5px solid #475569',
                  borderRadius: 8,
                  minHeight: 44,
                  padding: '10px 12px',
                  fontSize: 16,
                  color: '#fff',
                  cursor: 'pointer',
                  userSelect: 'none',
                  position: 'relative',
                }}
                onClick={() => setShowExamDropdown(v => !v)}
                tabIndex={0}
              >
                {newBus.exams.length === 0
                  ? <span style={{ color: '#94a3b8' }}>Select exams</span>
                  : exams.filter(exam => newBus.exams.includes(exam._id)).map(exam => exam.name).join(', ')
                }
                <span style={{ float: 'right', color: '#94a3b8', fontSize: 18, marginLeft: 8 }}>&#9662;</span>
                {showExamDropdown && (
                  <div ref={examDropdownRef} style={{ position: 'absolute', top: 44, left: 0, zIndex: 10, background: '#1e293b', border: '1.5px solid #475569', borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.10)', width: '100%', maxHeight: 220, overflowY: 'auto', padding: 8 }}>
                    {exams.map(exam => (
                      <label key={exam._id} style={{ display: 'flex', alignItems: 'center', padding: '6px 8px', cursor: 'pointer', borderRadius: 6, transition: 'background 0.2s', fontSize: 15 }}>
                        <input
                          type="checkbox"
                          checked={newBus.exams.includes(exam._id)}
                          onChange={e => {
                            if (e.target.checked) {
                              setNewBus({ ...newBus, exams: [...newBus.exams, exam._id] });
                            } else {
                              setNewBus({ ...newBus, exams: newBus.exams.filter(id => id !== exam._id) });
                            }
                          }}
                          style={{ marginRight: 8 }}
                        />
                        {exam.name}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ marginBottom: 6, fontWeight: 700, color: '#94a3b8', fontSize: 15 }}>Route From</label>
              <select
                value={newBus.routeFrom || ''}
                onChange={e => setNewBus({ ...newBus, routeFrom: e.target.value })}
                disabled={actionLoading}
                required
                style={inputStyle}
              >
                <option value="" style={{ color: '#94a3b8', background: '#1e293b' }}>Select city</option>
                {cities.map(city => (
                  <option key={city.id || city._id || city.name} value={city.name} style={{ color: '#fff', background: '#1e293b' }}>{city.name}</option>
                ))}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ marginBottom: 6, fontWeight: 700, color: '#94a3b8', fontSize: 15 }}>Route To</label>
              <select
                value={newBus.routeTo || ''}
                onChange={e => setNewBus({ ...newBus, routeTo: e.target.value })}
                disabled={actionLoading}
                required
                style={inputStyle}
              >
                <option value="" style={{ color: '#94a3b8', background: '#1e293b' }}>Select city</option>
                {cities.map(city => (
                  <option key={city.id || city._id || city.name} value={city.name} style={{ color: '#fff', background: '#1e293b' }}>{city.name}</option>
                ))}
              </select>
            </div>
            <div style={{ display: 'flex', gap: 24, marginBottom: 18 }}>
              <div style={{ flex: 1, marginRight: 12 }}>
                <label style={{ fontWeight: 600 }}>Bus Contact Number</label>
                <input
                  type="text"
                  placeholder="Contact number"
                  value={newBus.contactNumber}
                  onChange={e => setNewBus({ ...newBus, contactNumber: e.target.value })}
                  style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #475569', marginTop: 4, background: '#1e293b', color: '#fff' }}
                />
              </div>
              <div style={{ flex: 1, marginLeft: 12 }}>
                <label style={{ fontWeight: 600 }}>Timing</label>
                <input
                  type="time"
                  placeholder="Timing"
                  value={newBus.timing}
                  onChange={e => setNewBus({ ...newBus, timing: e.target.value })}
                  style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #475569', marginTop: 4, background: '#1e293b', color: '#fff' }}
                />
              </div>
            </div>
            <div>
              <label style={{ fontWeight: 600 }}>Price per Seat</label>
              <input
                type="text"
                value={newBus.price === 0 ? '' : newBus.price}
                onChange={e => setNewBus({ ...newBus, price: Number(e.target.value.replace(/[^0-9.]/g, '')) })}
                required
                placeholder="Enter price"
                style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #2563eb', marginBottom: 12, fontSize: 16, color: '#fff', background: '#1e293b' }}
                inputMode="decimal"
                pattern="[0-9]*"
                autoComplete="off"
              />
            </div>
            {formWarning && (
              <div style={{ color: '#ef4444', fontWeight: 700, marginBottom: 12, gridColumn: 'span 5' }}>{formWarning}</div>
            )}
            <button
              type="submit"
              disabled={actionLoading || !newBus.name.trim() || !newBus.number.trim() || !newBus.type.trim() || !newBus.routeFrom || !newBus.routeTo}
              style={{ padding: '10px 28px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 16, marginTop: 8, cursor: 'pointer', minWidth: 0, gridColumn: 'span 5', boxShadow: '0 2px 8px rgba(37,99,235,0.08)', transition: 'background 0.2s' }}
              onMouseOver={e => (e.currentTarget.style.background = '#1741b6')}
              onMouseOut={e => (e.currentTarget.style.background = '#2563eb')}
            >
              Add Bus
            </button>
          </form>
        )}
      </div>
      <div style={{ background: '#334155', borderRadius: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', maxWidth: 600, margin: '0 auto 36px auto', padding: 24, border: '1px solid #475569', color: '#fff' }}>
        <form onSubmit={handleAddExam} style={{ display: 'flex', gap: 18, alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 220 }}>
            <label style={{ marginBottom: 4, fontWeight: 700, color: '#94a3b8' }}>Add New Exam</label>
            <input
              type="text"
              value={newExamName}
              onChange={e => setNewExamName(e.target.value)}
              placeholder="Exam name"
              style={inputStyle}
            />
          </div>
          <button
            type="submit"
            disabled={!newExamName.trim()}
            style={{ padding: '16px 0', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 900, fontSize: 20, cursor: 'pointer', minWidth: 180, boxShadow: '0 2px 8px rgba(37,99,235,0.08)', transition: 'background 0.2s' }}
            onMouseOver={e => (e.currentTarget.style.background = '#1741b6')}
            onMouseOut={e => (e.currentTarget.style.background = '#2563eb')}
          >
            Add Exam
          </button>
        </form>
      </div>
      {loading ? (
        <p style={{ color: '#94a3b8' }}>Loading buses...</p>
      ) : error ? (
        <p style={{ color: '#ef4444' }}>{error}</p>
      ) : (
        <div style={{ background: '#334155', borderRadius: 18, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: 24, maxWidth: 1200, margin: '0 auto', overflowX: 'auto', border: '1px solid #475569', color: '#fff' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, minWidth: 1100, color: '#fff' }}>
            <thead style={{ background: '#475569' }}>
              <tr>
                <th style={{ border: '1px solid #334155', padding: '14px 10px', fontWeight: 800, fontSize: 16, color: '#fff' }}>ID</th>
                <th style={{ border: '1px solid #334155', padding: '14px 10px', fontWeight: 800, fontSize: 16, color: '#fff' }}>Name</th>
                <th style={{ border: '1px solid #334155', padding: '14px 10px', fontWeight: 800, fontSize: 16, color: '#fff' }}>Number</th>
                <th style={{ border: '1px solid #334155', padding: '14px 10px', fontWeight: 800, fontSize: 16, color: '#fff' }}>Type</th>
                <th style={{ border: '1px solid #334155', padding: '14px 10px', fontWeight: 800, fontSize: 16, color: '#fff' }}>Capacity</th>
                <th style={{ border: '1px solid #334155', padding: '14px 10px', fontWeight: 800, fontSize: 16, color: '#fff' }}>Status</th>
                <th style={{ border: '1px solid #334155', padding: '14px 10px', fontWeight: 800, fontSize: 16, color: '#fff' }}>Exams</th>
                <th style={{ border: '1px solid #334155', padding: '14px 10px', fontWeight: 800, fontSize: 16, color: '#fff' }}>Route From</th>
                <th style={{ border: '1px solid #334155', padding: '14px 10px', fontWeight: 800, fontSize: 16, color: '#fff' }}>Route To</th>
                <th style={{ border: '1px solid #334155', padding: '14px 10px', fontWeight: 800, fontSize: 16, color: '#fff' }}>Date</th>
                <th style={{ border: '1px solid #334155', padding: '14px 10px', fontWeight: 800, fontSize: 16, color: '#fff' }}>Contact</th>
                <th style={{ border: '1px solid #334155', padding: '14px 10px', fontWeight: 800, fontSize: 16, color: '#fff' }}>Timing</th>
                <th style={{ border: '1px solid #334155', padding: '14px 10px', fontWeight: 800, fontSize: 16, color: '#fff' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {buses.map((bus, idx) => (
                <tr key={bus._id} style={{ background: idx % 2 === 0 ? '#1e293b' : '#334155', borderRadius: 8, transition: 'background 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#475569'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = idx % 2 === 0 ? '#1e293b' : '#334155'; }}
                >
                  <td style={{ border: '1px solid #475569', padding: '10px' }}>{bus._id}</td>
                  <td style={{ border: '1px solid #475569', padding: '10px' }}>{bus.name}</td>
                  <td style={{ border: '1px solid #475569', padding: '10px' }}>{bus.number}</td>
                  <td style={{ border: '1px solid #475569', padding: '10px' }}>{bus.type}</td>
                  <td style={{ border: '1px solid #475569', padding: '10px' }}>{bus.capacity}</td>
                  <td style={{ border: '1px solid #475569', padding: '10px' }}>{bus.status}</td>
                  <td style={{ border: '1px solid #475569', padding: '10px' }}>
                    {Array.isArray(bus.exams) && bus.exams.length > 0
                      ? bus.exams.map(e => typeof e === 'string' ? exams.find(exam => exam._id === e)?.name || e : e.name).join(', ')
                      : '—'}
                  </td>
                  <td style={{ border: '1px solid #475569', padding: '10px' }}>{bus.routeFrom}</td>
                  <td style={{ border: '1px solid #475569', padding: '10px' }}>{bus.routeTo}</td>
                  <td style={{ border: '1px solid #475569', padding: '10px' }}>{bus.date}</td>
                  <td style={{ border: '1px solid #475569', padding: '10px' }}>{bus.contactNumber || '—'}</td>
                  <td style={{ border: '1px solid #475569', padding: '10px' }}>{bus.timing || '—'}</td>
                  <td style={{ border: '1px solid #475569', padding: '10px' }}>
                    <button onClick={() => startEdit(bus)} disabled={actionLoading} style={{ marginRight: 8, padding: '8px 18px', borderRadius: 8, border: 'none', background: '#fbbf24', color: '#222', fontWeight: 700, fontSize: 15, cursor: 'pointer', transition: 'background 0.2s' }}>Edit</button>
                    <button onClick={() => handleDeleteBus(bus._id)} disabled={actionLoading} style={{ padding: '8px 18px', borderRadius: 8, border: 'none', background: '#ef4444', color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer', transition: 'background 0.2s' }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BusAdminManager; 