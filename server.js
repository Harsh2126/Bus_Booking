require('dotenv').config();
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const socketio = require('socket.io');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });

  // In-memory state for real-time features
  let seatStatus = {}; // { busId: { seatId: userId } }
  let bookings = [];
  let notifications = [];

  io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });

    // Live seat selection
    socket.on('selectSeat', ({ busId, seatId, userId }) => {
      if (!seatStatus[busId]) seatStatus[busId] = {};
      seatStatus[busId][seatId] = userId;
      io.emit('seatUpdate', { busId, seatId, userId });
    });

    // Booking status
    socket.on('newBooking', (booking) => {
      bookings.push(booking);
      io.emit('bookingUpdate', booking);
    });

    // Notifications
    socket.on('notify', (notification) => {
      notifications.push(notification);
      io.emit('notification', notification);
    });

    // Chat (optional)
    socket.on('chatMessage', (msg) => {
      io.emit('chatMessage', msg);
    });
  });

  server.listen(3000, () => {
    console.log('> Ready on http://localhost:3000');
  });
}); 