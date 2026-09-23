import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, MapPin, Star, Calendar, MessageSquare, ArrowRight } from 'lucide-react';
import RatingStars from './RatingStars';

export default function WorkerCard({ worker }) {
  const navigate = useNavigate();

  const user = worker.userId || {};
  const name = user.name || 'Professional Worker';
  const profileImg = worker.profileImage || user.profileImage || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=400&q=80';
  const primarySkill = worker.skills?.[0] || 'Technician';
  const location = worker.location || user.location || 'Salem, Tamil Nadu';
  const price = worker.price || 500;
  const rating = worker.rating || 4.9;
  const reviewCount = worker.reviewCount || 12;
  const isVerified = worker.isVerified !== false;
  const description = worker.description || 'Dedicated skilled professional providing guaranteed on-time repair and installation.';

  const workerId = worker._id || user._id;

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden flex flex-col justify-between card-hover">
      {/* Top Banner / Card Head */}
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className="relative">
            <img
              src={profileImg}
              alt={name}
              className="w-16 h-16 rounded-2xl object-cover border border-gray-100 shadow-sm"
            />
            {isVerified && (
              <span
                title="Verified Professional"
                className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white ring-2 ring-white"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <h3 className="text-base font-bold text-gray-900 truncate hover:text-blue-600 transition-colors">
                <Link to={`/workers/${workerId}`}>{name}</Link>
              </h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100 shrink-0">
                {primarySkill}
              </span>
            </div>

            <p className="flex items-center gap-1 text-xs text-gray-500 mt-1">
              <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span className="truncate">{location}</span>
            </p>

            <div className="flex items-center gap-2 mt-2">
              <RatingStars rating={rating} size={14} />
              <span className="text-xs font-bold text-gray-800">{rating}</span>
              <span className="text-xs text-gray-400">({reviewCount})</span>
            </div>
          </div>
        </div>

        {/* Short Bio */}
        <p className="text-xs text-gray-600 line-clamp-2 mt-3.5 leading-relaxed">
          {description}
        </p>

        {/* Skills Tag Pills */}
        <div className="flex flex-wrap gap-1.5 mt-3.5">
          {worker.skills?.slice(0, 3).map((s, idx) => (
            <span
              key={idx}
              className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-gray-100 text-gray-600"
            >
              {s}
            </span>
          ))}
          {worker.skills?.length > 3 && (
            <span className="text-[11px] font-medium px-1.5 py-0.5 rounded bg-gray-50 text-gray-400">
              +{worker.skills.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Footer Pricing & CTA Buttons */}
      <div className="p-4 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] text-gray-400 block font-medium uppercase">Service Fee</span>
          <p className="text-base font-extrabold text-blue-600">
            ₹{price} <span className="text-xs font-normal text-gray-500">/ visit</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/workers/${workerId}`}
            className="px-3 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors"
          >
            View Profile
          </Link>
          <button
            onClick={() => navigate(`/booking/${workerId}`)}
            className="px-3.5 py-2 text-xs font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-sm shadow-blue-500/20 flex items-center gap-1 transition-all"
          >
            Book Now
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
