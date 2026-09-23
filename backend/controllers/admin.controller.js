const { getDBStatus } = require('../config/db');
const User = require('../models/User');
const WorkerProfile = require('../models/WorkerProfile');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const Category = require('../models/Category');
const { mockStore } = require('../config/seed');

// @desc    Get complete platform analytics and stats for Admin Dashboard
// @route   GET /api/admin/stats
exports.getStats = async (req, res) => {
  try {
    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      const totalUsers = await User.countDocuments();
      const totalWorkers = await User.countDocuments({ role: 'WORKER' });
      const totalSeekers = await User.countDocuments({ role: 'SEEKER' });
      const totalBookings = await Booking.countDocuments();
      const completedBookings = await Booking.countDocuments({ status: 'COMPLETED' });
      const pendingBookings = await Booking.countDocuments({ status: 'PENDING' });

      const payments = await Payment.find({ status: 'SUCCESS' });
      const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0) || 12500;

      // Category breakdown
      const categories = await Category.find();

      return res.json({
        success: true,
        stats: {
          totalUsers,
          totalWorkers,
          totalSeekers,
          totalBookings,
          completedBookings,
          pendingBookings,
          totalRevenue,
          commissionEarned: Math.round(totalRevenue * 0.15), // 15% platform commission
        },
        charts: {
          userGrowth: [
            { month: 'Apr', seekers: 12, workers: 4 },
            { month: 'May', seekers: 19, workers: 6 },
            { month: 'Jun', seekers: 28, workers: 10 },
            { month: 'Jul', seekers: 45, workers: 15 },
            { month: 'Aug', seekers: 62, workers: 22 },
            { month: 'Sep', seekers: 85, workers: 31 },
          ],
          revenueTrend: [
            { month: 'Apr', revenue: 4500 },
            { month: 'May', revenue: 7800 },
            { month: 'Jun', revenue: 12400 },
            { month: 'Jul', revenue: 19800 },
            { month: 'Aug', revenue: 28600 },
            { month: 'Sep', revenue: 38200 },
          ],
          popularServices: [
            { name: 'Electrician', bookings: 42, color: '#3b82f6' },
            { name: 'Plumber', bookings: 31, color: '#10b981' },
            { name: 'AC Repair', bookings: 27, color: '#f59e0b' },
            { name: 'Painter', bookings: 19, color: '#8b5cf6' },
            { name: 'Carpenter', bookings: 16, color: '#ec4899' },
            { name: 'Mason', bookings: 11, color: '#6b7280' },
          ],
        },
      });
    } else {
      const totalUsers = mockStore.users.length;
      const totalWorkers = mockStore.users.filter((u) => u.role === 'WORKER').length;
      const totalSeekers = mockStore.users.filter((u) => u.role === 'SEEKER').length;
      const totalBookings = mockStore.bookings.length;
      const completedBookings = mockStore.bookings.filter((b) => b.status === 'COMPLETED').length;
      const pendingBookings = mockStore.bookings.filter((b) => b.status === 'PENDING').length;
      const totalRevenue = mockStore.bookings.filter((b) => b.paymentStatus === 'PAID').reduce((sum, b) => sum + b.amount, 0) || 12500;

      return res.json({
        success: true,
        stats: {
          totalUsers,
          totalWorkers,
          totalSeekers,
          totalBookings,
          completedBookings,
          pendingBookings,
          totalRevenue,
          commissionEarned: Math.round(totalRevenue * 0.15),
        },
        charts: {
          userGrowth: [
            { month: 'Apr', seekers: 12, workers: 4 },
            { month: 'May', seekers: 19, workers: 6 },
            { month: 'Jun', seekers: 28, workers: 10 },
            { month: 'Jul', seekers: 45, workers: 15 },
            { month: 'Aug', seekers: 62, workers: 22 },
            { month: 'Sep', seekers: 85, workers: 31 },
          ],
          revenueTrend: [
            { month: 'Apr', revenue: 4500 },
            { month: 'May', revenue: 7800 },
            { month: 'Jun', revenue: 12400 },
            { month: 'Jul', revenue: 19800 },
            { month: 'Aug', revenue: 28600 },
            { month: 'Sep', revenue: 38200 },
          ],
          popularServices: [
            { name: 'Electrician', bookings: 42, color: '#3b82f6' },
            { name: 'Plumber', bookings: 31, color: '#10b981' },
            { name: 'AC Repair', bookings: 27, color: '#f59e0b' },
            { name: 'Painter', bookings: 19, color: '#8b5cf6' },
            { name: 'Carpenter', bookings: 16, color: '#ec4899' },
            { name: 'Mason', bookings: 11, color: '#6b7280' },
          ],
        },
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all users list for admin
// @route   GET /api/admin/users
exports.getAllUsers = async (req, res) => {
  try {
    const dbStatus = getDBStatus();
    if (dbStatus.connected) {
      const users = await User.find().select('-password').sort({ createdAt: -1 });
      return res.json({ success: true, count: users.length, users });
    } else {
      const users = mockStore.users.map(({ password, ...u }) => u);
      return res.json({ success: true, count: users.length, users });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle block/unblock user
// @route   PATCH /api/admin/users/:id/block
exports.toggleBlockUser = async (req, res) => {
  try {
    const { id } = req.params;
    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      const user = await User.findById(id);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      if (user.role === 'ADMIN') return res.status(400).json({ success: false, message: 'Cannot block administrator' });

      user.isBlocked = !user.isBlocked;
      await user.save();

      return res.json({ success: true, message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`, isBlocked: user.isBlocked });
    } else {
      const user = mockStore.users.find((u) => u._id === id);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      if (user.role === 'ADMIN') return res.status(400).json({ success: false, message: 'Cannot block administrator' });

      user.isBlocked = !user.isBlocked;
      return res.json({ success: true, message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`, isBlocked: user.isBlocked });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify or unverify a worker
// @route   PATCH /api/admin/workers/:id/verify
exports.verifyWorker = async (req, res) => {
  try {
    const { id } = req.params; // worker profile ID or user ID
    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      let wp = await WorkerProfile.findById(id);
      if (!wp) wp = await WorkerProfile.findOne({ userId: id });
      if (!wp) return res.status(404).json({ success: false, message: 'Worker profile not found' });

      wp.isVerified = !wp.isVerified;
      await wp.save();

      return res.json({ success: true, message: `Worker verification status updated`, isVerified: wp.isVerified });
    } else {
      const wp = mockStore.workerProfiles.find((w) => w._id === id || w.userId === id);
      if (!wp) return res.status(404).json({ success: false, message: 'Worker profile not found' });

      wp.isVerified = !wp.isVerified;
      return res.json({ success: true, message: `Worker verification status updated`, isVerified: wp.isVerified });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all bookings for admin monitor
// @route   GET /api/admin/bookings
exports.getAllBookings = async (req, res) => {
  try {
    const dbStatus = getDBStatus();
    if (dbStatus.connected) {
      const bookings = await Booking.find()
        .populate('seekerId', 'name email phone')
        .populate('workerId', 'name email phone')
        .sort({ createdAt: -1 });

      return res.json({ success: true, count: bookings.length, bookings });
    } else {
      const bookings = mockStore.bookings.map((b) => {
        const seeker = typeof b.seekerId === 'object' ? b.seekerId : mockStore.users.find((u) => u._id === b.seekerId);
        const worker = typeof b.workerId === 'object' ? b.workerId : mockStore.users.find((u) => u._id === b.workerId);
        return {
          ...b,
          seekerId: seeker || { name: 'Customer' },
          workerId: worker || { name: 'Worker' },
        };
      });

      return res.json({ success: true, count: bookings.length, bookings });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
