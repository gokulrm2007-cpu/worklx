const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema(
  {
    seekerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    workerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    service: {
      type: String,
      required: true,
      default: 'Electrician',
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    serviceImage: {
      type: String,
      default: '',
    },
    amount: {
      type: Number,
      required: true,
      default: 500,
    },
    status: {
      type: String,
      enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
      default: 'PENDING',
    },
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'],
      default: 'PENDING',
    },
    trackingStatus: {
      type: String,
      enum: ['BOOKING_CREATED', 'WORKER_ACCEPTED', 'ON_THE_WAY', 'SERVICE_STARTED', 'SERVICE_COMPLETED'],
      default: 'BOOKING_CREATED',
    },
    workerLocation: {
      lat: { type: Number, default: 11.6643 },
      lng: { type: Number, default: 78.1460 },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Booking', BookingSchema);
