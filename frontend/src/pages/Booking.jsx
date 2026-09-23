import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  FileText,
  CreditCard,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Wrench,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Booking() {
  const { workerId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    service: 'Electrician',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    time: '10:00 AM',
    address: user?.location || '14/B Fairlands Main Road, Salem, Tamil Nadu',
    description: '',
    serviceImage: '',
  });

  useEffect(() => {
    const fetchWorker = async () => {
      try {
        const res = await api.get(`/workers/${workerId}`);
        if (res.data.success) {
          setWorker(res.data.worker);
          if (res.data.worker.skills?.[0]) {
            setFormData((prev) => ({ ...prev, service: res.data.worker.skills[0] }));
          }
        }
      } catch (err) {
        console.error('Error fetching worker for booking:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorker();
  }, [workerId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const payload = {
        workerId: worker?.userId?._id || worker?.userId || workerId,
        service: formData.service,
        date: formData.date,
        time: formData.time,
        address: formData.address,
        description: formData.description,
        serviceImage: formData.serviceImage,
        amount: worker?.price || 500,
      };

      const res = await api.post('/api/bookings', payload);
      if (res.data.success) {
        const newBookingId = res.data.booking._id;
        navigate(`/payment/${newBookingId}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create booking request');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Preparing booking appointment..." fullScreen={true} />;
  }

  const workerUser = worker?.userId || {};
  const workerName = workerUser.name || 'Technician';
  const workerPrice = worker?.price || 500;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xl shadow-blue-500/5 p-6 sm:p-10 space-y-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Booking Appointment
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mt-2">
            Schedule a Service with {workerName}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Fill in your preferred date, time, and address. Pay securely after booking.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Form (2 cols) */}
          <form onSubmit={handleSubmit} className="md:col-span-2 space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Service Type
              </label>
              <div className="relative">
                <Wrench className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <select
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  {worker?.skills?.map((s, idx) => (
                    <option key={idx} value={s}>{s}</option>
                  )) || <option value="General Service">General Service</option>}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Service Date
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  <input
                    type="date"
                    name="date"
                    required
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Time Slot
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  <select
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="09:00 AM">09:00 AM - 11:00 AM (Morning)</option>
                    <option value="11:30 AM">11:30 AM - 01:30 PM (Noon)</option>
                    <option value="02:30 PM">02:30 PM - 04:30 PM (Afternoon)</option>
                    <option value="05:00 PM">05:00 PM - 07:00 PM (Evening)</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Service Location / Full Address
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <textarea
                  name="address"
                  required
                  rows="2"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="House/Flat No, Landmark, City, Pincode"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Description of the Issue (Optional)
              </label>
              <div className="relative">
                <FileText className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <textarea
                  name="description"
                  rows="2"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="e.g. Switchboard sparking, fan speed regulator broken..."
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all mt-6"
            >
              {submitting ? 'Confirming Appointment...' : `Proceed to Payment (₹${workerPrice})`}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Booking Summary Card (1 col) */}
          <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900">
              Booking Breakdown
            </h3>

            <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
              <img
                src={worker?.profileImage || workerUser.profileImage || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=100&q=80'}
                alt={workerName}
                className="w-12 h-12 rounded-2xl object-cover"
              />
              <div>
                <h4 className="text-sm font-bold text-gray-900">{workerName}</h4>
                <p className="text-xs text-blue-600 font-semibold">{formData.service}</p>
              </div>
            </div>

            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Visiting / Diagnosis Fee</span>
                <span className="font-semibold text-gray-900">₹{workerPrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Platform Convenience Fee</span>
                <span className="font-semibold text-emerald-600">₹0 (Free)</span>
              </div>
              <div className="flex justify-between">
                <span>30-Day Service Guarantee</span>
                <span className="font-semibold text-emerald-600">Included</span>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-200 flex justify-between items-baseline">
              <span className="text-xs font-bold text-gray-900 uppercase">Total Payable</span>
              <span className="text-2xl font-black text-blue-600">₹{workerPrice}</span>
            </div>

            <div className="pt-2 text-[11px] text-gray-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Full refund if technician does not arrive on schedule.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
