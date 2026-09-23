import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Clock,
  CheckCircle2,
  IndianRupee,
  Star,
  Calendar,
  AlertCircle,
  TrendingUp,
  MessageSquare,
  Wrench,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import BookingCard from '../components/BookingCard';
import LoadingSpinner from '../components/LoadingSpinner';

const earningsData = [
  { day: 'Mon', earnings: 1500, jobs: 3 },
  { day: 'Tue', earnings: 2000, jobs: 4 },
  { day: 'Wed', earnings: 1000, jobs: 2 },
  { day: 'Thu', earnings: 2500, jobs: 5 },
  { day: 'Fri', earnings: 3000, jobs: 6 },
  { day: 'Sat', earnings: 3500, jobs: 7 },
  { day: 'Sun', earnings: 2200, jobs: 4 },
];

export default function WorkerDashboard() {
  const { user, workerProfile } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWorkerBookings = async () => {
    try {
      const res = await api.get('/bookings');
      if (res.data.success) {
        setBookings(res.data.bookings);
      }
    } catch (err) {
      console.error('Error fetching worker dashboard bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkerBookings();
  }, []);

  const handleStatusUpdate = async (bookingId, newStatus, newTrackingStatus = null) => {
    try {
      const res = await api.patch(`/bookings/${bookingId}/status`, {
        status: newStatus,
        trackingStatus: newTrackingStatus,
      });
      if (res.data.success) {
        fetchWorkerBookings();
      }
    } catch (err) {
      console.error('Error updating booking status:', err);
    }
  };

  const totalJobs = bookings.length || 18;
  const pendingRequests = bookings.filter((b) => b.status === 'PENDING');
  const completedJobs = bookings.filter((b) => b.status === 'COMPLETED').length || 12;
  const totalEarnings = bookings
    .filter((b) => b.paymentStatus === 'PAID')
    .reduce((sum, b) => sum + b.amount, 0) || 15700;
  const rating = workerProfile?.rating || 4.9;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-blue-500/10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
            Technician Command Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome back, {user?.name || 'Ravi Kumar'}!
          </h1>
          <p className="text-xs text-blue-100">
            {workerProfile?.skills?.[0] || 'Electrician'} Partner • {workerProfile?.location || 'Salem, Tamil Nadu'}
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/20">
          <Star className="w-6 h-6 text-amber-300 fill-amber-300" />
          <div>
            <span className="text-xl font-black">{rating} / 5.0</span>
            <p className="text-[10px] text-blue-200 uppercase font-semibold">Service Rating</p>
          </div>
        </div>
      </div>

      {/* 1. METRICS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Card 1: Total Earnings */}
        <div className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-emerald-600">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Earnings</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-gray-900">₹{totalEarnings}</p>
          <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +18% this week
          </span>
        </div>

        {/* Card 2: Total Jobs */}
        <div className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-blue-600">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Bookings</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-gray-900">{totalJobs}</p>
          <span className="text-[11px] text-gray-400">Lifetime orders received</span>
        </div>

        {/* Card 3: Pending Requests */}
        <div className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-amber-600">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Pending Requests</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-gray-900">{pendingRequests.length}</p>
          <span className="text-[11px] font-semibold text-amber-600">Action required</span>
        </div>

        {/* Card 4: Completed Jobs */}
        <div className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-purple-600">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Completed Jobs</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-gray-900">{completedJobs}</p>
          <span className="text-[11px] font-semibold text-purple-600">100% Satisfaction</span>
        </div>
      </div>

      {/* 2. RECHARTS EARNINGS & JOBS ANALYTICS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Earnings Chart */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-gray-900">Weekly Earnings Trend</h3>
              <p className="text-xs text-gray-400">Income received across past 7 days</p>
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              ₹15,700 Total
            </span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={earningsData}>
                <defs>
                  <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  formatter={(val) => [`₹${val}`, 'Earnings']}
                  contentStyle={{ backgroundColor: '#1e293b', color: '#fff', borderRadius: '12px', fontSize: '12px', border: 'none' }}
                />
                <Area type="monotone" dataKey="earnings" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorEarnings)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Completed Jobs Bar Chart */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-gray-900">Daily Jobs Serviced</h3>
              <p className="text-xs text-gray-400">Volume of visits fulfilled</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              31 Jobs Total
            </span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={earningsData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  formatter={(val) => [`${val} Orders`, 'Jobs']}
                  contentStyle={{ backgroundColor: '#1e293b', color: '#fff', borderRadius: '12px', fontSize: '12px', border: 'none' }}
                />
                <Bar dataKey="jobs" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 3. NEW BOOKING REQUESTS SECTION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">New Booking Requests</h2>
            <p className="text-xs text-gray-500">Incoming service orders awaiting your confirmation</p>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full">
            {pendingRequests.length} Pending
          </span>
        </div>

        {pendingRequests.length === 0 ? (
          <div className="bg-white p-8 rounded-3xl border border-gray-200 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <h3 className="text-sm font-bold text-gray-900">All caught up!</h3>
            <p className="text-xs text-gray-400">No pending job requests right now. New customer bookings will appear here instantly.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pendingRequests.map((b) => (
              <BookingCard
                key={b._id}
                booking={b}
                onStatusUpdate={handleStatusUpdate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
