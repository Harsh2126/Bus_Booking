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

  return (
    <div className="space-y-8">
      <h2 className="mb-8 font-extrabold text-3xl text-gray-900 tracking-tight">Bus Management</h2>
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8 max-w-5xl mx-auto">
        {editingBusId ? (
          <form onSubmit={handleEditBus} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex flex-col">
              <label className="mb-2 font-semibold text-gray-900">Bus name</label>
              <input
                type="text"
                value={editingBus.name}
                onChange={e => setEditingBus({ ...editingBus, name: e.target.value })}
                placeholder="Bus name"
                disabled={actionLoading}
                className="p-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-2 font-semibold text-gray-900">Bus number</label>
              <input
                type="text"
                value={editingBus.number}
                onChange={e => setEditingBus({ ...editingBus, number: e.target.value })}
                placeholder="Bus number"
                disabled={actionLoading}
                className="p-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-2 font-semibold text-gray-900">Type</label>
              <select
                value={editingBus.type}
                onChange={e => setEditingBus({ ...editingBus, type: e.target.value })}
                disabled={actionLoading}
                className="p-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              >
                {BUS_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>
            <div className="flex flex-col">
              <label className="mb-2 font-semibold text-gray-900">Capacity</label>
              <input
                type="number"
                value={editingBus.capacity}
                onChange={e => setEditingBus({ ...editingBus, capacity: Number(e.target.value) })}
                placeholder="Capacity"
                min={1}
                disabled={actionLoading}
                className="p-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-2 font-semibold text-gray-900">Status</label>
              <select
                value={editingBus.status}
                onChange={e => setEditingBus({ ...editingBus, status: e.target.value })}
                disabled={actionLoading}
                className="p-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              >
                {BUS_STATUSES.map(status => <option key={status} value={status}>{status}</option>)}
              </select>
            </div>
            <div className="flex flex-col position-relative">
              <label className="mb-2 font-semibold text-gray-900">Date</label>
              <input
                type="date"
                value={editingBus.date || ''}
                onChange={e => setEditingBus({ ...editingBus, date: e.target.value })}
                required
                className="p-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
            </div>
            <div className="flex flex-col grid-col-2 position-relative">
              <label className="mb-2 font-semibold text-gray-900">Exams</label>
              <div
                className="flex items-center justify-between px-4 py-2 bg-gray-100 border border-gray-200 rounded-md cursor-pointer user-select-none position-relative"
                onClick={() => setShowExamDropdown(v => !v)}
                tabIndex={0}
              >
                {editingBus.exams.length === 0
                  ? <span className="text-gray-500">Select exams</span>
                  : exams.filter(exam => editingBus.exams.includes(exam._id)).map(exam => exam.name).join(', ')
                }
                <span className="text-gray-500 text-sm ml-2">&#9662;</span>
                {showExamDropdown && (
                  <div ref={examDropdownRef} className="absolute top-12 left-0 z-10 bg-gray-100 border border-gray-200 rounded-md shadow-lg w-full max-h-40 overflow-y-auto p-2">
                    {exams.map(exam => (
                      <label key={exam._id} className="flex items-center justify-between px-4 py-2 cursor-pointer rounded-md transition duration-200">
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
            <div className="flex flex-col">
              <label className="mb-2 font-semibold text-gray-900">Route From</label>
              <select
                value={editingBus.routeFrom || ''}
                onChange={e => setEditingBus({ ...editingBus, routeFrom: e.target.value })}
                disabled={actionLoading}
                required
                className="p-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              >
                <option value="" className="text-gray-500 bg-gray-100">Select city</option>
                {cities.map(city => (
                  <option key={city.id || city._id || city.name} value={city.name} className="text-gray-900 bg-gray-100">{city.name}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label className="mb-2 font-semibold text-gray-900">Route To</label>
              <select
                value={editingBus.routeTo || ''}
                onChange={e => setEditingBus({ ...editingBus, routeTo: e.target.value })}
                disabled={actionLoading}
                required
                className="p-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              >
                <option value="" className="text-gray-500 bg-gray-100">Select city</option>
                {cities.map(city => (
                  <option key={city.id || city._id || city.name} value={city.name} className="text-gray-900 bg-gray-100">{city.name}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <label className="font-semibold">Bus Contact Number</label>
                <input
                  type="text"
                  placeholder="Contact number"
                  value={editingBus.contactNumber}
                  onChange={e => setEditingBus({ ...editingBus, contactNumber: e.target.value })}
                  className="p-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                />
              </div>
              <div className="flex-1">
                <label className="font-semibold">Timing</label>
                <input
                  type="time"
                  placeholder="Timing"
                  value={editingBus.timing}
                  onChange={e => setEditingBus({ ...editingBus, timing: e.target.value })}
                  className="p-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                />
              </div>
            </div>
            <div>
              <label className="font-semibold">Price per Seat</label>
              <input
                type="text"
                value={editingBus.price === 0 ? '' : editingBus.price}
                onChange={e => setEditingBus({ ...editingBus, price: Number(e.target.value.replace(/[^0-9.]/g, '')) })}
                required
                placeholder="Enter price"
                className="p-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                inputMode="decimal"
                pattern="[0-9]*"
                autoComplete="off"
              />
            </div>
            {formWarning && (
              <div className="text-red-500 font-semibold mb-4 col-span-full">{formWarning}</div>
            )}
            <div className="col-span-full">
              <button
                type="submit"
                disabled={actionLoading || !editingBus.name.trim() || !editingBus.number.trim() || !editingBus.type.trim() || !editingBus.routeFrom || !editingBus.routeTo}
                className="w-full col-span-full mt-2 px-4 py-2 bg-blue-500 text-white rounded-md font-semibold text-sm"
                onMouseOver={e => (e.currentTarget.style.background = '#1741b6')}
                onMouseOut={e => (e.currentTarget.style.background = '#2563eb')}
              >
                Save Changes
              </button>
            </div>
            <div className="col-span-full">
              <button
                type="button"
                onClick={() => { setEditingBusId(null); setEditingBus(newBus); }}
                className="w-full col-span-full mt-2 px-4 py-2 bg-gray-200 text-gray-900 rounded-md font-semibold text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleAddBus} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex flex-col">
              <label className="mb-2 font-semibold text-gray-900">Bus name</label>
              <input
                type="text"
                value={newBus.name}
                onChange={e => setNewBus({ ...newBus, name: e.target.value })}
                placeholder="Bus name"
                disabled={actionLoading}
                className="p-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-2 font-semibold text-gray-900">Bus number</label>
              <input
                type="text"
                value={newBus.number}
                onChange={e => setNewBus({ ...newBus, number: e.target.value })}
                placeholder="Bus number"
                disabled={actionLoading}
                className="p-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-2 font-semibold text-gray-900">Type</label>
              <select
                value={newBus.type}
                onChange={e => setNewBus({ ...newBus, type: e.target.value })}
                disabled={actionLoading}
                className="p-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              >
                {BUS_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>
            <div className="flex flex-col">
              <label className="mb-2 font-semibold text-gray-900">Capacity</label>
              <input
                type="number"
                value={newBus.capacity}
                onChange={e => setNewBus({ ...newBus, capacity: Number(e.target.value) })}
                placeholder="Capacity"
                min={1}
                disabled={actionLoading}
                className="p-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-2 font-semibold text-gray-900">Status</label>
              <select
                value={newBus.status}
                onChange={e => setNewBus({ ...newBus, status: e.target.value })}
                disabled={actionLoading}
                className="p-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              >
                {BUS_STATUSES.map(status => <option key={status} value={status}>{status}</option>)}
              </select>
            </div>
            <div className="flex flex-col position-relative">
              <label className="mb-2 font-semibold text-gray-900">Date</label>
              <input
                type="date"
                value={newBus.date || ''}
                onChange={e => setNewBus({ ...newBus, date: e.target.value })}
                required
                className="p-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                ref={dateInputRef}
              />
              <span
                onClick={() => {
                  if (dateInputRef.current) {
                    if (dateInputRef.current.showPicker) dateInputRef.current.showPicker();
                    else dateInputRef.current.focus();
                  }
                }}
                className="absolute right-2 top-6 cursor-pointer text-blue-500 z-20"
                title="Open calendar"
                role="button"
                tabIndex={0}
              >📅</span>
            </div>
            <div className="flex flex-col grid-col-2 position-relative">
              <label className="mb-2 font-semibold text-gray-900">Exams</label>
              <div
                className="flex items-center justify-between px-4 py-2 bg-gray-100 border border-gray-200 rounded-md cursor-pointer user-select-none position-relative"
                onClick={() => setShowExamDropdown(v => !v)}
                tabIndex={0}
              >
                {newBus.exams.length === 0
                  ? <span className="text-gray-500">Select exams</span>
                  : exams.filter(exam => newBus.exams.includes(exam._id)).map(exam => exam.name).join(', ')
                }
                <span className="text-gray-500 text-sm ml-2">&#9662;</span>
                {showExamDropdown && (
                  <div ref={examDropdownRef} className="absolute top-12 left-0 z-10 bg-gray-100 border border-gray-200 rounded-md shadow-lg w-full max-h-40 overflow-y-auto p-2">
                    {exams.map(exam => (
                      <label key={exam._id} className="flex items-center justify-between px-4 py-2 cursor-pointer rounded-md transition duration-200">
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
            <div className="flex flex-col">
              <label className="mb-2 font-semibold text-gray-900">Route From</label>
              <select
                value={newBus.routeFrom || ''}
                onChange={e => setNewBus({ ...newBus, routeFrom: e.target.value })}
                disabled={actionLoading}
                required
                className="p-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              >
                <option value="" className="text-gray-500 bg-gray-100">Select city</option>
                {cities.map(city => (
                  <option key={city.id || city._id || city.name} value={city.name} className="text-gray-900 bg-gray-100">{city.name}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label className="mb-2 font-semibold text-gray-900">Route To</label>
              <select
                value={newBus.routeTo || ''}
                onChange={e => setNewBus({ ...newBus, routeTo: e.target.value })}
                disabled={actionLoading}
                required
                className="p-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              >
                <option value="" className="text-gray-500 bg-gray-100">Select city</option>
                {cities.map(city => (
                  <option key={city.id || city._id || city.name} value={city.name} className="text-gray-900 bg-gray-100">{city.name}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <label className="font-semibold">Bus Contact Number</label>
                <input
                  type="text"
                  placeholder="Contact number"
                  value={newBus.contactNumber}
                  onChange={e => setNewBus({ ...newBus, contactNumber: e.target.value })}
                  className="p-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                />
              </div>
              <div className="flex-1">
                <label className="font-semibold">Timing</label>
                <input
                  type="time"
                  placeholder="Timing"
                  value={newBus.timing}
                  onChange={e => setNewBus({ ...newBus, timing: e.target.value })}
                  className="p-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                />
              </div>
            </div>
            <div>
              <label className="font-semibold">Price per Seat</label>
              <input
                type="text"
                value={newBus.price === 0 ? '' : newBus.price}
                onChange={e => setNewBus({ ...newBus, price: Number(e.target.value.replace(/[^0-9.]/g, '')) })}
                required
                placeholder="Enter price"
                className="p-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                inputMode="decimal"
                pattern="[0-9]*"
                autoComplete="off"
              />
            </div>
            {formWarning && (
              <div className="text-red-500 font-semibold mb-4 col-span-full">{formWarning}</div>
            )}
            <div className="col-span-full">
              <button
                type="submit"
                disabled={actionLoading || !newBus.name.trim() || !newBus.number.trim() || !newBus.type.trim() || !newBus.routeFrom || !newBus.routeTo}
                className="w-full col-span-full mt-2 px-4 py-2 bg-blue-500 text-white rounded-md font-semibold text-sm"
                onMouseOver={e => (e.currentTarget.style.background = '#1741b6')}
                onMouseOut={e => (e.currentTarget.style.background = '#2563eb')}
              >
                Add Bus
              </button>
            </div>
          </form>
        )}
      </div>
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8 max-w-xl mx-auto">
        <form onSubmit={handleAddExam} className="flex gap-4 items-end">
          <div className="flex flex-col min-w-[220px]">
            <label className="mb-2 font-semibold text-gray-900">Add New Exam</label>
            <input
              type="text"
              value={newExamName}
              onChange={e => setNewExamName(e.target.value)}
              placeholder="Exam name"
              className="p-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={!newExamName.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md font-semibold text-sm"
            onMouseOver={e => (e.currentTarget.style.background = '#1741b6')}
            onMouseOut={e => (e.currentTarget.style.background = '#2563eb')}
          >
            Add Exam
          </button>
        </form>
      </div>
      {loading ? (
        <p className="text-gray-400">Loading buses...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 max-w-6xl mx-auto overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1100px]">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-200 px-4 py-3 font-semibold text-sm text-gray-900">ID</th>
                <th className="border border-gray-200 px-4 py-3 font-semibold text-sm text-gray-900">Name</th>
                <th className="border border-gray-200 px-4 py-3 font-semibold text-sm text-gray-900">Number</th>
                <th className="border border-gray-200 px-4 py-3 font-semibold text-sm text-gray-900">Type</th>
                <th className="border border-gray-200 px-4 py-3 font-semibold text-sm text-gray-900">Capacity</th>
                <th className="border border-gray-200 px-4 py-3 font-semibold text-sm text-gray-900">Status</th>
                <th className="border border-gray-200 px-4 py-3 font-semibold text-sm text-gray-900">Exams</th>
                <th className="border border-gray-200 px-4 py-3 font-semibold text-sm text-gray-900">Route From</th>
                <th className="border border-gray-200 px-4 py-3 font-semibold text-sm text-gray-900">Route To</th>
                <th className="border border-gray-200 px-4 py-3 font-semibold text-sm text-gray-900">Date</th>
                <th className="border border-gray-200 px-4 py-3 font-semibold text-sm text-gray-900">Contact</th>
                <th className="border border-gray-200 px-4 py-3 font-semibold text-sm text-gray-900">Timing</th>
                <th className="border border-gray-200 px-4 py-3 font-semibold text-sm text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-gray-50">
              {buses.map((bus, idx) => (
                <tr key={bus._id} className="border-b border-gray-200 transition duration-200">
                  <td className="px-4 py-4 text-sm text-gray-900">{bus._id}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{bus.name}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{bus.number}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{bus.type}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{bus.capacity}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{bus.status}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {Array.isArray(bus.exams) && bus.exams.length > 0
                      ? bus.exams.map(e => typeof e === 'string' ? exams.find(exam => exam._id === e)?.name || e : e.name).join(', ')
                      : '—'}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">{bus.routeFrom}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{bus.routeTo}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{bus.date}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{bus.contactNumber || '—'}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{bus.timing || '—'}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    <button onClick={() => startEdit(bus)} disabled={actionLoading} className="mr-2 px-4 py-2 bg-yellow-500 text-white rounded-md font-semibold text-sm">Edit</button>
                    <button onClick={() => handleDeleteBus(bus._id)} disabled={actionLoading} className="px-4 py-2 bg-red-500 text-white rounded-md font-semibold text-sm">Delete</button>
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