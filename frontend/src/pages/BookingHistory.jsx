import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Search, Filter, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import BookingCard from '../components/BookingCard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function BookingHistory() {
  const { user, isWorker } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings');
      if (res.data.success) {
        setBookings(res.data.bookings);
      }
    } catch (err) {
      console.error('Error loading bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusUpdate = async (bookingId, newStatus, newTrackingStatus = null) => {
    try {
      const res = await api.patch(`/bookings/${bookingId}/status`, {
        status: newStatus,
        trackingStatus: newTrackingStatus,
      });
      if (res.data.success) {
        fetchBookings();
      }
    } catch (err) {
      console.error('Error updating booking status:', err);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'PENDING') return b.status === 'PENDING';
    if (activeTab === 'ACTIVE') return b.status === 'ACCEPTED' || b.status === 'IN_PROGRESS';
    if (activeTab === 'COMPLETED') return b.status === 'COMPLETED';
    if (activeTab === 'CANCELLED') return b.status === 'CANCELLED' || b.status === 'REJECTED';
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            {isWorker ? 'Job Requests & Schedule' : 'My Booking History'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Track your appointments, job assignments, live status, and receipts.
          </p>
        </div>

        {!isWorker && (
          <Link
            to="/search"
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-all self-start sm:self-auto"
          >
            <Search className="w-4 h-4" /> Book New Service
          </Link>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { id: 'ALL', label: `All Bookings (${bookings.length})` },
          { id: 'PENDING', label: `Pending (${bookings.filter((b) => b.status === 'PENDING').length})` },
          { id: 'ACTIVE', label: `Active / In Progress (${bookings.filter((b) => b.status === 'ACCEPTED' || b.status === 'IN_PROGRESS').length})` },
          { id: 'COMPLETED', label: `Completed (${bookings.filter((b) => b.status === 'COMPLETED').length})` },
          { id: 'CANCELLED', label: `Cancelled` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {loading ? (
        <LoadingSpinner text="Fetching your appointments..." />
      ) : filteredBookings.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-gray-200 text-center space-y-4">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="text-base font-bold text-gray-900">No Bookings in this Tab</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            {isWorker
              ? 'You have no job orders under this status currently.'
              : 'You have not made any service bookings in this category yet.'}
          </p>
          {!isWorker && (
            <Link to="/search" className="btn btn-primary text-xs">
              Explore Available Workers
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredBookings.map((booking) => (
            <BookingCard
              key={booking._id}
              booking={booking}
              onStatusUpdate={handleStatusUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
