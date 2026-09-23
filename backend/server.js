const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');

// Preserve test environment
const originalEnv = process.env.NODE_ENV;
dotenv.config();
if (originalEnv === 'test') {
  process.env.NODE_ENV = 'test';
}

const { connectDB, getDBStatus } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

// Socket.io Setup
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect Database
connectDB();

// Root & Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'WORKLX – Worker Hiring & Service Marketplace API',
    tagline: 'Hire Trusted Skilled Workers',
    version: '1.0.0',
    database: getDBStatus(),
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/workers', require('./routes/worker.routes'));
app.use('/api/bookings', require('./routes/booking.routes'));
app.use('/api/payments', require('./routes/payment.routes'));
app.use('/api/reviews', require('./routes/review.routes'));
app.use('/api/messages', require('./routes/message.routes'));
app.use('/api/admin', require('./routes/admin.routes'));

// Socket.io Handlers
const onlineUsers = new Map();

io.on('connection', (socket) => {
  socket.on('register_user', (userId) => {
    onlineUsers.set(userId, socket.id);
    io.emit('user_status_changed', { userId, status: 'ONLINE' });
  });

  socket.on('join_booking_room', (bookingId) => {
    socket.join(`booking_${bookingId}`);
  });

  socket.on('send_message', (data) => {
    const { receiverId, bookingId, message, senderId, senderName, senderImage } = data;
    const payload = {
      _id: `msg_${Date.now()}`,
      senderId: { _id: senderId, name: senderName, profileImage: senderImage },
      receiverId,
      bookingId,
      message,
      createdAt: new Date().toISOString(),
      read: false,
    };

    if (bookingId) {
      io.to(`booking_${bookingId}`).emit('receive_message', payload);
    }
    const receiverSocketId = onlineUsers.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('receive_message', payload);
    }
  });

  socket.on('typing', ({ bookingId, senderName, isTyping }) => {
    socket.to(`booking_${bookingId}`).emit('user_typing', { senderName, isTyping });
  });

  socket.on('update_worker_location', ({ bookingId, lat, lng }) => {
    io.to(`booking_${bookingId}`).emit('worker_location_updated', { bookingId, lat, lng });
  });

  socket.on('disconnect', () => {
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        io.emit('user_status_changed', { userId, status: 'OFFLINE' });
        break;
      }
    }
  });
});

// Serve Frontend Static Assets (Merged Single-Server Mode)
const path = require('path');
const frontendDist = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendDist));

// Catch-all route to serve React App for client-side routing
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/socket.io')) {
    return next();
  }
  res.sendFile(path.join(frontendDist, 'index.html'), (err) => {
    if (err) {
      next();
    }
  });
});

app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 WORKLX Unified Server running on http://localhost:${PORT}`);
    console.log(`⚡ Tagline: "Hire Trusted Skilled Workers"`);
    console.log(`🌐 Full-Stack App: http://localhost:${PORT}/`);
    console.log(`🔗 API & Health Check: http://localhost:${PORT}/api/health`);
    console.log(`=======================================================`);
  });
}

module.exports = { app, server, io };

