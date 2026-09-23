const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { protect, authorize } = require('../middleware/auth');

router.get('/stats', protect, authorize('ADMIN'), adminController.getStats);
router.get('/users', protect, authorize('ADMIN'), adminController.getAllUsers);
router.patch('/users/:id/block', protect, authorize('ADMIN'), adminController.toggleBlockUser);
router.patch('/workers/:id/verify', protect, authorize('ADMIN'), adminController.verifyWorker);
router.get('/bookings', protect, authorize('ADMIN'), adminController.getAllBookings);

module.exports = router;
