'use client';
import jsPDF from 'jspdf';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react';
import SeatSelector from '../components/SeatSelector';
import Spinner from '../components/Spinner';
import { ThemeContext } from '../ThemeProvider';

const palettes = {
  blueSlate: {
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
  const [user, setUser] = useState<{ email: string; userId?: string } | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const { theme } = useContext(ThemeContext);
  const palette = theme === 'light' ? palettes.classicCorporate : palettes.blueSlate;
  const [buses, setBuses] = useState<Bus[]>([]);
  const router = useRouter();
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [busToBook, setBusToBook] = useState<Bus | null>(null);
  const [showUPIModal, setShowUPIModal] = useState(false);
  const [upiScreenshot, setUpiScreenshot] = useState<File | null>(null);
  const [upiTxnId, setUpiTxnId] = useState('');
  const [pendingMsg, setPendingMsg] = useState('');
  const [allBookings, setAllBookings] = useState<Booking[]>([]);

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
  }, [showResults, selectedDate, selectedRouteFrom, selectedRouteTo, selectedType]);

  // Helper to format date to YYYY-MM-DD
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    if (dateStr.includes('-')) return dateStr; // Already in YYYY-MM-DD
    const [day, month, year] = dateStr.split('/').map(s => s.trim());
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };
  const formattedSelectedDate = formatDate(selectedDate);

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
    const details = {
      exam: selectedExam,
      city: selectedRouteFrom,
      routeFrom: selectedRouteFrom,
      routeTo: selectedRouteTo,
      type: selectedType,
      date: selectedDate,
      bus: busObj?.name || busName,
      busNumber: busObj?.number || '',
      userId: user.userId,
      seatNumbers: selectedSeats,
      contactNumber: busObj?.contactNumber || '',
      timing: busObj?.timing || '',
      price: busObj?.price || 0,
    };
    setBookingDetails(details);
    setShowConfirmation(true);
    setShowResults(false);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(details),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Booking failed.');
        setLoading(false);
        return;
      }
      const booking = await res.json();
      setBookingStatus('Booking confirmed!');
      setToast('Booking successful!');
      setTimeout(() => setToast(null), 1200);
      setTimeout(() => {
        router.push('/bookings');
        setBusToBook(null);
        setSelectedSeats([]);
      }, 1500);
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Razorpay payment handler
  const handleRazorpayPayment = async () => {
    setError(null);
    setLoading(true);
    if (!user) {
      setError('You must be logged in to book.');
      setLoading(false);
      return;
    }
    const busObj = buses.find(b => b._id === busToBook?._id);
    const amount = busObj?.price ? busObj.price * 100 : 50000; // Convert price to paise
    try {
      // 1. Create order on backend
      const orderRes = await fetch('/api/payment/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, currency: 'INR' }),
      });
      const orderData = await orderRes.json();
      if (!orderData.orderId) {
        setError('Payment order creation failed.');
        setLoading(false);
        return;
      }
      // 2. Open Razorpay modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Bus Booking',
        description: 'Bus ticket booking payment',
        order_id: orderData.orderId,
        handler: function (response: any) {
          handleBookNow(busToBook ? busToBook.name : '');
        },
        prefill: {
          email: user?.email,
        },
        theme: {
          color: '#3399cc'
        }
      };
      // @ts-expect-error
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError('Payment failed.');
    } finally {
      setLoading(false);
    }
  };

  // UPI payment handler
  const handleUPIPayment = async () => {
    setError(null);
    setLoading(true);
    if (!user) {
      setError('You must be logged in to book.');
      setLoading(false);
      return;
    }
    if (!upiScreenshot && !upiTxnId) {
      setError('Please upload a screenshot or enter transaction ID.');
      setLoading(false);
      return;
    }
    const busObj = buses.find(b => b._id === busToBook?._id);
    // Upload screenshot if present
    let screenshotUrl = '';
    if (upiScreenshot) {
      try {
        const formData = new FormData();
        formData.append('file', upiScreenshot);
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          console.log('Upload API response:', uploadData); // Debug log
          screenshotUrl = uploadData.url || '';
        } else {
          screenshotUrl = upiScreenshot.name;
        }
      } catch (err) {
        screenshotUrl = upiScreenshot.name;
      }
    }
    const details = {
      exam: selectedExam,
      city: selectedRouteFrom,
      routeFrom: selectedRouteFrom,
      routeTo: selectedRouteTo,
      type: selectedType,
      date: selectedDate,
      bus: busObj?.name || '',
      busNumber: busObj?.number || '',
      userId: user.userId,
      seatNumbers: selectedSeats,
      contactNumber: busObj?.contactNumber || '',
      timing: busObj?.timing || '',
      upiTxnId,
      upiScreenshot: screenshotUrl,
      status: 'pending',
    };
    console.log('Booking details to send:', details); // Debug log
    setBookingDetails({ ...details, status: 'pending' as Booking['status'] });
    setShowConfirmation(false);
    setShowUPIModal(false);
    setShowResults(false);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(details),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Booking failed.');
        setLoading(false);
        return;
      }
      setPendingMsg('Your booking is pending. We will confirm after verifying your payment.');
      setToast('Booking submitted for verification!');
      setTimeout(() => setToast(null), 1200);
      setTimeout(() => {
        router.push('/bookings');
        setBusToBook(null);
        setSelectedSeats([]);
      }, 2000);
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTicket = () => {
    if (!bookingDetails) return;
    const doc = new jsPDF();
    // Header
    doc.setFillColor(37, 99, 235); // Blue
    doc.rect(0, 0, 210, 30, 'F');
    doc.setFontSize(20);
    doc.setTextColor(255, 255, 255);
    doc.text('🚌 Bus Ticket Invoice', 10, 20);

    // Section: Booking Details
    doc.setFontSize(13);
    doc.setTextColor(40, 40, 40);
    doc.text('Booking Details', 10, 38);
    doc.setDrawColor(37, 99, 235);
    doc.line(10, 40, 200, 40);

    let y = 48;
    doc.setFontSize(11);
    doc.text(`Exam:`, 10, y); doc.text(`${bookingDetails.exam || ''}`, 50, y);
    y += 8;
    doc.text(`Date:`, 10, y); doc.text(`${bookingDetails.date || ''}`, 50, y);
    y += 8;
    doc.text(`Bus:`, 10, y); doc.text(`${bookingDetails.bus || ''} (${bookingDetails.busNumber || ''})`, 50, y);
    y += 8;
    doc.text(`Route:`, 10, y); doc.text(`${bookingDetails.routeFrom || ''} → ${bookingDetails.routeTo || ''}`, 50, y);
    y += 8;
    doc.text(`Timing:`, 10, y); doc.text(`${bookingDetails.timing || ''}`, 50, y);
    y += 8;
    doc.text(`Contact:`, 10, y); doc.text(`${bookingDetails.contactNumber || ''}`, 50, y);
    y += 8;
    doc.text(`Seats:`, 10, y); doc.text(`${Array.isArray(bookingDetails.seatNumbers) ? bookingDetails.seatNumbers.join(', ') : ''}`, 50, y);
    y += 12;

    // Price Section
    doc.setFontSize(13);
    doc.setTextColor(37, 99, 235);
    doc.text('Payment Summary', 10, y);
    doc.setDrawColor(251, 191, 36); // Yellow accent
    doc.line(10, y + 2, 200, y + 2);
    y += 10;
    doc.setFontSize(12);
    doc.setTextColor(40, 40, 40);
    doc.text(`Price per Seat:`, 10, y); doc.text(`₹${bookingDetails.price || 0}`, 50, y);
    y += 8;
    doc.setFontSize(14);
    doc.setTextColor(200, 40, 40);
    doc.text(`Total:`, 10, y); doc.text(`₹${(bookingDetails.price || 0) * (Array.isArray(bookingDetails.seatNumbers) ? bookingDetails.seatNumbers.length : 1)}`, 50, y);
    y += 16;

    // Footer
    doc.setFontSize(12);
    doc.setTextColor(37, 99, 235);
    doc.text('Thank you for booking with BusBooking!', 10, y);
    doc.setTextColor(120, 120, 120);
    doc.text('For support: support@busbooking.com', 10, y + 8);

    doc.save('ticket.pdf');
  };

  const selectedBusObj = buses.find(
    b => b.routeFrom === selectedRouteFrom && b.routeTo === selectedRouteTo && b.type === selectedType && b.date === formattedSelectedDate
  );

  return (
    <div style={{ minHeight: '100vh', background: theme === 'light' ? palette.bgLight : palette.bgDark, fontFamily: 'Inter, sans-serif', color: theme === 'light' ? palette.textLight : palette.textDark, padding: '48px 0' }}>
      <div style={{ maxWidth: 420, margin: '0 auto', background: theme === 'light' ? palette.card : palette.cardDark, borderRadius: 18, padding: '36px 32px', boxShadow: '0 2px 12px rgba(0,0,0,0.10)' }}>
        <h2 style={{ fontWeight: 800, fontSize: '2rem', marginBottom: 24, textAlign: 'center', color: palette.primary }}>Book for Exam</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div>
            <label style={{ fontWeight: 600, marginBottom: 6, display: 'block', color: palette.primary }}>Select Exam</label>
            <select value={selectedExam} onChange={e => setSelectedExam(e.target.value)} required style={{ width: '100%', padding: 10, borderRadius: 8, border: `1.5px solid ${palette.primary}`, background: theme === 'light' ? '#e0f0ff' : palette.cardDark, color: palette.primary, fontWeight: 600 }}>
              <option value="" disabled>Select an exam</option>
              {exams.map(exam => (
                <option key={exam.name} value={exam.name}>{exam.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ fontWeight: 600, marginBottom: 6, display: 'block', color: palette.primary }}>Route From</label>
            <select value={selectedRouteFrom} onChange={e => setSelectedRouteFrom(e.target.value)} required style={{ width: '100%', padding: 10, borderRadius: 8, border: `1.5px solid ${palette.primary}`, background: theme === 'light' ? '#e0f0ff' : palette.cardDark, color: palette.primary, fontWeight: 600 }}>
              <option value="" disabled>Select starting city</option>
              {cities.map(city => (
                <option key={city._id || city.name} value={city.name}>{city.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ fontWeight: 600, marginBottom: 6, display: 'block', color: palette.primary }}>Route To</label>
            <select value={selectedRouteTo} onChange={e => setSelectedRouteTo(e.target.value)} required style={{ width: '100%', padding: 10, borderRadius: 8, border: `1.5px solid ${palette.primary}`, background: theme === 'light' ? '#e0f0ff' : palette.cardDark, color: palette.primary, fontWeight: 600 }}>
              <option value="" disabled>Select destination city</option>
              {cities.map(city => (
                <option key={city._id || city.name} value={city.name}>{city.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ fontWeight: 600, marginBottom: 6, display: 'block', color: palette.primary }}>Type of Bus</label>
            <select value={selectedType} onChange={e => setSelectedType(e.target.value)} required style={{ width: '100%', padding: 10, borderRadius: 8, border: `1.5px solid ${palette.primary}`, background: theme === 'light' ? '#e0f0ff' : palette.cardDark, color: palette.primary, fontWeight: 600 }}>
              {BUS_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ fontWeight: 600, marginBottom: 6, display: 'block', color: palette.primary }}>Select Date</label>
            <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} required style={{ width: '100%', padding: 10, borderRadius: 8, border: `1.5px solid ${palette.primary}`, background: theme === 'light' ? palette.card : palette.cardDark, color: theme === 'light' ? palette.textLight : palette.textDark, fontWeight: 600 }} />
          </div>
          <button type="submit" disabled={loading} style={{ padding: '14px 0', borderRadius: '24px', background: `linear-gradient(90deg, ${palette.accent} 0%, ${palette.primary} 100%)`, color: '#fff', fontWeight: 700, fontSize: '1.08rem', border: 'none', boxShadow: '0 2px 12px rgba(0,0,0,0.10)', cursor: loading ? 'not-allowed' : 'pointer', marginTop: 8 }}>{loading ? <Spinner size={22} label="Booking..." /> : 'Search Buses'}</button>
        </form>
        {error && <div style={{ color: '#ff5e62', marginTop: 12, textAlign: 'center' }}>{error}</div>}
        {showResults && (
          <div style={{ marginTop: 32 }}>
            <h3 style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: 16, color: palette.primary }}>Available Buses</h3>
            {(() => {
              // Debug logs
              console.log('Buses:', buses);
              console.log('Selected:', selectedExam, selectedRouteFrom, selectedRouteTo, selectedType, formattedSelectedDate);
              // Filter buses by exam, route, type, date (case-insensitive, formatted date)
              const filteredBuses = buses.filter(bus =>
                bus.exams &&
                bus.exams
                  .filter((e: any) => typeof e === 'string')
                  .map((e: string) => e.toLowerCase())
                  .includes(selectedExam.toLowerCase()) &&
                (bus.routeFrom || '').toLowerCase() === selectedRouteFrom.toLowerCase() &&
                (bus.routeTo || '').toLowerCase() === selectedRouteTo.toLowerCase() &&
                (bus.type || '').toLowerCase() === selectedType.toLowerCase() &&
                bus.date === formattedSelectedDate
              );
              // For each bus, count booked seats
              const availableBuses: any[] = [];
              const fullyBookedBuses: any[] = [];
              filteredBuses.forEach(bus => {
                const bookingsForBus = allBookings.filter(b =>
                  b.bus === bus.name &&
                  b.routeFrom === bus.routeFrom &&
                  b.routeTo === bus.routeTo &&
                  b.date === bus.date
                );
                const bookedSeats = bookingsForBus.reduce((acc, b) => acc + (Array.isArray(b.seatNumbers) ? b.seatNumbers.length : 0), 0);
                if (bookedSeats >= (bus.capacity || 0)) {
                  fullyBookedBuses.push(bus);
                } else {
                  availableBuses.push(bus);
                }
              });
              return <>
                {availableBuses.length === 0 ? (
                  <div style={{ color: palette.secondary, fontSize: 16 }}>No buses found for the selected exam, route, and date.</div>
                ) : (
                  availableBuses.map(bus => (
                    <div key={bus._id} style={{ background: theme === 'light' ? palette.bgLight : 'rgba(255,255,255,0.10)', borderRadius: 14, padding: 18, marginBottom: 12 }}>
                      <div style={{ fontWeight: 600, color: palette.primary }}>{bus.name}</div>
                      <div style={{ fontSize: 15, color: theme === 'light' ? palette.secondary : palette.textDark }}>{bus.routeFrom || ''} → {bus.routeTo || ''}</div>
                      <div style={{ fontSize: 14, color: theme === 'light' ? palette.secondary : palette.textDark }}>Type: {bus.type || ''}</div>
                      <div style={{ fontSize: 14, color: theme === 'light' ? palette.secondary : palette.textDark }}>Date: {selectedDate}</div>
                      <div style={{ fontSize: 14, color: theme === 'light' ? palette.secondary : palette.textDark }}><b>Price per Seat:</b> ₹{bus.price || 0}</div>
                      <button onClick={() => setBusToBook(bus)} disabled={loading} style={{ display: 'inline-block', marginTop: 10, padding: '8px 24px', borderRadius: '18px', background: `linear-gradient(90deg, ${palette.accent} 0%, ${palette.primary} 100%)`, color: '#fff', fontWeight: 600, border: 'none', cursor: loading ? 'not-allowed' : 'pointer' }}>Book Now</button>
                    </div>
                  ))
                )}
                {fullyBookedBuses.length > 0 && <>
                  <h3 style={{ fontWeight: 700, fontSize: '1.1rem', margin: '32px 0 12px 0', color: '#b23b3b' }}>Fully Booked Buses</h3>
                  {fullyBookedBuses.map(bus => (
                    <div key={bus._id} style={{ background: '#f8d7da', borderRadius: 14, padding: 18, marginBottom: 12, color: '#721c24' }}>
                      <div style={{ fontWeight: 600 }}>{bus.name}</div>
                      <div>{bus.routeFrom || ''} → {bus.routeTo || ''}</div>
                      <div>Type: {bus.type || ''}</div>
                      <div>Date: {selectedDate}</div>
                      <div><b>Price per Seat:</b> ₹{bus.price}</div>
                      <div style={{ fontWeight: 700, color: '#b23b3b', marginTop: 6 }}>Fully Booked</div>
                    </div>
                  ))}
                </>}
              </>;
            })()}
          </div>
        )}
        {showConfirmation && bookingDetails && (
          <div style={{ marginTop: 32, background: theme === 'light' ? palette.bgLight : 'rgba(255,255,255,0.13)', borderRadius: 16, padding: 24, textAlign: 'center', color: theme === 'light' ? palette.textLight : palette.textDark }}>
            <h3 style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: 16, color: palette.primary }}>Booking Confirmed!</h3>
            <div style={{ marginBottom: 12 }}>
              <div><b>Exam:</b> {bookingDetails.exam}</div>
              <div><b>Route:</b> {bookingDetails.routeFrom} → {bookingDetails.routeTo}</div>
              <div><b>Type:</b> {bookingDetails.type || ''}</div>
              <div><b>Date:</b> {bookingDetails.date}</div>
              <div><b>Bus:</b> {bookingDetails.bus}</div>
              <div><b>Seats:</b> {Array.isArray(bookingDetails.seatNumbers) ? bookingDetails.seatNumbers.join(', ') : ''}</div>
              <div><b>Price per Seat:</b> ₹{bookingDetails.price || 0}</div>
              <div style={{ fontWeight: 700, color: palette.primary, fontSize: 18, marginTop: 8 }}><b>Total Payment:</b> ₹{(bookingDetails.price || 0) * (Array.isArray(bookingDetails.seatNumbers) ? bookingDetails.seatNumbers.length : 1)}</div>
            </div>
            <button onClick={handleDownloadTicket} style={{ padding: '10px 28px', borderRadius: '18px', background: `linear-gradient(90deg, ${palette.accent} 0%, ${palette.primary} 100%)`, color: '#fff', fontWeight: 600, border: 'none', cursor: 'pointer', marginTop: 10 }}>Download Ticket</button>
            {bookingStatus && <div style={{ marginTop: 16, color: '#0f0', fontWeight: 600 }}>{bookingStatus}</div>}
          </div>
        )}
        {busToBook && (
          <div style={{ marginTop: 24 }}>
            <SeatSelector userId={user?.email || ''} busId={busToBook._id || ''} capacity={busToBook.capacity || 0} onSelect={setSelectedSeats} />
            <button
              onClick={() => selectedSeats.length > 0 && setShowUPIModal(true)}
              disabled={selectedSeats.length === 0 || loading}
              style={{ marginTop: 16, padding: '10px 28px', borderRadius: '18px', background: `linear-gradient(90deg, ${palette.accent} 0%, ${palette.primary} 100%)`, color: '#fff', fontWeight: 600, border: 'none', cursor: selectedSeats.length === 0 || loading ? 'not-allowed' : 'pointer' }}
            >
              Pay via UPI
            </button>
          </div>
        )}
        {showUPIModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: '#fff', borderRadius: 18, padding: 32, maxWidth: 400, width: '100%', boxShadow: '0 2px 16px rgba(0,0,0,0.18)', textAlign: 'center', position: 'relative' }}>
              <button onClick={() => setShowUPIModal(false)} style={{ position: 'absolute', top: 12, right: 18, background: 'none', border: 'none', fontSize: 22, cursor: 'pointer' }}>×</button>
              <h3 style={{ fontWeight: 700, fontSize: '1.3rem', marginBottom: 12, color: '#2563eb' }}>Pay via UPI</h3>
              <Image src="/upi_qr.png" alt="UPI QR" width={200} height={200} style={{ margin: '0 auto', borderRadius: 12 }} />
              <div style={{ margin: '12px 0', fontWeight: 600, color: '#333' }}>UPI ID: gamingbeast2026-1@okhdfcbank</div>
              <div style={{ fontSize: 14, color: '#888', marginBottom: 10 }}>Scan the QR code or pay to the UPI ID above using any UPI app.</div>
              <div style={{ margin: '18px 0 8px 0', fontWeight: 600 }}>Upload Payment Screenshot</div>
              <input type="file" accept="image/*" onChange={e => setUpiScreenshot(e.target.files?.[0] || null)} style={{ marginBottom: 10 }} />
              <div style={{ margin: '12px 0 8px 0', fontWeight: 600 }}>Or Enter UPI Transaction ID</div>
              <input type="text" value={upiTxnId} onChange={e => setUpiTxnId(e.target.value)} placeholder="Transaction ID" style={{ width: '100%', padding: 8, borderRadius: 8, border: '1.5px solid #2563eb', marginBottom: 16 }} />
              <div style={{ margin: '16px 0', fontWeight: 700, color: '#2563eb', fontSize: 18 }}>
                Total Payment: ₹{busToBook && selectedSeats.length > 0 ? ((busToBook.price || 0) * selectedSeats.length) : 0}
              </div>
              <button onClick={handleUPIPayment} disabled={loading} style={{ width: '100%', padding: '12px 0', borderRadius: 12, background: `linear-gradient(90deg, #36b37e 0%, #2563eb 100%)`, color: '#fff', fontWeight: 700, fontSize: '1.08rem', border: 'none', boxShadow: '0 2px 12px rgba(0,0,0,0.10)', cursor: loading ? 'not-allowed' : 'pointer', marginTop: 8 }}>Submit Payment</button>
            </div>
          </div>
        )}
        {pendingMsg && (
          <div style={{ marginTop: 32, background: '#fffbe6', borderRadius: 16, padding: 24, textAlign: 'center', color: '#b26a00', fontWeight: 600 }}>{pendingMsg}</div>
        )}
        {toast && <div style={{ position: 'fixed', top: 32, right: 32, background: palette.accent, color: '#222', padding: '12px 28px', borderRadius: 12, fontWeight: 700, zIndex: 1000 }}>{toast}</div>}
      </div>
    </div>
  );
} 