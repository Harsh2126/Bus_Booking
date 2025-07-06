'use client';
import jsPDF from 'jspdf';
import {
    AlertCircle,
    ArrowRight,
    Bus,
    Calendar,
    CheckCircle,
    Clock,
    Download,
    MapPin,
    Ticket,
    Trash2,
    User,
    X,
    XCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';

const palettes = {
  blueSlate: {
    name: 'Blue & Slate',
    primary: '#2563eb',
    secondary: '#64748b',
    accent: '#fbbf24',
    bgLight: '#f8fafc',
    bgDark: '#0f172a',
    textLight: '#1e293b',
    textDark: '#f1f5f9',
    card: '#fff',
    cardDark: '#1e293b',
  },
  classicCorporate: {
    name: 'Classic Corporate',
    primary: '#0052cc',
    secondary: '#172b4d',
    accent: '#36b37e',
    bgLight: '#f4f5f7',
    bgDark: '#222b45',
    textLight: '#172b4d',
    textDark: '#f4f5f7',
    card: '#fff',
    cardDark: '#222b45',
  },
};

// Add Booking interface
interface Booking {
  _id?: string;
  exam?: string;
  city?: string;
  date?: string;
  bus?: string;
  busNumber?: string;
  routeFrom?: string;
  routeTo?: string;
  timing?: string;
  contactNumber?: string;
  seatNumbers: string[];
  price?: number;
  status?: 'pending' | 'confirmed' | 'rejected';
  userId?: string;
}

interface Bus {
  _id: string;
  name: string;
  number: string;
  routeFrom: string;
  routeTo: string;
  date: string;
  timing: string;
  price: number;
  availableSeats: number;
  totalSeats: number;
  exam?: string;
}

interface City {
  _id: string;
  name: string;
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [user, setUser] = useState<{ email: string; _id?: string; userId?: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [contactNumber, setContactNumber] = useState('');
  const router = useRouter();

  // Fetch user and data from API on mount
  useEffect(() => {
    fetch('/api/auth/me')
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          
          // Fetch bookings
          console.log('Fetching bookings for user:', data.user.userId || data.user.email);
          fetch(`/api/bookings?userId=${data.user.userId || data.user.email}`)
            .then(res => res.json())
            .then(data => {
              console.log('Bookings data received:', data);
              if (Array.isArray(data.bookings)) setBookings(data.bookings);
            });
            
          // Fetch buses
          fetch('/api/buses')
            .then(res => res.json())
            .then(data => {
              if (data.buses) setBuses(data.buses);
            });
            
          // Fetch cities
          fetch('/api/cities')
            .then(res => res.json())
            .then(data => {
              if (data.cities) setCities(data.cities);
            });
        } else {
          router.replace('/login');
        }
      });
  }, [router]);

  // Refresh bookings periodically
  useEffect(() => {
    if (!user) return;
    
    const interval = setInterval(() => {
              fetch(`/api/bookings?userId=${user.userId || user.email}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data.bookings)) setBookings(data.bookings);
        });
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, [user]);

  const handleCancel = async (id: string) => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/bookings?id=${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Cancellation failed.');
        setLoading(false);
        return;
      }
      setBookings(prev => prev.filter((b) => b._id !== id));
      setToast('Booking cancelled successfully!');
      setTimeout(() => setToast(null), 2500);
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (booking: Booking) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(37, 99, 235);
    doc.text('Bus Ticket Invoice', 10, 22);
    doc.setDrawColor(37, 99, 235);
    doc.line(10, 28, 200, 28);

    // Ticket Details (table-like)
    doc.setFontSize(12);
    doc.setTextColor(40, 40, 40);
    let y = 38;
    const details = [
      ['Bus:', `${(booking.bus || '').replace(/'/g, '')} ${(booking.busNumber ? `(${booking.busNumber.replace(/'/g, '')})` : '')}`],
      ['Route:', `${(booking.routeFrom || '').replace(/'/g, '')} ---> ${(booking.routeTo || '').replace(/'/g, '')}`],
      ['Date:', `${(booking.date || '').replace(/'/g, '')}`],
      ['Timing:', `${(booking.timing || '-').replace(/'/g, '')}`],
      ['Contact:', `${(booking.contactNumber || '-').replace(/'/g, '')}`],
      ['Seat No:', `${Array.isArray(booking.seatNumbers) ? booking.seatNumbers.map(s => s.replace(/'/g, '')).join(', ') : ''}`],
      ['Price per Seat:', `Rs. ${(booking.price || 0)}`],
      ['Total Price:', `Rs. ${(booking.price || 0) * (Array.isArray(booking.seatNumbers) ? booking.seatNumbers.length : 1)}`],
      ['Status:', (booking.status || '').replace(/'/g, '')]
    ];
    details.forEach((item) => {
      const label: string = item[0] != null ? String(item[0]) : '';
      const value: string = item[1] != null ? String(item[1]) : '';
      doc.setFont('helvetica', 'bold');
      doc.text(label as string, 15, y);
      doc.setFont('helvetica', 'normal');
      doc.text(value as string, 60, y);
      y += 9;
    });

    // Footer
    y += 8;
    doc.setDrawColor(251, 191, 36); // Yellow accent
    doc.line(10, y, 200, y);
    y += 8;
    doc.setFontSize(11);
    doc.setTextColor(120, 120, 120);
    doc.text('Thank you for booking with Smartify!', 10, y);
    doc.text('For support: support@smartify.com', 10, y + 8);

    doc.save('ticket.pdf');
    setToast('Ticket downloaded!');
    setTimeout(() => setToast(null), 2000);
  };

  const handleBookBus = async () => {
    if (!selectedBus || selectedSeats.length === 0 || !contactNumber) {
      setError('Please fill in all required fields.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const bookingData = {
        busId: selectedBus._id,
        routeFrom: selectedBus.routeFrom,
        routeTo: selectedBus.routeTo,
        date: selectedBus.date,
        timing: selectedBus.timing,
        seatNumbers: selectedSeats,
        price: selectedBus.price,
        contactNumber: contactNumber,
        exam: selectedBus.exam || '',
        userId: user?.userId || user?.email
      };

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Booking failed.');
        setLoading(false);
        return;
      }

      // Re-fetch all bookings after booking
      fetch(`/api/bookings?userId=${user?.userId || user?.email}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setBookings(data);
        });
      setToast('Booking successful!');
      setTimeout(() => setToast(null), 2500);
      
      // Reset form
      setSelectedBus(null);
      setSelectedSeats([]);
      setContactNumber('');
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleSeat = (seatNumber: string) => {
    setSelectedSeats(prev => 
      prev.includes(seatNumber) 
        ? prev.filter(seat => seat !== seatNumber)
        : [...prev, seatNumber]
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const renderBookingsTab = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center space-x-3">
          <Ticket className="h-8 w-8 text-blue-600" />
          <span>Your Bookings</span>
        </h2>
        <p className="text-gray-600">Manage and track all your bus bookings</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-2 text-gray-600">Loading...</span>
        </div>
      )}

      {bookings.length === 0 ? (
        <Card className="text-center py-12">
          <Bus className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings yet</h3>
          <p className="text-gray-600 mb-6">Start your journey by booking your first bus trip</p>
          <Button 
            onClick={() => router.push('/dashboard')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Explore Available Buses
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Card>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking, index) => (
            <Card key={booking._id || index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <Bus className="h-5 w-5 text-blue-600" />
                      <h3 className="text-lg font-semibold text-gray-900">
                        {booking.bus} {booking.busNumber && `(${booking.busNumber})`}
                      </h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">
                            <span className="font-medium">Route:</span> {booking.routeFrom} → {booking.routeTo}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">
                            <span className="font-medium">Date:</span> {booking.date}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">
                            <span className="font-medium">Time:</span> {booking.timing || '-'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">
                            <span className="font-medium">Contact:</span> {booking.contactNumber || '-'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Ticket className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">
                            <span className="font-medium">Seats:</span> {Array.isArray(booking.seatNumbers) ? booking.seatNumbers.join(', ') : ''}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-600">
                            <span className="font-medium">Total Price:</span> ₹{(booking.price || 0) * (Array.isArray(booking.seatNumbers) ? booking.seatNumbers.length : 1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right space-y-3">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(booking.status || '')}`}>
                      {getStatusIcon(booking.status || '')}
                      <span className="ml-1 capitalize">{booking.status}</span>
                    </span>
                    
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleDownload(booking)}
                        disabled={booking.status !== 'confirmed'}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-sm"
                        size="sm"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                      
                      {booking.status === 'pending' && (
                        <Button
                          onClick={() => handleCancel(booking._id || '')}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-sm"
                          size="sm"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-8 right-8 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2">
          <CheckCircle className="h-5 w-5" />
          <span className="font-medium">{toast}</span>
          <button 
            onClick={() => setToast(null)}
            className="ml-2 hover:bg-green-600 rounded-full p-1"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
      
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-xl">
          <CardContent className="p-8">
            {renderBookingsTab()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 