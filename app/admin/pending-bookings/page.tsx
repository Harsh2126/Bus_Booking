"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function PendingBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/bookings/all")
      .then((res) => res.json())
      .then((data) => {
        setBookings(Array.isArray(data.bookings) ? data.bookings.filter((b: any) => b.status === "pending") : []);
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
    <div style={{ minHeight: "100vh", background: "#f8fafc", padding: "48px 0", fontFamily: "Inter, sans-serif" }}>
      {toast && <div style={{ position: "fixed", top: 32, right: 32, background: "#36b37e", color: "#fff", padding: "12px 28px", borderRadius: 12, fontWeight: 700, zIndex: 1000 }}>{toast}</div>}
      <div style={{ maxWidth: 800, margin: "0 auto", background: "#fff", borderRadius: 18, padding: "36px 32px", boxShadow: "0 2px 12px rgba(0,0,0,0.10)" }}>
        <h2 style={{ fontWeight: 800, fontSize: "2rem", marginBottom: 24, textAlign: "center", color: "#2563eb" }}>Pending Bookings</h2>
        {error && <div style={{ color: "#ff5e62", marginBottom: 16, textAlign: "center" }}>{error}</div>}
        {loading ? (
          <div style={{ textAlign: "center", margin: 32 }}>Loading...</div>
        ) : bookings.length === 0 ? (
          <div style={{ color: "#b23b3b", textAlign: "center", marginTop: 32 }}>No pending bookings.</div>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {bookings.map((b) => (
              <li key={b._id} style={{ background: "#f4f5f7", borderRadius: 14, padding: 18, marginBottom: 18 }}>
                <div><b>User:</b> {b.userId}</div>
                <div><b>Exam:</b> {b.exam}</div>
                <div><b>City:</b> {b.city}</div>
                <div><b>Date:</b> {b.date}</div>
                <div><b>Bus:</b> {b.bus} {b.busNumber ? `(${b.busNumber})` : ''}</div>
                <div><b>Route:</b> {b.routeFrom} → {b.routeTo}</div>
                <div><b>Timing:</b> {b.timing || '-'}</div>
                <div><b>Contact:</b> {b.contactNumber || '-'}</div>
                <div><b>Seats:</b> {Array.isArray(b.seatNumbers) ? b.seatNumbers.join(', ') : ''}</div>
                <div><b>Price per Seat:</b> ₹{b.price || 0}</div>
                <div><b>Total Price:</b> ₹{(b.price || 0) * (Array.isArray(b.seatNumbers) ? b.seatNumbers.length : 1)}</div>
                <div><b>UPI Txn ID:</b> {b.upiTxnId || '-'}</div>
                {b.upiScreenshot && (
                  <div style={{ margin: '10px 0' }}>
                    <b>Screenshot:</b><br />
                    <Image src={"/uploads/" + b.upiScreenshot} alt="UPI Screenshot" width={180} height={180} style={{ borderRadius: 8, marginTop: 6 }} />
                  </div>
                )}
                <div style={{ marginTop: 12, display: 'flex', gap: 12 }}>
                  <button onClick={() => handleAction(b._id, "confirmed")}
                    disabled={actionLoading === b._id + "confirmed"}
                    style={{ background: '#36b37e', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 16px', fontWeight: 600, cursor: actionLoading ? 'not-allowed' : 'pointer' }}>
                    Approve
                  </button>
                  <button onClick={() => handleAction(b._id, "rejected")}
                    disabled={actionLoading === b._id + "rejected"}
                    style={{ background: '#ff5e62', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 16px', fontWeight: 600, cursor: actionLoading ? 'not-allowed' : 'pointer' }}>
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