import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Star, CheckCircle2, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import api from '../services/api';
import RatingStars from '../components/RatingStars';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Reviews() {
  const { bookingId } = useParams();
  const [searchParams] = useSearchParams();
  const workerId = searchParams.get('workerId');
  const navigate = useNavigate();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError('Please write a brief comment about the service experience');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.post('/reviews', {
        bookingId: bookingId || 'booking_02',
        workerId: workerId || 'user_worker_01',
        rating,
        comment,
      });

      if (res.data.success) {
        setSuccess(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">
          Review Submitted!
        </h2>
        <p className="text-xs text-gray-500">
          Thank you for rating your service. Your feedback helps maintain high standards on the WORKLX marketplace.
        </p>
        <button
          onClick={() => navigate('/bookings')}
          className="py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md"
        >
          Return to My Bookings
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <div className="bg-white p-8 rounded-3xl border border-gray-200/80 shadow-xl shadow-blue-500/5 space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Customer Feedback
          </span>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight mt-2">
            Rate &amp; Review Your Technician
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            How satisfied were you with the repair quality, timeliness, and behaviour?
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Star Rating Selector */}
          <div className="text-center p-6 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
              Overall Rating
            </span>
            <div className="flex justify-center pt-1">
              <RatingStars
                rating={rating}
                size={32}
                interactive={true}
                onRatingChange={(newRating) => setRating(newRating)}
              />
            </div>
            <span className="text-xs font-bold text-amber-600 block">
              {rating === 5 ? '⭐⭐⭐⭐⭐ Exceptional (5/5)' : `${rating} out of 5 Stars`}
            </span>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Service Review &amp; Comments
            </label>
            <textarea
              required
              rows="4"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="e.g. Arrived on time, quickly fixed the MCB issue, and cleaned up after work. Very polite!"
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-xs text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all"
          >
            {loading ? 'Submitting Review...' : 'Publish Review to WORKLX'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
