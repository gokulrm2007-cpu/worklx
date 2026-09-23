const { getDBStatus } = require('../config/db');
const Review = require('../models/Review');
const WorkerProfile = require('../models/WorkerProfile');
const Booking = require('../models/Booking');
const { mockStore } = require('../config/seed');

// @desc    Submit review for a completed booking
// @route   POST /api/reviews
exports.createReview = async (req, res) => {
  try {
    const { bookingId, workerId, rating, comment } = req.body;

    if (!bookingId || !workerId || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'Please provide rating and review comment' });
    }

    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      // Ensure booking is completed
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        return res.status(404).json({ success: false, message: 'Booking not found' });
      }

      const review = await Review.create({
        bookingId,
        seekerId: req.user._id,
        workerId,
        rating: Number(rating),
        comment,
      });

      // Recalculate Worker Rating
      const allReviews = await Review.find({ workerId });
      const avgRating = (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length).toFixed(1);

      await WorkerProfile.findOneAndUpdate(
        { userId: workerId },
        {
          rating: Number(avgRating),
          reviewCount: allReviews.length,
        }
      );

      const populated = await Review.findById(review._id)
        .populate('seekerId', 'name profileImage location');

      return res.status(201).json({ success: true, review: populated });
    } else {
      const newReview = {
        _id: `review_${Date.now()}`,
        bookingId,
        seekerId: req.user._id,
        workerId,
        rating: Number(rating),
        comment,
        createdAt: new Date(),
      };

      mockStore.reviews.unshift(newReview);

      const allWorkerReviews = mockStore.reviews.filter((r) => r.workerId === workerId);
      const avgRating = (allWorkerReviews.reduce((sum, r) => sum + r.rating, 0) / allWorkerReviews.length).toFixed(1);

      const wp = mockStore.workerProfiles.find((w) => w.userId === workerId);
      if (wp) {
        wp.rating = Number(avgRating);
        wp.reviewCount = allWorkerReviews.length;
      }

      const seeker = mockStore.users.find((u) => u._id === req.user._id);
      return res.status(201).json({
        success: true,
        review: {
          ...newReview,
          seekerId: seeker || { name: 'Customer' },
        },
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all reviews for a worker
// @route   GET /api/reviews/:workerId
exports.getWorkerReviews = async (req, res) => {
  try {
    const { workerId } = req.params;
    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      const reviews = await Review.find({ workerId })
        .populate('seekerId', 'name profileImage location')
        .sort({ createdAt: -1 });

      return res.json({ success: true, count: reviews.length, reviews });
    } else {
      const reviews = mockStore.reviews
        .filter((r) => r.workerId === workerId)
        .map((r) => {
          const seeker = typeof r.seekerId === 'object' ? r.seekerId : mockStore.users.find((u) => u._id === r.seekerId);
          return {
            ...r,
            seekerId: seeker || { name: 'Customer' },
          };
        });

      return res.json({ success: true, count: reviews.length, reviews });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
