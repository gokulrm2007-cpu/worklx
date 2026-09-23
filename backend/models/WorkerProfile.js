const mongoose = require('mongoose');

const WorkerProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    skills: {
      type: [String],
      required: true,
      default: ['Electrician'],
    },
    experience: {
      type: Number, // in years
      default: 5,
    },
    description: {
      type: String,
      default: 'Experienced professional providing high-quality repair and installation services.',
    },
    price: {
      type: Number, // per visit or service base fee in INR
      required: true,
      default: 500,
    },
    location: {
      type: String,
      default: 'Salem, Tamil Nadu',
    },
    coordinates: {
      lat: { type: Number, default: 11.6643 },
      lng: { type: Number, default: 78.1460 },
    },
    availability: {
      type: String,
      enum: ['AVAILABLE', 'BUSY', 'OFFLINE'],
      default: 'AVAILABLE',
    },
    profileImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=400&q=80',
    },
    previousWorkImages: {
      type: [String],
      default: [
        'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=600&q=80',
      ],
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 4.9,
    },
    reviewCount: {
      type: Number,
      default: 12,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('WorkerProfile', WorkerProfileSchema);
