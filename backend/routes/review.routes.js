const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');
const { protect } = require('../middleware/auth');

router.post('/', protect, reviewController.createReview);
router.get('/:workerId', reviewController.getWorkerReviews);

module.exports = router;
