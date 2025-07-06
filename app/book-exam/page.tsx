'use client';
import jsPDF from 'jspdf';
import {
    AlertCircle,
    ArrowLeft,
    ArrowRight,
    Bus,
    Calendar,
    CheckCircle,
    Clock,
    FileText,
    MapPin,
    User,
    X
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';

const BUS_TYPES = ["AC", "Non-AC", "Sleeper", "Seater"];

interface Bus {
  _id?: string;
  name: string;
  number?: string;
  type?: string;
  capacity?: number;
  routeFrom?: string;
  routeTo?: string;
  date?: string;
  contactNumber?: string;
  timing?: string;
  price?: number;
  exams?: string[];
}

interface User {
  _id?: string;
  email: string;
  userId?: string;
}

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
  type?: string;
}

// SeatSelector component
function SeatSelector({
  capacity,
  bookedSeats,
  selectedSeats,
  onSelect,
  onConfirm,
  onCancel
}: {
  capacity: number;
  bookedSeats: string[];
  selectedSeats: string[];
  onSelect: (seat: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const seats = Array.from({ length: capacity }, (_, i) => (i + 1).toString());
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Select Your Seat(s)</h2>
        <div className="grid grid-cols-5 gap-2 mb-6">
          {seats.map(seat => {
            const isBooked = bookedSeats.includes(seat);
            const isSelected = selectedSeats.includes(seat);
            return (
              <button
                key={seat}
                disabled={isBooked}
                onClick={() => onSelect(seat)}
                className={`w-10 h-10 rounded-md border text-sm font-semibold
                  ${isBooked ? 'bg-gray-300 text-gray-500 cursor-not-allowed' :
                    isSelected ? 'bg-blue-600 text-white border-blue-700' :
                    'bg-white text-gray-800 border-gray-300 hover:bg-blue-100'}
                `}
                type="button"
              >
                {seat}
              </button>
            );
          })}
        </div>
        <div className="flex justify-end gap-2">
          <Button onClick={onCancel} className="bg-gray-200 text-gray-700 hover:bg-gray-300">Cancel</Button>
          <Button onClick={onConfirm} className="bg-blue-600 text-white" disabled={selectedSeats.length === 0}>Confirm</Button>
        </div>
      </div>
    </div>
  );
}

export default function BookExamPage() {
  const [exams, setExams] = useState<{ name: string; cities: string[] }[]>([]);
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedRouteFrom, setSelectedRouteFrom] = useState('');
  const [selectedRouteTo, setSelectedRouteTo] = useState('');
  const [selectedType, setSelectedType] = useState(BUS_TYPES[0]);
  const [cities, setCities] = useState<{ _id?: string; name: string }[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<Booking | null>(null);
  const [bookingStatus, setBookingStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [buses, setBuses] = useState<Bus[]>([]);
  const router = useRouter();
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [busToBook, setBusToBook] = useState<Bus | null>(null);
  const [showUPIModal, setShowUPIModal] = useState(false);
  const [upiScreenshot, setUpiScreenshot] = useState<File | null>(null);
  const [upiTxnId, setUpiTxnId] = useState('');
  const [pendingMsg, setPendingMsg] = useState('');
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [showSeatSelector, setShowSeatSelector] = useState(false);
  const [seatSelectionBus, setSeatSelectionBus] = useState<Bus | null>(null);
  const [seatSelectionDate, setSeatSelectionDate] = useState('');
  const [seatSelectionCapacity, setSeatSelectionCapacity] = useState(40);
  const [seatSelectionBookedSeats, setSeatSelectionBookedSeats] = useState<string[]>([]);
  const [seatSelectionSelectedSeats, setSeatSelectionSelectedSeats] = useState<string[]>([]);
  const [showBookingSuccess, setShowBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [upiError, setUpiError] = useState<string | null>(null);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    if (dateStr.includes('-')) return dateStr; // Already in YYYY-MM-DD
    const [day, month, year] = dateStr.split('/').map(s => s.trim());
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };
  const formattedSelectedDate = formatDate(selectedDate);

  // Razorpay script loader
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Fetch exams from API
  useEffect(() => {
    fetch('/api/exams')
      .then(res => res.json())
      .then(data => setExams(data.exams || []))
      .catch(() => setExams([]));
    fetch('/api/cities')
      .then(res => res.json())
      .then(data => setCities(Array.isArray(data) ? data : data.cities || []))
      .catch(() => setCities([]));
    fetch('/api/buses')
      .then(res => res.json())
      .then(data => setBuses(Array.isArray(data) ? data : data.buses || []))
      .catch(() => setBuses([]));
  }, []);

  useEffect(() => {
    // Fetch current user
    fetch('/api/auth/me')
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      });
  }, []);

  // Fetch all bookings for selected date, route, and exam when showing results
  useEffect(() => {
    if (showResults && selectedDate && selectedRouteFrom && selectedRouteTo && selectedType) {
      // Fetch bookings for the selected route, type, and date
      const params = new URLSearchParams({
        routeFrom: selectedRouteFrom,
        routeTo: selectedRouteTo,
        date: formattedSelectedDate,
      });
      fetch(`/api/bookings?${params.toString()}`)
        .then(res => res.json())
        .then(data => setAllBookings(Array.isArray(data.bookings) ? data.bookings : []))
        .catch(() => setAllBookings([]));
    }
  }, [showResults, selectedDate, selectedRouteFrom, selectedRouteTo, selectedType, formattedSelectedDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExam || !selectedRouteFrom || !selectedRouteTo || !selectedType || !selectedDate) {
      setError('Please fill all fields.');
      return;
    }
    setError(null);
    setShowResults(true);
    setShowConfirmation(false);
  };

  const handleBookNow = async (busName: string) => {
    setError(null);
    setLoading(true);
    if (!user) {
      setError('You must be logged in to book.');
      setLoading(false);
      return;
    }
    // Find the selected bus object
    const busObj = buses.find(b => b.name === busName && b.routeFrom === selectedRouteFrom && b.routeTo === selectedRouteTo && b.type === selectedType);
    if (!busObj) {
      setError('Bus not found.');
      setLoading(false);
      return;
    }
    // Fetch already booked seats for this bus and date
    try {
      const params = new URLSearchParams({ bus: busObj.name, date: selectedDate });
      const res = await fetch(`/api/bookings?${params.toString()}`);
      const data = await res.json();
      const bookedSeats = (data.bookings || []).flatMap((b: any) => b.seatNumbers || []);
      setSeatSelectionBus(busObj);
      setSeatSelectionDate(selectedDate);
      setSeatSelectionCapacity(busObj.capacity || 40);
      setSeatSelectionBookedSeats(bookedSeats);
      setSeatSelectionSelectedSeats([]);
      setShowSeatSelector(true);
    } catch (err) {
      setError('Failed to fetch booked seats.');
    }
    setLoading(false);
  };

  // When seat selection is confirmed
  const handleSeatSelectionConfirm = () => {
    if (!seatSelectionBus || !user) return;
    const details = {
      exam: selectedExam,
      city: selectedRouteFrom,
      routeFrom: selectedRouteFrom,
      routeTo: selectedRouteTo,
      type: selectedType,
      date: seatSelectionDate,
      bus: seatSelectionBus.name,
      busNumber: seatSelectionBus.number || '',
              userId: user._id || user.email,
      seatNumbers: seatSelectionSelectedSeats,
      contactNumber: seatSelectionBus.contactNumber || '',
      timing: seatSelectionBus.timing || '',
      price: seatSelectionBus.price || 0,
    };
    setBookingDetails(details);
    setShowConfirmation(true);
    setShowSeatSelector(false);
    setSelectedSeats(seatSelectionSelectedSeats);
  };

  // When seat is selected/deselected
  const handleSeatSelect = (seat: string) => {
    setSeatSelectionSelectedSeats(prev =>
      prev.includes(seat) ? prev.filter(s => s !== seat) : [...prev, seat]
    );
  };

  // When seat selection is cancelled
  const handleSeatSelectionCancel = () => {
    setShowSeatSelector(false);
    setSeatSelectionBus(null);
    setSeatSelectionDate('');
    setSeatSelectionCapacity(40);
    setSeatSelectionBookedSeats([]);
    setSeatSelectionSelectedSeats([]);
  };

  const handleRazorpayPayment = async () => {
    if (!bookingDetails) return;
    
    try {
      const res = await fetch('/api/payment/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: (bookingDetails.price || 0) * (bookingDetails.seatNumbers?.length || 1) * 100,
          currency: 'INR',
          bookingDetails: bookingDetails
        })
      });
      
      const data = await res.json();
      
      if (data.success) {
        const options = {
          key: data.key,
          amount: data.order.amount,
          currency: data.order.currency,
          name: 'Smartify Bus Booking',
          description: `Bus ticket for ${bookingDetails.routeFrom} to ${bookingDetails.routeTo}`,
          order_id: data.order.id,
          handler: function (response: any) {
            setBookingStatus('Payment successful! Your booking is confirmed.');
            setToast('Payment successful!');
            setTimeout(() => setToast(null), 3000);
          },
          prefill: {
            name: user?.email || '',
            email: user?.email || '',
          },
          theme: {
            color: '#2563eb'
          }
        };
        
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      }
    } catch (err) {
      setError('Payment failed. Please try again.');
    }
  };

  const handleUPIPayment = async () => {
    if (!bookingDetails) return;
    
    try {
      const formData = new FormData();
      formData.append('bookingDetails', JSON.stringify(bookingDetails));
      if (upiScreenshot) {
        formData.append('screenshot', upiScreenshot);
      }
      formData.append('txnId', upiTxnId);
      
      const res = await fetch('/api/bookings', {
        method: 'POST',
        body: formData
      });
      
      if (res.ok) {
        setBookingStatus('UPI payment submitted! Your booking is pending confirmation.');
        setShowUPIModal(false);
        setToast('UPI payment submitted successfully!');
        setTimeout(() => setToast(null), 3000);
      } else {
        setError('UPI payment failed. Please try again.');
      }
    } catch (err) {
      setError('UPI payment failed. Please try again.');
    }
  };

  const handleDownloadTicket = () => {
    if (!bookingDetails) return;
    
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(37, 99, 235);
    doc.text('Exam Bus Ticket', 10, 22);
    doc.setDrawColor(37, 99, 235);
    doc.line(10, 28, 200, 28);

    // Ticket Details
    doc.setFontSize(12);
    doc.setTextColor(40, 40, 40);
    let y = 38;
    const details = [
      ['Exam:', bookingDetails.exam || ''],
      ['Route:', `${bookingDetails.routeFrom} → ${bookingDetails.routeTo}`],
      ['Date:', bookingDetails.date || ''],
      ['Bus:', `${bookingDetails.bus} ${bookingDetails.busNumber ? `(${bookingDetails.busNumber})` : ''}`],
      ['Type:', bookingDetails.type || ''],
      ['Timing:', bookingDetails.timing || ''],
      ['Seats:', bookingDetails.seatNumbers?.join(', ') || ''],
      ['Price:', `₹${bookingDetails.price || 0}`],
      ['Total:', `₹${(bookingDetails.price || 0) * (bookingDetails.seatNumbers?.length || 1)}`]
    ];
    
    details.forEach((item) => {
      doc.setFont('helvetica', 'bold');
      doc.text(item[0], 15, y);
      doc.setFont('helvetica', 'normal');
      doc.text(item[1], 60, y);
      y += 9;
    });

    // Footer
    y += 8;
    doc.setDrawColor(251, 191, 36);
    doc.line(10, y, 200, y);
    y += 8;
    doc.setFontSize(11);
    doc.setTextColor(120, 120, 120);
    doc.text('Thank you for booking with Smartify!', 10, y);
    doc.text('For support: support@smartify.com', 10, y + 8);

    doc.save('exam-ticket.pdf');
    setToast('Ticket downloaded!');
    setTimeout(() => setToast(null), 2000);
  };

  const handleDirectBooking = async () => {
    if (!bookingDetails) return;
    setBookingError(null);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingDetails)
      });
      if (res.ok) {
        setShowBookingSuccess(true);
        setShowConfirmation(false);
        setBookingDetails(null);
        setSelectedSeats([]);
      } else {
        const data = await res.json();
        setBookingError(data.error || 'Booking failed.');
      }
    } catch (err) {
      setBookingError('Booking failed. Please try again.');
    }
  };

  // UPI payment handler
  const handleUPIPaymentSubmit = async () => {
    if (!bookingDetails) return;
    setUpiError(null);
    if (!upiTxnId) {
      setUpiError('Please enter your UPI transaction/reference ID.');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('bookingDetails', JSON.stringify({ ...bookingDetails, status: 'pending' }));
      formData.append('txnId', upiTxnId);
      if (upiScreenshot) {
        formData.append('screenshot', upiScreenshot);
      }
      const res = await fetch('/api/bookings', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        setShowBookingSuccess(true);
        setShowUPIModal(false);
        setShowConfirmation(false);
        setBookingDetails(null);
        setSelectedSeats([]);
        setUpiTxnId('');
        setUpiScreenshot(null);
      } else {
        const data = await res.json();
        setUpiError(data.error || 'Payment submission failed.');
      }
    } catch (err) {
      setUpiError('Payment submission failed. Please try again.');
    }
  };

  const renderBookingForm = () => (
    <Card className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8 md:p-10 border border-gray-100">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl md:text-3xl font-semibold text-gray-900 mb-2">
          <FileText className="h-7 w-7 text-blue-600" />
          Book Exam Bus
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">Select Exam</label>
              <select
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder-gray-400"
                required
              >
                <option value="">Choose an exam</option>
                {exams.map((exam) => (
                  <option key={exam.name} value={exam.name}>{exam.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">Bus Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder-gray-400"
                required
              >
                {BUS_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">From</label>
              <select
                value={selectedRouteFrom}
                onChange={(e) => setSelectedRouteFrom(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder-gray-400"
                required
              >
                <option value="">Select departure city</option>
                {cities.map((city) => (
                  <option key={city._id || city.name} value={city.name}>{city.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">To</label>
              <select
                value={selectedRouteTo}
                onChange={(e) => setSelectedRouteTo(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder-gray-400"
                required
              >
                <option value="">Select destination city</option>
                {cities.map((city) => (
                  <option key={city._id || city.name} value={city.name}>{city.name}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-600 mb-1 block">Date of Journey</label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                required
                min={new Date().toISOString().split('T')[0]}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder-gray-400"
              />
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </p>
            </div>
          )}

          <Button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold text-lg shadow-md flex items-center justify-center gap-2"
          >
            <Bus className="h-5 w-5" />
            Search Buses
            <ArrowRight className="h-5 w-5" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );

  const renderResults = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
          <Bus className="h-6 w-6" />
          <span>Available Buses</span>
        </h2>
        <Button
          onClick={() => setShowResults(false)}
          className="bg-gray-600 hover:bg-gray-700 text-white"
          size="sm"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Search
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {buses
          .filter(bus => 
            bus.routeFrom === selectedRouteFrom && 
            bus.routeTo === selectedRouteTo && 
            bus.type === selectedType
          )
          .map((bus, index) => (
            <Card key={bus._id || index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{bus.name}</h3>
                  <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {bus.type}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>{bus.routeFrom} → {bus.routeTo}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>{selectedDate}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>{bus.timing || 'TBD'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>Capacity: {bus.capacity || 'N/A'}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-green-600">
                    ₹{bus.price || 0}
                  </div>
                  <Button
                    onClick={() => handleBookNow(bus.name)}
                    className="bg-green-600 hover:bg-green-700 text-white"
                    size="sm"
                  >
                    Book Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      {buses.filter(bus => 
        bus.routeFrom === selectedRouteFrom && 
        bus.routeTo === selectedRouteTo && 
        bus.type === selectedType
      ).length === 0 && (
        <Card className="text-center py-12">
          <Bus className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No buses available</h3>
          <p className="text-gray-600 mb-6">No buses found for the selected criteria</p>
          <Button
            onClick={() => setShowResults(false)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Modify Search
          </Button>
        </Card>
      )}
    </div>
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="text-center py-12 max-w-md">
          <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Login Required</h3>
          <p className="text-gray-600 mb-6">Please login to book exam buses</p>
          <Button
            onClick={() => router.push('/login')}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Go to Login
          </Button>
        </Card>
      </div>
    );
  }

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

      <div className="max-w-6xl mx-auto">
        {!showResults ? renderBookingForm() : renderResults()}
      </div>

      {/* Seat Selection Modal */}
      {showSeatSelector && seatSelectionBus && (
        <SeatSelector
          capacity={seatSelectionCapacity}
          bookedSeats={seatSelectionBookedSeats}
          selectedSeats={seatSelectionSelectedSeats}
          onSelect={handleSeatSelect}
          onConfirm={handleSeatSelectionConfirm}
          onCancel={handleSeatSelectionCancel}
        />
      )}

      {/* Payment Confirmation Modal */}
      {showConfirmation && bookingDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Confirm Booking & Pay via UPI</h2>
            <div className="mb-4 space-y-1">
              <p><b>Route:</b> {bookingDetails.routeFrom} → {bookingDetails.routeTo}</p>
              <p><b>Date:</b> {bookingDetails.date}</p>
              <p><b>Bus:</b> {bookingDetails.bus}</p>
              <p><b>Seats:</b> {bookingDetails.seatNumbers.join(', ')}</p>
              <p><b>Total:</b> ₹{(bookingDetails.price || 0) * bookingDetails.seatNumbers.length}</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => { setShowUPIModal(true); setShowConfirmation(false); }} className="bg-blue-600 text-white">Pay via UPI/QR</Button>
              <Button onClick={() => setShowConfirmation(false)} className="bg-gray-200 text-gray-700 hover:bg-gray-300">Cancel</Button>
            </div>
          </div>
        </div>
      )}

      {/* UPI/QR Payment Modal */}
      {showUPIModal && bookingDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Pay via UPI/QR</h2>
            <div className="mb-4 flex flex-col items-center">
              <Image src="/upi_qr.png" alt="UPI QR Code" width={160} height={160} className="w-40 h-40 mb-2 border rounded" />
              <p className="text-gray-700 text-sm mb-2">Scan the QR code above using any UPI app to pay.</p>
              <p className="text-gray-700 text-sm mb-2">After payment, enter your UPI transaction/reference ID and (optionally) upload a screenshot.</p>
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">UPI Transaction/Reference ID</label>
              <input
                type="text"
                value={upiTxnId}
                onChange={e => setUpiTxnId(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 mb-2"
                placeholder="Enter UPI txn/reference ID"
              />
              <label className="block text-sm font-medium text-gray-700 mb-1">Upload Payment Screenshot (optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={e => setUpiScreenshot(e.target.files?.[0] || null)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            {upiError && <div className="mb-2 text-red-600 text-sm">{upiError}</div>}
            <div className="flex gap-2">
              <Button onClick={handleUPIPaymentSubmit} className="bg-blue-600 text-white">Submit Payment</Button>
              <Button onClick={() => { setShowUPIModal(false); setShowConfirmation(true); setUpiTxnId(''); setUpiScreenshot(null); setUpiError(null); }} className="bg-gray-200 text-gray-700 hover:bg-gray-300">Cancel</Button>
            </div>
          </div>
        </div>
      )}

      {/* Booking Success Modal */}
      {showBookingSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Payment Submitted!</h2>
            <p className="mb-4">Your payment details have been submitted. Your booking is pending confirmation.</p>
            <Button onClick={() => setShowBookingSuccess(false)} className="bg-blue-600 text-white">Close</Button>
          </div>
        </div>
      )}
    </div>
  );
} 