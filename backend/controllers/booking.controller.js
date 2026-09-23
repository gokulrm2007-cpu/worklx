const { getDBStatus } = require('../config/db');
const Booking = require('../models/Booking');
const User = require('../models/User');
const { mockStore } = require('../config/seed');

// @desc    Create new booking
// @route   POST /api/bookings
exports.createBooking = async (req, res) => {
  try {
    const { workerId, service, date, time, address, description, serviceImage, amount } = req.body;

    if (!workerId || !service || !date || !time || !address) {
      return res.status(400).json({ success: false, message: 'Please provide all booking details' });
    }

    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      const booking = await Booking.create({
        seekerId: req.user._id,
        workerId,
        service,
        date,
        time,
        address,
        description: description || '',
        serviceImage: serviceImage || '',
        amount: Number(amount) || 500,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        trackingStatus: 'BOOKING_CREATED',
      });

      const populated = await Booking.findById(booking._id)
        .populate('seekerId', 'name email phone profileImage')
        .populate('workerId', 'name email phone profileImage location');

      return res.status(201).json({ success: true, booking: populated });
    } else {
      const newBooking = {
        _id: `booking_${Date.now()}`,
        seekerId: req.user._id,
        workerId,
        service,
        date,
        time,
        address,
        description: description || '',
        serviceImage: serviceImage || '',
        amount: Number(amount) || 500,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        trackingStatus: 'BOOKING_CREATED',
        workerLocation: { lat: 11.6643, lng: 78.1460 },
        createdAt: new Date(),
      };

      mockStore.bookings.unshift(newBooking);

      const seeker = mockStore.users.find((u) => u._id === req.user._id);
      const worker = mockStore.users.find((u) => u._id === workerId);

      const populatedMock = {
        ...newBooking,
        seekerId: seeker || { name: 'Seeker', email: '', phone: '' },
        workerId: worker || { name: 'Worker', email: '', phone: '', location: 'Salem' },
      };

      return res.status(201).json({ success: true, booking: populatedMock });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get bookings for logged-in user (Seeker or Worker)
// @route   GET /api/bookings
exports.getBookings = async (req, res) => {
  try {
    const dbStatus = getDBStatus();
    const query = {};

    if (req.user.role === 'SEEKER') {
      query.seekerId = req.user._id;
    } else if (req.user.role === 'WORKER') {
      query.workerId = req.user._id;
    }

    if (dbStatus.connected) {
      const bookings = await Booking.find(query)
        .populate('seekerId', 'name email phone profileImage location')
        .populate('workerId', 'name email phone profileImage location')
        .sort({ createdAt: -1 });

      return res.json({ success: true, count: bookings.length, bookings });
    } else {
      let bookings = mockStore.bookings;
      if (req.user.role === 'SEEKER') {
        bookings = bookings.filter((b) => b.seekerId === req.user._id || (b.seekerId && b.seekerId._id === req.user._id));
      } else if (req.user.role === 'WORKER') {
        bookings = bookings.filter((b) => b.workerId === req.user._id || (b.workerId && b.workerId._id === req.user._id));
      }

      const populated = bookings.map((b) => {
        const seeker = typeof b.seekerId === 'object' ? b.seekerId : mockStore.users.find((u) => u._id === b.seekerId);
        const worker = typeof b.workerId === 'object' ? b.workerId : mockStore.users.find((u) => u._id === b.workerId);
        return {
          ...b,
          seekerId: seeker || { name: 'Customer', phone: '' },
          workerId: worker || { name: 'Service Worker', phone: '' },
        };
      });

      return res.json({ success: true, count: populated.length, bookings: populated });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single booking by ID
// @route   GET /api/bookings/:id
exports.getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      const booking = await Booking.findById(id)
        .populate('seekerId', 'name email phone profileImage location')
        .populate('workerId', 'name email phone profileImage location');

      if (!booking) {
        return res.status(404).json({ success: false, message: 'Booking not found' });
      }

      return res.json({ success: true, booking });
    } else {
      const booking = mockStore.bookings.find((b) => b._id === id);
      if (!booking) {
        return res.status(404).json({ success: false, message: 'Booking not found' });
      }

      const seeker = typeof booking.seekerId === 'object' ? booking.seekerId : mockStore.users.find((u) => u._id === booking.seekerId);
      const worker = typeof booking.workerId === 'object' ? booking.workerId : mockStore.users.find((u) => u._id === booking.workerId);

      return res.json({
        success: true,
        booking: {
          ...booking,
          seekerId: seeker || { name: 'Customer', phone: '', location: '' },
          workerId: worker || { name: 'Worker', phone: '', location: '' },
        },
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update booking status & tracking
// @route   PATCH /api/bookings/:id/status
exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, trackingStatus, paymentStatus, workerLocation } = req.body;
    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      const booking = await Booking.findById(id);
      if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

      if (status) booking.status = status;
      if (trackingStatus) booking.trackingStatus = trackingStatus;
      if (paymentStatus) booking.paymentStatus = paymentStatus;
      if (workerLocation) booking.workerLocation = workerLocation;

      // Auto update tracking status when status changes
      if (status === 'ACCEPTED' && !trackingStatus) booking.trackingStatus = 'WORKER_ACCEPTED';
      if (status === 'IN_PROGRESS' && !trackingStatus) booking.trackingStatus = 'SERVICE_STARTED';
      if (status === 'COMPLETED' && !trackingStatus) booking.trackingStatus = 'SERVICE_COMPLETED';

      await booking.save();
      const updated = await Booking.findById(id)
        .populate('seekerId', 'name email phone profileImage')
        .populate('workerId', 'name email phone profileImage location');

      return res.json({ success: true, booking: updated });
    } else {
      const booking = mockStore.bookings.find((b) => b._id === id);
      if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

      if (status) booking.status = status;
      if (trackingStatus) booking.trackingStatus = trackingStatus;
      if (paymentStatus) booking.paymentStatus = paymentStatus;
      if (workerLocation) booking.workerLocation = workerLocation;

      if (status === 'ACCEPTED' && !trackingStatus) booking.trackingStatus = 'WORKER_ACCEPTED';
      if (status === 'IN_PROGRESS' && !trackingStatus) booking.trackingStatus = 'SERVICE_STARTED';
      if (status === 'COMPLETED' && !trackingStatus) booking.trackingStatus = 'SERVICE_COMPLETED';

      const seeker = typeof booking.seekerId === 'object' ? booking.seekerId : mockStore.users.find((u) => u._id === booking.seekerId);
      const worker = typeof booking.workerId === 'object' ? booking.workerId : mockStore.users.find((u) => u._id === booking.workerId);

      return res.json({
        success: true,
        booking: {
          ...booking,
          seekerId: seeker || { name: 'Customer' },
          workerId: worker || { name: 'Worker' },
        },
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
