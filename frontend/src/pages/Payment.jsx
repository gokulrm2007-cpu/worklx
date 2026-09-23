import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Smartphone,
  Building,
  QrCode,
  AlertCircle,
  Clock,
} from 'lucide-react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Payment() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [error, setError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await api.get(`/bookings/${bookingId}`);
        if (res.data.success) {
          setBooking(res.data.booking);
          if (res.data.booking.paymentStatus === 'PAID') {
            setPaymentSuccess(true);
          }
        }
      } catch (err) {
        console.error('Error loading booking for payment:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  const handleRazorpayPay = async () => {
    setError('');
    setProcessing(true);

    try {
      // 1. Create Order from backend
      const orderRes = await api.post('/payments/create-order', {
        bookingId,
        amount: booking?.amount || 500,
      });

      const order = orderRes.data.order;

      // 2. Simulated Razorpay Checkout Verification
      setTimeout(async () => {
        try {
          const verifyRes = await api.post('/payments/verify', {
            bookingId,
            razorpayOrderId: order.id,
            razorpayPaymentId: `pay_rzp_${Date.now()}`,
            amount: booking?.amount || 500,
          });

          if (verifyRes.data.success) {
            setReceiptData(verifyRes.data.payment);
            setPaymentSuccess(true);
          }
        } catch (verifyErr) {
          setError('Payment verification failed');
        } finally {
          setProcessing(false);
        }
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Payment initiation failed');
      setProcessing(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Connecting to secure payment gateway..." fullScreen={true} />;
  }

  if (paymentSuccess) {
    return (
      <div className="max-w-lg mx-auto py-12 px-4 text-center space-y-6">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
          Payment Confirmed!
        </h1>
        <p className="text-sm text-gray-600">
          Your booking #{bookingId?.substring(bookingId.length - 6).toUpperCase()} has been confirmed. The technician has been dispatched.
        </p>

        <div className="bg-white p-6 rounded-3xl border border-gray-200 text-left space-y-3 text-xs">
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-400 font-semibold">Payment ID</span>
            <span className="font-mono font-bold text-gray-800">{receiptData?.razorpayPaymentId || `pay_${Date.now()}`}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-400 font-semibold">Amount Paid</span>
            <span className="font-bold text-emerald-600">₹{booking?.amount || 500} (INR)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400 font-semibold">Service</span>
            <span className="font-bold text-gray-800">{booking?.service}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate(`/tracking/${bookingId}`)}
            className="py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
          >
            Track Live Status <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate('/bookings')}
            className="py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm rounded-xl"
          >
            View Bookings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xl shadow-blue-500/5 p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
              Razorpay Secure Checkout
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Encrypted 256-bit payment gateway
            </p>
          </div>
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-full flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Escrow Protected
          </span>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Order Summary */}
        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400 font-medium block">Service Total</span>
            <p className="text-lg font-bold text-gray-900">{booking?.service} Booking</p>
          </div>
          <div className="text-right">
            <span className="text-xs text-gray-400 font-medium block">Payable Amount</span>
            <p className="text-2xl font-black text-blue-600">₹{booking?.amount || 500}</p>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
            Select Payment Mode
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'UPI', label: 'UPI / GPay', icon: QrCode },
              { id: 'CARD', label: 'Debit / Credit', icon: CreditCard },
              { id: 'NETBANKING', label: 'Net Banking', icon: Building },
            ].map((m) => {
              const IconComp = m.icon;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPaymentMethod(m.id)}
                  className={`p-4 rounded-2xl border text-center flex flex-col items-center gap-2 transition-all ${
                    paymentMethod === m.id
                      ? 'border-blue-600 bg-blue-50/60 text-blue-600 shadow-sm font-bold'
                      : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <IconComp className="w-6 h-6" />
                  <span className="text-xs">{m.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Pay Button */}
        <button
          onClick={handleRazorpayPay}
          disabled={processing}
          className="w-full py-4 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold text-base rounded-2xl shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2 transition-all"
        >
          <Lock className="w-4 h-4" />
          {processing ? 'Processing Payment with Razorpay...' : `Pay ₹${booking?.amount || 500} Securely`}
        </button>

        <p className="text-center text-[11px] text-gray-400">
          Payment is held in WORKLX escrow and released only after service satisfaction.
        </p>
      </div>
    </div>
  );
}
