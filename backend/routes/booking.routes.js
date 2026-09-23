const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');
const { protect } = require('../middleware/auth');

router.post('/', protect, bookingController.createBooking);
router.get('/', protect, bookingController.getBookings);
router.get('/:id', protect, bookingController.getBookingById);
router.patch('/:id/status', protect, bookingController.updateBookingStatus);

module.exports = router;
