import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Navigation,
  CreditCard,
  Star,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function BookingCard({ booking, onStatusUpdate = null }) {
  const { isSeeker, isWorker } = useAuth();
  const navigate = useNavigate();

  const worker = typeof booking.workerId === 'object' ? booking.workerId : {};
  const seeker = typeof booking.seekerId === 'object' ? booking.seekerId : {};

  const counterpartName = isWorker ? seeker.name || 'Customer' : worker.name || 'Service Worker';
  const counterpartImg = isWorker
    ? seeker.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'
    : worker.profileImage || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=100&q=80';

  const otherUserId = isWorker ? (seeker._id || booking.seekerId) : (worker._id || booking.workerId);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ACCEPTED':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200">Accepted</span>;
      case 'IN_PROGRESS':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-50 text-amber-700 border border-amber-200">In Progress</span>;
      case 'COMPLETED':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">Completed</span>;
      case 'REJECTED':
      case 'CANCELLED':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-red-50 text-red-700 border border-red-200">{status}</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-yellow-50 text-yellow-800 border border-yellow-200">Pending</span>;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-5 flex flex-col justify-between card-hover">
      <div>
        {/* Header: Service + Status Badge */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 block mb-0.5">
              {booking.service} Service
            </span>
            <h4 className="text-base font-bold text-gray-900 line-clamp-1">
              Booking #{booking._id?.substring(booking._id.length - 6).toUpperCase()}
            </h4>
          </div>
          {getStatusBadge(booking.status)}
        </div>

        {/* Counterpart Info (Seeker or Worker) */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-4">
          <img
            src={counterpartImg}
            alt={counterpartName}
            className="w-10 h-10 rounded-full object-cover border border-gray-200"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-400 font-medium">
              {isWorker ? 'Customer' : 'Assigned Technician'}
            </p>
            <p className="text-sm font-bold text-gray-900 truncate">{counterpartName}</p>
          </div>
          <div className="text-right">
            <span className="text-xs text-gray-400 block">Total Fee</span>
            <span className="text-sm font-extrabold text-gray-900">₹{booking.amount}</span>
          </div>
        </div>

        {/* Schedule & Location */}
        <div className="space-y-1.5 text-xs text-gray-600 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span>Date: <strong>{booking.date}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span>Time: <strong>{booking.time}</strong></span>
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
            <span className="line-clamp-1">{booking.address}</span>
          </div>
        </div>

        {/* Note / Description */}
        {booking.description && (
          <p className="text-xs text-gray-500 italic bg-gray-50 p-2.5 rounded-lg mb-4 line-clamp-2">
            "{booking.description}"
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          {/* Chat Button */}
          <button
            onClick={() => navigate(`/chat/${booking._id || ''}?user=${otherUserId}&name=${encodeURIComponent(counterpartName)}`)}
            className="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
            Chat
          </button>

          {/* Tracking Button */}
          <Link
            to={`/tracking/${booking._id}`}
            className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Navigation className="w-3.5 h-3.5" />
            Track Status
          </Link>
        </div>

        {/* Status / Role-Specific Actions */}
        <div className="flex items-center gap-2">
          {/* Worker Accept/Reject Actions for Pending bookings */}
          {isWorker && booking.status === 'PENDING' && onStatusUpdate && (
            <>
              <button
                onClick={() => onStatusUpdate(booking._id, 'ACCEPTED')}
                className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center gap-1 shadow-sm transition-all"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Accept
              </button>
              <button
                onClick={() => onStatusUpdate(booking._id, 'REJECTED')}
                className="px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 border border-red-200 rounded-lg flex items-center gap-1 transition-all"
              >
                <XCircle className="w-3.5 h-3.5" />
                Reject
              </button>
            </>
          )}

          {/* Worker Status updates for In-flight bookings */}
          {isWorker && booking.status === 'ACCEPTED' && onStatusUpdate && (
            <button
              onClick={() => onStatusUpdate(booking._id, 'IN_PROGRESS', 'SERVICE_STARTED')}
              className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
            >
              Start Job
            </button>
          )}

          {isWorker && booking.status === 'IN_PROGRESS' && onStatusUpdate && (
            <button
              onClick={() => onStatusUpdate(booking._id, 'COMPLETED', 'SERVICE_COMPLETED')}
              className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm"
            >
              Complete Job
            </button>
          )}

          {/* Seeker Pay Now if pending payment */}
          {isSeeker && booking.paymentStatus === 'PENDING' && (
            <Link
              to={`/payment/${booking._id}`}
              className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-1 shadow-sm"
            >
              <CreditCard className="w-3.5 h-3.5" />
              Pay ₹{booking.amount}
            </Link>
          )}

          {/* Seeker Leave Review if completed */}
          {isSeeker && booking.status === 'COMPLETED' && (
            <Link
              to={`/reviews/${booking._id}?workerId=${worker._id || booking.workerId}`}
              className="px-3 py-1.5 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg flex items-center gap-1"
            >
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              Write Review
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
