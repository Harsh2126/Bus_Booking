import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export default function NotificationBell({ userId }: { userId: string }) {
  const [socket, setSocket] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const s = io();
    setSocket(s);
    s.on('notification', (notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });
    return () => {
      s.disconnect();
    };
  }, []);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button onClick={() => setOpen((o) => !o)} style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative' }}>
        <span style={{ fontSize: 28 }}>🔔</span>
        {notifications.length > 0 && (
          <span style={{ position: 'absolute', top: 0, right: 0, background: '#ff5e62', color: '#fff', borderRadius: '50%', padding: '2px 7px', fontSize: 12, fontWeight: 700 }}>{notifications.length}</span>
        )}
      </button>
      {open && (
        <div style={{ position: 'absolute', right: 0, top: 36, background: '#fff', color: '#222', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.13)', minWidth: 220, zIndex: 10 }}>
          <div style={{ fontWeight: 700, padding: '10px 16px', borderBottom: '1px solid #eee' }}>Notifications</div>
          {notifications.length === 0 ? (
            <div style={{ padding: '12px 16px', color: '#888' }}>No notifications</div>
          ) : (
            notifications.map((n, i) => (
              <div key={i} style={{ padding: '10px 16px', borderBottom: '1px solid #f3f3f3' }}>{n.message || JSON.stringify(n)}</div>
            ))
          )}
        </div>
      )}
    </div>
  );
} 