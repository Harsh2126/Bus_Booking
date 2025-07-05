import { useEffect, useState } from 'react';

interface Booking { seatNumbers: string[]; userId: string; }

export default function SeatSelector({ userId, busId, capacity, onSelect }: { userId: string, busId: string, capacity: number, onSelect?: (seats: string[]) => void }) {
  const [seats, setSeats] = useState<{ [seatId: string]: string | null }>({});
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  // Fetch booked seats from backend on mount
  useEffect(() => {
    fetch(`/api/bookings?bus=${busId}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const taken: { [seatId: string]: string } = {};
          data.forEach((b: Booking) => {
            if (Array.isArray(b.seatNumbers)) {
              b.seatNumbers.forEach((sn: string) => {
                taken[sn] = b.userId;
              });
            }
          });
          setSeats(taken);
        }
      });
  }, [busId]);

  const handleSelect = (seatId: string) => {
    if (seats[seatId] && seats[seatId] !== userId) return;

    if (selectedSeats.includes(seatId)) {
      const newSeats = selectedSeats.filter(s => s !== seatId);
      setSelectedSeats(newSeats);
      if (onSelect) onSelect(newSeats);
      return;
    }

    const newSeats = [...selectedSeats, seatId];
    setSelectedSeats(newSeats);
    if (onSelect) onSelect(newSeats);
  };

  return (
    <div>
      <h4>Choose your seat(s)</h4>
      <div style={{ display: 'flex', gap: 16, marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ display: 'inline-block', width: 22, height: 22, background: '#ffb347', borderRadius: 4, border: '1.5px solid #222' }} /> <span style={{ fontSize: 13 }}>Your seats</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ display: 'inline-block', width: 22, height: 22, background: '#888', borderRadius: 4, border: '1.5px solid #222' }} /> <span style={{ fontSize: 13 }}>Taken</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ display: 'inline-block', width: 22, height: 22, background: '#fff', borderRadius: 4, border: '1.5px solid #222' }} /> <span style={{ fontSize: 13 }}>Available</span>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 40px)', gap: 8 }}>
        {Array.from({ length: capacity }).map((_, i) => {
          const seatId = (i + 1).toString();
          const takenBy = seats[seatId];
          const isMine = selectedSeats.includes(seatId);
          return (
            <button
              key={seatId}
              onClick={() => handleSelect(seatId)}
              disabled={!!takenBy && !isMine}
              style={{
                width: 38,
                height: 38,
                borderRadius: 8,
                background: isMine ? '#ffb347' : takenBy ? '#888' : '#fff',
                color: isMine ? '#fff' : '#222',
                border: '1.5px solid #222',
                cursor: !!takenBy && !isMine ? 'not-allowed' : 'pointer',
                fontWeight: 700,
                transition: 'background 0.2s',
              }}
            >
              {seatId}
            </button>
          );
        })}
      </div>
      <div style={{ marginTop: 12 }}>
        {selectedSeats.length > 0 ? `You selected seat(s): ${selectedSeats.join(', ')}` : 'No seat selected'}
      </div>
    </div>
  );
} 