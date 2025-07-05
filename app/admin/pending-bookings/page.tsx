"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Booking {
  _id: string;
  userId: string;
  exam: string;
  city: string;
  date: string;
  bus: string;
  busNumber?: string;
  routeFrom: string;
  routeTo: string;
  timing?: string;
  contactNumber?: string;
  seatNumbers: string[];
  price: number;
  upiTxnId?: string;
  upiScreenshot?: string;
  status: string;
}

export default function PendingBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/bookings/all")
      .then((res) => res.json())
      .then((data) => {
        setBookings(Array.isArray(data.bookings) ? data.bookings.filter((b: Booking) => b.status === "pending") : []);
      })
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, []);

  const handleAction = async (id: string, status: "confirmed" | "rejected") => {
    setActionLoading(id + status);
    setError(null);
    try {
      const res = await fetch("/api/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Action failed.");
        setActionLoading(null);
        return;
      }
      setBookings((prev) => prev.filter((b) => b._id !== id));
      setToast(`Booking ${status === "confirmed" ? "approved" : "rejected"}!`);
      setTimeout(() => setToast(null), 2000);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div>
      {toast && (
        <div style={{ 
          position: "fixed", 
          top: 32, 
          right: 32, 
          background: "#10b981", 
          color: "#fff", 
          padding: "12px 28px", 
          borderRadius: 12, 
          fontWeight: 700, 
          zIndex: 1000,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}>
          {toast}
        </div>
      )}
      
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        marginBottom: '24px',
        padding: '20px',
        background: '#334155',
        borderRadius: '12px',
        border: '1px solid #475569'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '24px' }}>⏳</span>
          <h2 style={{ fontSize: '20px', fontWeight: '600', margin: 0, color: 'white' }}>
            Pending Bookings
          </h2>
        </div>
      </div>

      <div style={{ 
        background: '#334155',
        borderRadius: '16px',
        border: '1px solid #475569',
        padding: '32px'
      }}>
        {error && (
          <div style={{ 
            color: "#ef4444", 
            marginBottom: '24px', 
            textAlign: "center",
            padding: '12px',
            background: '#7f1d1d',
            borderRadius: '8px',
            border: '1px solid #dc2626'
          }}>
            {error}
          </div>
        )}
        
        {loading ? (
          <div style={{ 
            textAlign: "center", 
            margin: '32px',
            color: '#94a3b8',
            fontSize: '18px'
          }}>
            Loading...
          </div>
        ) : bookings.length === 0 ? (
          <div style={{ 
            color: "#94a3b8", 
            textAlign: "center", 
            marginTop: '32px',
            fontSize: '16px'
          }}>
            No pending bookings.
          </div>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {bookings.map((b) => (
              <li key={b._id} style={{ 
                background: "#475569", 
                borderRadius: 14, 
                padding: '24px', 
                marginBottom: '18px',
                border: '1px solid #64748b'
              }}>
                <div style={{ color: 'white', marginBottom: '8px' }}><b>User:</b> {b.userId}</div>
                <div style={{ color: 'white', marginBottom: '8px' }}><b>Exam:</b> {b.exam}</div>
                <div style={{ color: 'white', marginBottom: '8px' }}><b>City:</b> {b.city}</div>
                <div style={{ color: 'white', marginBottom: '8px' }}><b>Date:</b> {b.date}</div>
                <div style={{ color: 'white', marginBottom: '8px' }}><b>Bus:</b> {b.bus} {b.busNumber ? `(${b.busNumber})` : ''}</div>
                <div style={{ color: 'white', marginBottom: '8px' }}><b>Route:</b> {b.routeFrom} → {b.routeTo}</div>
                <div style={{ color: 'white', marginBottom: '8px' }}><b>Timing:</b> {b.timing || '-'}</div>
                <div style={{ color: 'white', marginBottom: '8px' }}><b>Contact:</b> {b.contactNumber || '-'}</div>
                <div style={{ color: 'white', marginBottom: '8px' }}><b>Seats:</b> {Array.isArray(b.seatNumbers) ? b.seatNumbers.join(', ') : ''}</div>
                <div style={{ color: 'white', marginBottom: '8px' }}><b>Price per Seat:</b> ₹{b.price || 0}</div>
                <div style={{ color: 'white', marginBottom: '8px' }}><b>Total Price:</b> ₹{(b.price || 0) * (Array.isArray(b.seatNumbers) ? b.seatNumbers.length : 1)}</div>
                <div style={{ color: 'white', marginBottom: '8px' }}><b>UPI Txn ID:</b> {b.upiTxnId || '-'}</div>
                {b.upiScreenshot && (
                  <div style={{ margin: '16px 0' }}>
                    <div style={{ color: 'white', marginBottom: '8px' }}><b>Screenshot:</b></div>
                    <Image 
                      src={"/uploads/" + b.upiScreenshot} 
                      alt="UPI Screenshot" 
                      width={180} 
                      height={180} 
                      style={{ borderRadius: 8, marginTop: 6 }} 
                    />
                  </div>
                )}
                <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
                  <button 
                    onClick={() => handleAction(b._id, "confirmed")}
                    disabled={actionLoading === b._id + "confirmed"}
                    style={{ 
                      background: '#10b981', 
                      color: '#fff', 
                      border: 'none', 
                      borderRadius: 8, 
                      padding: '8px 16px', 
                      fontWeight: 600, 
                      cursor: actionLoading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => !actionLoading && (e.currentTarget.style.background = '#059669')}
                    onMouseOut={(e) => !actionLoading && (e.currentTarget.style.background = '#10b981')}
                  >
                    Approve
                  </button>
                  <button 
                    onClick={() => handleAction(b._id, "rejected")}
                    disabled={actionLoading === b._id + "rejected"}
                    style={{ 
                      background: '#ef4444', 
                      color: '#fff', 
                      border: 'none', 
                      borderRadius: 8, 
                      padding: '8px 16px', 
                      fontWeight: 600, 
                      cursor: actionLoading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => !actionLoading && (e.currentTarget.style.background = '#dc2626')}
                    onMouseOut={(e) => !actionLoading && (e.currentTarget.style.background = '#ef4444')}
                  >
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
} 