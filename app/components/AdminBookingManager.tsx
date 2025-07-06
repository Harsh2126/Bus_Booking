"use client";
import {
  Bus,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  Filter,
  MapPin,
  RefreshCw,
  Search,
  Trash2,
  User,
  XCircle
} from 'lucide-react';
import Image from 'next/image';
import { useContext, useEffect, useState } from 'react';
import { ThemeContext } from '../ThemeProvider';
import { Button } from './ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Input } from './ui/Input';

interface Booking {
  _id: string;
  userId: string;
  city: string;
  date: string;
  bus: string;
  seatNumbers: string[];
  status: string;
  exam: string;
  upiScreenshot?: string;
  upiTxnId?: string;
  price?: number;
  routeFrom?: string;
  routeTo?: string;
  timing?: string;
}

export default function AdminBookingManager() {
  const { theme } = useContext(ThemeContext);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filtered, setFiltered] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const [status, setStatus] = useState('');
  const [date, setDate] = useState('');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    let data = bookings;
    if (search) data = data.filter(b => b.userId.toLowerCase().includes(search.toLowerCase()));
    if (city) data = data.filter(b => b.city === city);
    if (status) data = data.filter(b => b.status === status);
    if (date) data = data.filter(b => b.date === date);
    setFiltered(data);
  }, [search, city, status, date, bookings]);

  const fetchBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/bookings/all');
      const data = await res.json();
      setBookings(data.bookings || []);
    } catch (err) {
      setError('Failed to fetch bookings.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) return;
    setLoading(true);
    setError('');
    try {
      await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
      setBookings(prev => prev.filter(b => b._id !== id));
    } catch (err) {
      setError('Failed to delete booking.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatus = async (id: string, newStatus: string) => {
    setLoading(true);
    setError('');
    try {
      await fetch(`/api/bookings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      setBookings(prev => prev.map(b => b._id === id ? { ...b, status: newStatus } : b));
    } catch (err) {
      setError('Failed to update status.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock },
      confirmed: { color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle },
      rejected: { color: 'bg-red-100 text-red-800 border-red-200', icon: XCircle }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const IconComponent = config.icon;
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.color}`}>
        <IconComponent className="h-4 w-4 mr-1" />
        {status}
      </span>
    );
  };

  const clearFilters = () => {
    setSearch('');
    setCity('');
    setStatus('');
    setDate('');
  };

  // Unique cities and statuses for filters
  const cities = Array.from(new Set(bookings.map(b => b.city)));
  const statuses = Array.from(new Set(bookings.map(b => b.status)));

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    rejected: bookings.filter(b => b.status === 'rejected').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Bus className="h-6 w-6 text-white" />
            </div>
            Booking Management
          </h1>
          <p className="text-gray-600 mt-1">Manage and monitor all bus bookings</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            onClick={fetchBookings}
            disabled={loading}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'cards' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Cards
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'table' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Table
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Bus className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Confirmed</p>
                <p className="text-2xl font-bold text-green-600">{stats.confirmed}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by user email"
                value={search}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              value={city}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCity(e.target.value)}
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            >
              <option value="">All Cities</option>
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            
            <select
              value={status}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatus(e.target.value)}
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            >
              <option value="">All Statuses</option>
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            
            <Input
              type="date"
              value={date}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDate(e.target.value)}
            />
            
            <Button
              onClick={clearFilters}
              variant="outline"
              className="flex items-center gap-2"
            >
              <XCircle className="h-4 w-4" />
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-2">
            <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
            <span className="text-gray-600">Loading bookings...</span>
          </div>
        </div>
      )}

      {/* Content */}
      {!loading && (
        <>
          {filtered.length === 0 ? (
            <Card className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bus className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your filters or search criteria</p>
              <Button onClick={clearFilters} variant="outline">
                Clear Filters
              </Button>
            </Card>
          ) : viewMode === 'cards' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map((booking) => (
                <Card key={booking._id} className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <User className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 truncate">{booking.userId}</p>
                          <p className="text-sm text-gray-500">{booking.exam}</p>
                        </div>
                      </div>
                      {getStatusBadge(booking.status)}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">{booking.city}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">{booking.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Bus className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">{booking.bus}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">₹{booking.price || 0}</span>
                      </div>
                    </div>
                    
                    <div className="border-t pt-3">
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Seats:</span> {Array.isArray(booking.seatNumbers) ? booking.seatNumbers.join(', ') : booking.seatNumbers || '-'}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Total:</span> ₹{(booking.price || 0) * (Array.isArray(booking.seatNumbers) ? booking.seatNumbers.length : 1)}
                      </p>
                    </div>
                    
                    {booking.upiScreenshot && booking.upiScreenshot.startsWith('/uploads/') && (
                      <div className="border-t pt-3">
                        <p className="text-sm font-medium text-gray-700 mb-2">Payment Screenshot:</p>
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden border">
                          <Image 
                            src={booking.upiScreenshot} 
                            alt="Payment Screenshot" 
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                    )}
                    
                    {booking.upiTxnId && (
                      <div className="border-t pt-3">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">UPI Txn ID:</span> {booking.upiTxnId}
                        </p>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 pt-3 border-t">
                      <select
                        value={booking.status}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleStatus(booking._id, e.target.value)}
                        className="flex-1 h-8 rounded border border-gray-300 bg-white px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="rejected">Rejected</option>
                      </select>
                      
                      <Button
                        onClick={() => handleDelete(booking._id)}
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-semibold text-gray-900">User</th>
                      <th className="text-left p-4 font-semibold text-gray-900">Exam</th>
                      <th className="text-left p-4 font-semibold text-gray-900">City</th>
                      <th className="text-left p-4 font-semibold text-gray-900">Date</th>
                      <th className="text-left p-4 font-semibold text-gray-900">Bus</th>
                      <th className="text-left p-4 font-semibold text-gray-900">Seats</th>
                      <th className="text-left p-4 font-semibold text-gray-900">Total Price</th>
                      <th className="text-left p-4 font-semibold text-gray-900">Status</th>
                      <th className="text-left p-4 font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((booking, idx) => (
                      <tr key={booking._id} className={`border-b ${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                        <td className="p-4">
                          <div>
                            <p className="font-medium text-gray-900">{booking.userId}</p>
                            <p className="text-sm text-gray-500">{booking.exam}</p>
                          </div>
                        </td>
                        <td className="p-4 text-gray-600">{booking.exam}</td>
                        <td className="p-4 text-gray-600">{booking.city}</td>
                        <td className="p-4 text-gray-600">{booking.date}</td>
                        <td className="p-4 text-gray-600">{booking.bus}</td>
                        <td className="p-4 text-gray-600">
                          {Array.isArray(booking.seatNumbers) ? booking.seatNumbers.join(', ') : booking.seatNumbers || '-'}
                        </td>
                        <td className="p-4 font-medium text-gray-900">
                          ₹{(booking.price || 0) * (Array.isArray(booking.seatNumbers) ? booking.seatNumbers.length : 1)}
                        </td>
                        <td className="p-4">{getStatusBadge(booking.status)}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <select
                              value={booking.status}
                              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleStatus(booking._id, e.target.value)}
                              className="h-8 rounded border border-gray-300 bg-white px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="rejected">Rejected</option>
                            </select>
                            
                            <Button
                              onClick={() => handleDelete(booking._id)}
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
} 