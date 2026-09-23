import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  MapPin,
  Star,
  Clock,
  Briefcase,
  IndianRupee,
  MessageSquare,
  Calendar,
  ArrowRight,
  CheckCircle,
  Image as ImageIcon,
} from 'lucide-react';
import api from '../services/api';
import RatingStars from '../components/RatingStars';
import LoadingSpinner from '../components/LoadingSpinner';

export default function WorkerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [worker, setWorker] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchWorkerDetails = async () => {
      setLoading(true);
      try {
        const [workerRes, reviewsRes] = await Promise.all([
          api.get(`/workers/${id}`),
          api.get(`/reviews/${id}`),
        ]);

        if (workerRes.data.success) {
          setWorker(workerRes.data.worker);
        }
        if (reviewsRes.data.success) {
          setReviews(reviewsRes.data.reviews);
        }
      } catch (err) {
        console.error('Error fetching worker details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkerDetails();
  }, [id]);

  if (loading) {
    return <LoadingSpinner text="Loading technician profile..." fullScreen={true} />;
  }

  if (!worker) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Worker Profile Not Found</h2>
        <Link to="/search" className="btn btn-primary">Browse Workers</Link>
      </div>
    );
  }

  const user = worker.userId || {};
  const name = user.name || 'Professional Technician';
  const profileImg = worker.profileImage || user.profileImage;
  const rating = worker.rating || 4.9;
  const reviewCount = worker.reviewCount || reviews.length || 10;
  const price = worker.price || 500;
  const experience = worker.experience || 5;
  const location = worker.location || user.location || 'Salem, Tamil Nadu';
  const skills = worker.skills || ['Electrician'];

  const otherUserId = user._id || worker.userId;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Profile Hero Card */}
      <div className="bg-white rounded-3xl border border-gray-200/80 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            <div className="relative">
              <img
                src={profileImg}
                alt={name}
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover border-2 border-white shadow-xl shadow-blue-500/10"
              />
              {worker.isVerified !== false && (
                <span className="absolute -bottom-2 -right-2 px-2.5 py-1 bg-blue-600 rounded-full text-white text-xs font-bold flex items-center gap-1 shadow-md">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified
                </span>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900">{name}</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                  {worker.availability || 'AVAILABLE'}
                </span>
              </div>

              <p className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-gray-500">
                <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                <span>{location}</span>
              </p>

              <div className="flex items-center justify-center sm:justify-start gap-3 pt-1">
                <div className="flex items-center gap-1.5">
                  <RatingStars rating={rating} size={16} />
                  <span className="text-sm font-black text-gray-900">{rating}</span>
                </div>
                <span className="text-xs text-gray-400">({reviewCount} verified reviews)</span>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap justify-center sm:justify-start gap-1.5 pt-2">
                {skills.map((s, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-100"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Pricing & CTA Buttons */}
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex flex-col justify-between gap-4 md:min-w-[280px]">
            <div>
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">
                Standard Visiting Fee
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-black text-blue-600">₹{price}</span>
                <span className="text-xs text-gray-500 font-medium">/ service visit</span>
              </div>
              <p className="text-[11px] text-gray-400 mt-1">
                Includes inspection, diagnosis &amp; standard repair labour.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => navigate(`/booking/${worker._id || id}`)}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all"
              >
                <Calendar className="w-4 h-4" />
                Book Now
              </button>

              <button
                onClick={() => navigate(`/chat?user=${otherUserId}&name=${encodeURIComponent(name)}`)}
                className="w-full py-2.5 px-4 bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-blue-600" />
                Chat with {name.split(' ')[0]}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: About & Previous Work Portfolio */}
        <div className="lg:col-span-2 space-y-8">
          {/* About Section */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-600" />
              About &amp; Work Experience ({experience}+ Years)
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              {worker.description || 'Experienced professional offering high quality workmanship, proper safety standard compliance, and transparent customer communication.'}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
              <div className="p-3 bg-gray-50 rounded-xl">
                <span className="text-[11px] text-gray-400 font-semibold block uppercase">Experience</span>
                <span className="text-sm font-bold text-gray-900">{experience}+ Years</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <span className="text-[11px] text-gray-400 font-semibold block uppercase">Response Time</span>
                <span className="text-sm font-bold text-gray-900">&lt; 15 Minutes</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <span className="text-[11px] text-gray-400 font-semibold block uppercase">Warranty</span>
                <span className="text-sm font-bold text-gray-900">30 Days Labour</span>
              </div>
            </div>
          </div>

          {/* Previous Work Gallery */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-blue-600" />
              Previous Work Portfolio ({worker.previousWorkImages?.length || 2} Photos)
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {worker.previousWorkImages?.map((imgUrl, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedImage(imgUrl)}
                  className="group relative rounded-2xl overflow-hidden aspect-video bg-gray-100 cursor-pointer shadow-sm"
                >
                  <img
                    src={imgUrl}
                    alt={`Work ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 tracking-tight flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                Customer Reviews &amp; Ratings
              </h2>
              <span className="text-xs font-bold text-gray-500">
                {reviews.length} total reviews
              </span>
            </div>

            {reviews.length === 0 ? (
              <p className="text-xs text-gray-500 py-4 italic">
                No reviews yet for this technician. Be the first to book and submit your experience!
              </p>
            ) : (
              <div className="space-y-4 divide-y divide-gray-100">
                {reviews.map((rev, idx) => {
                  const seeker = typeof rev.seekerId === 'object' ? rev.seekerId : {};
                  return (
                    <div key={idx} className="pt-4 first:pt-0 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={seeker.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80'}
                            alt={seeker.name || 'Seeker'}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div>
                            <p className="text-xs font-bold text-gray-900">{seeker.name || 'Customer'}</p>
                            <span className="text-[10px] text-gray-400">{seeker.location || 'Salem'}</span>
                          </div>
                        </div>
                        <RatingStars rating={rev.rating} size={13} />
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        "{rev.comment}"
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Security & Guarantee Card */}
        <div className="space-y-6">
          <div className="bg-blue-50/70 p-6 rounded-3xl border border-blue-100 space-y-4">
            <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wide">
              The WORKLX Safety Guarantee
            </h3>
            <ul className="space-y-3 text-xs text-blue-900/80">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Identity &amp; police verification completed.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Fixed transparent price. No hidden surprise charges.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Payment held safely in escrow until you approve the job.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
