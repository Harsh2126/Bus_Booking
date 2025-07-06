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
    <div className="space-y-8">
      {toast && (
        <div className="fixed top-8 right-8 bg-green-500 text-white px-6 py-3 rounded-xl font-bold z-50 shadow-lg">
          {toast}
        </div>
      )}
      <div className="flex items-center gap-4 mb-6 p-8 bg-gradient-to-r from-yellow-500 to-pink-500 text-white rounded-2xl shadow-lg">
        <span className="text-3xl">⏳</span>
        <h2 className="text-2xl font-bold">Pending Bookings</h2>
      </div>
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
        {error && (
          <div className="text-red-500 mb-6 text-center py-2 bg-red-50 rounded-lg border border-red-200">
            {error}
          </div>
        )}
        {loading ? (
          <div className="text-gray-400 text-center py-8">Loading...</div>
        ) : bookings.length === 0 ? (
          <div className="text-gray-400 text-center py-8">No pending bookings.</div>
        ) : (
          <ul className="space-y-6">
            {bookings.map((b) => (
              <li key={b._id} className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-gray-900 font-semibold mb-1"><b>User:</b> {b.userId}</div>
                    <div className="text-gray-700 mb-1"><b>Exam:</b> {b.exam}</div>
                    <div className="text-gray-700 mb-1"><b>City:</b> {b.city}</div>
                    <div className="text-gray-700 mb-1"><b>Date:</b> {b.date}</div>
                    <div className="text-gray-700 mb-1"><b>Bus:</b> {b.bus} {b.busNumber ? `(${b.busNumber})` : ''}</div>
                    <div className="text-gray-700 mb-1"><b>Route:</b> {b.routeFrom} → {b.routeTo}</div>
                    <div className="text-gray-700 mb-1"><b>Timing:</b> {b.timing || '-'}</div>
                    <div className="text-gray-700 mb-1"><b>Contact:</b> {b.contactNumber || '-'}</div>
                    <div className="text-gray-700 mb-1"><b>Seats:</b> {Array.isArray(b.seatNumbers) ? b.seatNumbers.join(', ') : ''}</div>
                    <div className="text-gray-700 mb-1"><b>Price per Seat:</b> ₹{b.price || 0}</div>
                    <div className="text-gray-700 mb-1"><b>Total Price:</b> ₹{(b.price || 0) * (Array.isArray(b.seatNumbers) ? b.seatNumbers.length : 1)}</div>
                    <div className="text-gray-700 mb-1"><b>UPI Txn ID:</b> {b.upiTxnId || '-'}</div>
                  </div>
                  {b.upiScreenshot && (
                    <div className="flex flex-col items-center justify-center">
                      <div className="text-gray-700 mb-2 font-semibold">Screenshot:</div>
                      <Image 
                        src={"/uploads/" + b.upiScreenshot} 
                        alt="UPI Screenshot" 
                        width={180} 
                        height={180} 
                        className="rounded-lg mt-2 border border-gray-200"
                      />
                    </div>
                  )}
                </div>
                <div className="mt-4 flex gap-3">
                  <button 
                    onClick={() => handleAction(b._id, "confirmed")}
                    disabled={actionLoading === b._id + "confirmed"}
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg px-4 py-2 transition disabled:opacity-60"
                  >
                    Approve
                  </button>
                  <button 
                    onClick={() => handleAction(b._id, "rejected")}
                    disabled={actionLoading === b._id + "rejected"}
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg px-4 py-2 transition disabled:opacity-60"
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