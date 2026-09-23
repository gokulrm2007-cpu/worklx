import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Clock,
  MapPin,
  MessageSquare,
  Navigation,
  Phone,
  ShieldCheck,
  Wrench,
  AlertCircle,
} from 'lucide-react';
import api from '../services/api';
import InteractiveMap from '../components/InteractiveMap';
import LoadingSpinner from '../components/LoadingSpinner';

const trackingStages = [
  { id: 'BOOKING_CREATED', label: 'Booking Created', desc: 'Appointment registered in WORKLX' },
  { id: 'WORKER_ACCEPTED', label: 'Worker Assigned', desc: 'Technician has accepted your booking' },
  { id: 'ON_THE_WAY', label: 'On The Way', desc: 'Technician is traveling to your location' },
  { id: 'SERVICE_STARTED', label: 'Work In Progress', desc: 'Diagnosis and repair is actively underway' },
  { id: 'SERVICE_COMPLETED', label: 'Service Completed', desc: 'Work finished & verified' },
];

export default function Tracking() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await api.get(`/bookings/${id}`);
        if (res.data.success) {
          setBooking(res.data.booking);
        }
      } catch (err) {
        console.error('Error fetching booking tracking:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
    const interval = setInterval(fetchBooking, 6000); // Polling sync
    return () => clearInterval(interval);
  }, [id]);

  if (loading) {
    return <LoadingSpinner text="Connecting to live GPS tracking..." fullScreen={true} />;
  }

  if (!booking) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Booking Not Found</h2>
        <Link to="/bookings" className="btn btn-primary">Back to Bookings</Link>
      </div>
    );
  }

  const worker = typeof booking.workerId === 'object' ? booking.workerId : {};
  const currentStageIndex = trackingStages.findIndex((s) => s.id === booking.trackingStatus) || 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Live Order Tracking
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mt-1.5">
            {booking.service} Service Status
          </h1>
          <p className="text-xs text-gray-500">
            Booking ID: #{booking._id?.substring(booking._id.length - 6).toUpperCase()} • Scheduled for {booking.date} at {booking.time}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/chat/${booking._id}?user=${worker._id || booking.workerId}&name=${encodeURIComponent(worker.name || 'Worker')}`)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all"
          >
            <MessageSquare className="w-4 h-4" />
            Chat with {worker.name?.split(' ')[0] || 'Worker'}
          </button>
        </div>
      </div>

      {/* 1. PROGRESS STAGES BAR */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative">
          {trackingStages.map((stage, idx) => {
            const isCompleted = idx <= currentStageIndex;
            const isCurrent = idx === currentStageIndex;

            return (
              <div key={stage.id} className="flex flex-col items-center sm:text-center text-left relative">
                {/* Step Circle */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm mb-3 transition-colors ${
                    isCurrent
                      ? 'bg-blue-600 text-white ring-4 ring-blue-100 animate-pulse'
                      : isCompleted
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {isCompleted && !isCurrent ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                </div>

                <div>
                  <h4 className={`text-xs font-bold ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                    {stage.label}
                  </h4>
                  <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">
                    {stage.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. MAP & TECHNICIAN HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Interactive GPS Map (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <InteractiveMap
            workerLocation={booking.workerLocation || { lat: 11.6643, lng: 78.1460 }}
            serviceAddress={booking.address}
            workerName={worker.name || 'Technician'}
            status={booking.trackingStatus}
          />
        </div>

        {/* Worker Details Card (1 col) */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
            <img
              src={worker.profileImage || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=100&q=80'}
              alt={worker.name}
              className="w-14 h-14 rounded-2xl object-cover"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-bold text-gray-900">{worker.name || 'Technician'}</h3>
                <ShieldCheck className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-xs text-blue-600 font-semibold">{booking.service} Specialist</span>
            </div>
          </div>

          <div className="space-y-3 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
              <span>{booking.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Contact: <strong>{worker.phone || '+91 98401 12233'}</strong></span>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-400 font-semibold">Payment Status</span>
            <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold ${booking.paymentStatus === 'PAID' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
              {booking.paymentStatus}
            </span>
          </div>

          {booking.status === 'COMPLETED' && (
            <Link
              to={`/reviews/${booking._id}?workerId=${worker._id || booking.workerId}`}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition-all"
            >
              Submit Rating &amp; Review
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
