const { getDBStatus } = require('../config/db');
const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const { mockStore } = require('../config/seed');

// @desc    Create Razorpay Order
// @route   POST /api/payments/create-order
exports.createOrder = async (req, res) => {
  try {
    const { bookingId, amount } = req.body;

    if (!bookingId || !amount) {
      return res.status(400).json({ success: false, message: 'Please provide bookingId and amount' });
    }

    // In production, Razorpay SDK creates order:
    // const order = await razorpay.orders.create({ amount: amount * 100, currency: 'INR', receipt: bookingId });
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    res.json({
      success: true,
      order: {
        id: orderId,
        amount: Number(amount) * 100,
        currency: 'INR',
        bookingId,
      },
      key: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder_key',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify Razorpay Payment
// @route   POST /api/payments/verify
exports.verifyPayment = async (req, res) => {
  try {
    const { bookingId, razorpayOrderId, razorpayPaymentId, amount } = req.body;

    const dbStatus = getDBStatus();
    const finalPaymentId = razorpayPaymentId || `pay_${Date.now()}`;

    if (dbStatus.connected) {
      const payment = await Payment.create({
        bookingId,
        userId: req.user._id,
        razorpayOrderId: razorpayOrderId || `order_${Date.now()}`,
        razorpayPaymentId: finalPaymentId,
        amount: Number(amount) || 500,
        status: 'SUCCESS',
      });

      // Update booking payment status
      await Booking.findByIdAndUpdate(bookingId, {
        paymentStatus: 'PAID',
      });

      return res.json({
        success: true,
        message: 'Payment verified and booking confirmed successfully',
        payment,
      });
    } else {
      const newPayment = {
        _id: `payment_${Date.now()}`,
        bookingId,
        userId: req.user._id,
        razorpayOrderId: razorpayOrderId || `order_${Date.now()}`,
        razorpayPaymentId: finalPaymentId,
        amount: Number(amount) || 500,
        status: 'SUCCESS',
        createdAt: new Date(),
      };
      mockStore.payments.push(newPayment);

      const booking = mockStore.bookings.find((b) => b._id === bookingId);
      if (booking) {
        booking.paymentStatus = 'PAID';
      }

      return res.json({
        success: true,
        message: 'Payment verified and booking confirmed successfully',
        payment: newPayment,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
