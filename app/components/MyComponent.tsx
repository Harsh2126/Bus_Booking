import { useEffect } from 'react';
import { io } from 'socket.io-client';

export default function MyComponent() {
  useEffect(() => {
    const socket = io();

    socket.on('connect', () => {
      console.log('Connected to server');
    });

    // Listen for custom events
    socket.on('someEvent', (data) => {
      // handle data
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return <div>Real-time feature here</div>;
} 